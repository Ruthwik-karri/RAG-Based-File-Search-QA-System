import React, { useEffect, useRef } from "react";


function ChatWindow({ messages, isLoading }) {

  // Auto-scroll to bottom whenever messages update
  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <>
      {/* ── Header ── */}
      <div className="chat-header">
        <div className="chat-header-icon">✦</div>
        <div>
          <div className="chat-header-title">File Chat</div>
          <div className="chat-header-sub">Pratice mode</div>
        </div>
        <div className="chat-header-status">
          <div className="status-dot" />
          Connected
        </div>
      </div>

      {/* ── Message list ── */}
      <div className="chat-window">

        {/* Welcome screen — shown only when no messages yet */}
        {messages.length === 0 && !isLoading && (
          <div className="welcome-state">
            <div className="welcome-icon">🔍</div>
            <div className="welcome-title">Hello! I'm your RAG assistant.</div>
            <div className="welcome-sub">
              Upload documents and ask me anything about them.<br />
              I'll search through your knowledge base to find the most relevant answers.
            </div>
          </div>
        )}

        {/* Render each message bubble */}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-row ${msg.role}`}
          >
            {/* Avatar */}
            <div className={`msg-avatar ${msg.role}`}>
              {msg.role === "assistant" ? "✦" : "U"}
            </div>

            {/* Bubble */}
            <div className={`msg-bubble ${msg.role}`}>
              {/* "Assistant" label above bot bubbles (matches screenshot) */}
              {msg.role === "assistant" && (
                <div className="msg-label">Assistant</div>
              )}
              {msg.content}
            </div>
          </div>
        ))}

        {/* Typing indicator — 3 bouncing dots */}
        {isLoading && (
          <div className="typing-row">
            <div className="msg-avatar assistant">✦</div>
            <div className="typing-dots">
              <span /><span /><span />
            </div>
          </div>
        )}

        {/* Invisible anchor for auto-scroll */}
        <div ref={bottomRef} />
      </div>
    </>
  );
}

export default ChatWindow;