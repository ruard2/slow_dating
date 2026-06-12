export function ShellIcon({
  name,
}: {
  name: "back" | "call" | "callLocked" | "chat" | "settings";
}) {
  const paths = {
    back: <path d="M15 18l-6-6 6-6M9 12h11" />,
    call: <path d="M7.2 3.8l2.1 4.6-2.2 1.8a15 15 0 0 0 6.7 6.7l1.8-2.2 4.6 2.1-.8 3.1c-.3 1.1-1.4 1.8-2.5 1.6C9.3 20.2 3.8 14.7 2.5 7.1c-.2-1.1.5-2.2 1.6-2.5l3.1-.8Z" />,
    callLocked: (
      <>
        <path d="M7.2 3.8l2.1 4.6-2.2 1.8a15 15 0 0 0 6.7 6.7l1.8-2.2 4.6 2.1-.8 3.1c-.3 1.1-1.4 1.8-2.5 1.6C9.3 20.2 3.8 14.7 2.5 7.1c-.2-1.1.5-2.2 1.6-2.5l3.1-.8Z" />
        <path d="M4 20 20 4" />
      </>
    ),
    chat: <path d="M4 5h16v11H9l-5 4V5Z" />,
    settings: (
      <>
        <circle cx="5" cy="12" r="1.4" />
        <circle cx="12" cy="12" r="1.4" />
        <circle cx="19" cy="12" r="1.4" />
      </>
    ),
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      {paths[name]}
    </svg>
  );
}
