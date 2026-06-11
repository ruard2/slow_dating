export const legacySdClientBridge = String.raw`
(function () {
  const callbacks = {};
  const inviteCallbacks = [];
  const params = new URLSearchParams(location.search);
  const player = params.get("role") === "partner" ? "2" : "1";
  const code = params.get("code") || "LOCAL";

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
    chat: function (text) { send("open_chat", { text: text }); },
    sendTyping: function () {},
    reset: function () { send("reset", {}); },
    getCode: function () { return code; },
    getPlayer: function () { return player; },
    isActive: function () { return true; }
  };

  window.SDClient = client;
  window.KoppelClient = client;

  function removeSoloControls() {
    document.querySelectorAll("button, a, [role='button'], .modus-card").forEach(function (element) {
      const text = (element.textContent || "").trim().toLowerCase();
      const action = (element.getAttribute("onclick") || "").toLowerCase();
      if (
        action.includes("solo") ||
        /^(solo verkennen|alleen spelen|speel alleen|toch alleen spelen|alleen ontdekken)$/.test(text)
      ) {
        element.remove();
      }
    });
  }

  function enforceCoupleOnly() {
    removeSoloControls();
    new MutationObserver(removeSoloControls).observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enforceCoupleOnly, { once: true });
  } else {
    enforceCoupleOnly();
  }
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
