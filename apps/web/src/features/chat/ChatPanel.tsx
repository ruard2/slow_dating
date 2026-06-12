import { useEffect, useRef, useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { Message, Pair } from "@slow-dating/contracts";

import styles from "../../App.module.css";
import { ShellIcon } from "../../app/ShellIcon";
import { api } from "../../lib/api";
import { useRealtime } from "../../providers/RealtimeProvider";
import { useSession } from "../../providers/SessionProvider";

function formatMessageTime(value: string) {
  return new Intl.DateTimeFormat("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function ChatPanel({
  pair,
  partnerOnline,
}: {
  pair: Pair | null | undefined;
  partnerOnline: boolean;
}) {
  const { session } = useSession();
  const { lastEvent, send } = useRealtime();
  const queryClient = useQueryClient();
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const [text, setText] = useState("");
  const messages = useQuery<Message[]>({
    queryKey: ["messages", pair?.id],
    queryFn: api.getMessages,
    enabled: Boolean(pair),
  });

  useEffect(() => {
    if (lastEvent?.type === "chat.message") {
      const message = lastEvent.payload as Message;
      queryClient.setQueryData<Message[]>(
        ["messages", pair?.id],
        (current = []) =>
          current.some((item) => item.id === message.id)
            ? current
            : [...current, message],
      );
    }
  }, [lastEvent, pair?.id, queryClient]);

  useEffect(() => {
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.data]);

  function submit(event: FormEvent) {
    event.preventDefault();
    const value = text.trim();
    if (!value) return;
    send("chat.send", { clientId: crypto.randomUUID(), text: value });
    setText("");
  }

  if (!pair || pair.members.length < 2) {
    return <p>Koppel eerst met je partner om te chatten.</p>;
  }

  const partner = pair.members.find(
    (member) => member.installationId !== session?.installationId,
  );

  return (
    <div className={styles.chat}>
      <header className={styles.chatHeader}>
        <div className={styles.chatAvatar}>
          {(partner?.displayName ?? "P").slice(0, 1).toUpperCase()}
        </div>
        <div>
          <strong>{partner?.displayName ?? "Je partner"}</strong>
          <span data-online={partnerOnline}>
            <i />
            {partnerOnline ? "Online" : "Offline"}
          </span>
        </div>
      </header>
      <div className={styles.messages} ref={messagesRef}>
        {!messages.isPending && messages.data?.length === 0 && (
          <div className={styles.emptyChat}>
            <ShellIcon name="chat" />
            <strong>Begin jullie gesprek</strong>
            <span>
              Berichten blijven beschikbaar na het wisselen van spel.
            </span>
          </div>
        )}
        {messages.data?.map((message) => {
          const own =
            message.senderInstallationId === session?.installationId;
          return (
            <article data-own={own} key={message.id}>
              {!own && <strong>{message.senderName}</strong>}
              <p>{message.text}</p>
              <time dateTime={message.sentAt}>
                {formatMessageTime(message.sentAt)}
              </time>
            </article>
          );
        })}
      </div>
      <form className={styles.chatComposer} onSubmit={submit}>
        <textarea
          aria-label="Bericht"
          maxLength={2_000}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
          }}
          placeholder="Schrijf iets..."
          rows={1}
          value={text}
        />
        <button
          aria-label="Bericht versturen"
          disabled={!text.trim()}
          type="submit"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="m4 4 17 8-17 8 3-8-3-8Zm3 8h14" />
          </svg>
        </button>
      </form>
    </div>
  );
}
