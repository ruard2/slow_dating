export const legacySdClientBridge = String.raw`
(function () {
  const callbacks = {};
  const inviteCallbacks = [];
  const params = new URLSearchParams(location.search);
  const player = params.get("role") === "partner" ? "2" : "1";
  const code = params.get("code") || "LOCAL";
  localStorage.setItem("comm_code", code);
  localStorage.setItem("comm_player", player);

  function fire(event, data) {
    (callbacks[event] || []).forEach(function (callback) {
      try { callback(data); } catch (error) { console.error("[legacy bridge]", error); }
    });
  }

  function send(legacyEvent, data) {
    parent.postMessage({
      source: "slow-dating-legacy",
      legacyEvent: legacyEvent,
      data: data || {}
    }, location.origin);
  }

  function cleanText(value, maximum) {
    return String(value == null ? "" : value).replace(/\s+/g, " ").trim().slice(0, maximum);
  }

  function elementKey(element) {
    return cleanText(
      element.id ||
      element.getAttribute("name") ||
      element.getAttribute("data-id") ||
      element.getAttribute("data-value") ||
      element.className ||
      element.tagName,
      160
    );
  }

  const originalSetItem = Storage.prototype.setItem;
  Storage.prototype.setItem = function (key, value) {
    originalSetItem.call(this, key, value);
    if (
      this !== localStorage ||
      /password|passwd|secret|token|auth|comm_code|comm_player|code$/i.test(key)
    ) return;
    send("local_state_saved", {
      key: cleanText(key, 160),
      value: cleanText(value, 20000)
    });
  };

  function observeChoices() {
    document.addEventListener("change", function (event) {
      const element = event.target;
      if (!element || !element.matches || !element.matches("input,select,textarea")) return;
      if (element.type === "password") return;
      send("ui_value_changed", {
        element: elementKey(element),
        inputType: cleanText(element.type || element.tagName, 40),
        value: element.type === "checkbox" || element.type === "radio"
          ? cleanText(element.value || element.checked, 500)
          : cleanText(element.value, 2000),
        checked: typeof element.checked === "boolean" ? element.checked : undefined
      });
    }, true);

    document.addEventListener("click", function (event) {
      const element = event.target && event.target.closest
        ? event.target.closest(
            "button,[role='button'],a,[data-choice],[data-value],.choice,.option,.chip,.card,.tile"
          )
        : null;
      if (!element) return;
      send("ui_choice_selected", {
        element: elementKey(element),
        label: cleanText(
          element.getAttribute("aria-label") ||
          element.getAttribute("title") ||
          element.textContent,
          500
        ),
        value: cleanText(
          element.getAttribute("data-value") ||
          element.getAttribute("data-id") ||
          "",
          500
        )
      });
    }, true);
  }

  addEventListener("message", function (event) {
    if (event.origin !== location.origin || !event.data || event.data.type !== "slow-dating:legacy-event") return;
    const payload = event.data.payload || {};
    if (payload.legacyEvent === "game_invite") {
      inviteCallbacks.forEach(function (callback) { callback(payload.data); });
      return;
    }
    fire(payload.legacyEvent, payload.data);
  });

  const client = {
    on: function (event, callback) {
      callbacks[event] = callbacks[event] || [];
      callbacks[event].push(callback);
    },
    create: function (app) {
      fire("session_created", { code: code, player: player, app: app, state: {} });
      fire("both_connected", { code: code });
    },
    join: function (_code, app) {
      fire("session_joined", { code: code, player: player, app: app, state: {} });
      fire("both_connected", { code: code });
    },
    joinOrCreate: function (_code, app) {
      fire("session_joined", { code: code, player: player, app: app, state: {} });
      setTimeout(function () { fire("both_connected", { code: code }); }, 0);
    },
    announceGame: function (gameKey, gameName) {
      send("game_invite", { game: gameKey, name: gameName });
    },
    onGameInvite: function (callback) { inviteCallbacks.push(callback); },
    done: function (data) { send("session_complete", data); },
    progress: function (data) { send("partner_progress", data); },
    chat: function (text, options) {
      send("open_chat", {
        text: text,
        autoSend: Boolean(options && options.autoSend),
        returnToMap: Boolean(options && options.returnToMap)
      });
    },
    sendTyping: function () {},
    reset: function () { send("reset", {}); },
    getCode: function () { return code; },
    getPlayer: function () { return player; },
    isActive: function () { return true; }
  };

  window.SDClient = client;
  window.KoppelClient = client;
  observeChoices();

  function removeLegacyShell() {
    document.querySelectorAll("button, a, [role='button'], .modus-card").forEach(function (element) {
      const text = (element.textContent || "").trim().toLowerCase();
      const action = (element.getAttribute("onclick") || "").toLowerCase();
      if (
        action.includes("solo") ||
        /^(solo verkennen|alleen spelen|speel alleen|toch alleen spelen|alleen ontdekken)$/.test(text) ||
        /^(begin samen|doe mee met koppelcode|maak koppelcode|ik heb een koppelcode)$/.test(text.replace(/^[^a-z]+/, "")) ||
        /^(kaart|← kaart|terug naar de kaart)$/.test(text) ||
        (element.getAttribute("href") || "").endsWith("world.html") ||
        action.includes("world.html") ||
        action.includes("togglechat") ||
        action.includes("openchat") ||
        action.includes("sendchat") ||
        action.includes("togglecall") ||
        action.includes("answercall") ||
        element.hasAttribute("data-comm-call") ||
        element.hasAttribute("data-comm-badge")
      ) {
        element.remove();
      }
    });
  }

  function enforceCoupleOnly() {
    const style = document.createElement("style");
    style.textContent = [
      "#comm-bar,#sd-chat-root,#sd-chat-toggle,#sd-chat-panel",
      "#__cl_root,#__cl_chat_fab,#__cl_chat_panel,#__cl_call",
      "#onth-chat,#onth-call",
      "[id*='chat-panel'],[id='chat-screen'],[id='screen-chat']",
      "[class*='chat-fab'],[class*='comm-bar']"
    ].join(",") + "{display:none!important}";
    document.head.appendChild(style);
    removeLegacyShell();
    new MutationObserver(removeLegacyShell).observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      enforceCoupleOnly();
    }, { once: true });
  } else {
    enforceCoupleOnly();
  }

  addEventListener("load", function () {
    if (!location.pathname.endsWith("/kennismaking.html")) return;
    setTimeout(function () {
      if (!window._kmState || !window._kmGoNiveau) return;
      window._kmState.code = code;
      window._kmState.player = player;
      window._kmState.solo = false;
      window._kmGoNiveau();
    }, 0);
  }, { once: true });
})();
`;

export const legacyCommBridge = String.raw`
(function () {
  function open(kind, detail) {
    parent.postMessage({
      source: "slow-dating-legacy",
      legacyEvent: "open_" + kind,
      data: detail || {}
    }, location.origin);
  }
  window.CommLayer = {
    renderControls: function () {},
    setSession: function () {},
    toggleChat: function () { open("chat"); },
    openChat: function (text) { open("chat", { text: text || "" }); },
    closeChat: function () {},
    sendChat: function (text) { open("chat", { text: text || "" }); },
    toggleCall: function () { open("call"); },
    answerCall: function () { open("call"); },
    declineCall: function () {},
    toggleSett: function () { open("pair"); },
    closeSett: function () {},
    closeProgress: function () {},
    getUnread: function () { return 0; },
    isInCall: function () { return false; },
    setCallingPref: function () {},
    askUnlock: function () {},
    answerUnlock: function () {},
    relockCall: function () {},
    showNoReason: function () {},
    withdrawNo: function () {},
    unpair: function () { open("pair"); },
    onChatMessage: function () {},
    onTyping: function () {}
  };
})();
`;
