import React, { useState } from "react";
import ChatWindow from "./Chatwindow";
import ChatInput  from "./Chatinput";
import Sidebar    from "./Sidebar";
import "./App.css";

function App() {

  // Each message: { role: "user" | "assistant", content: string }
  const [messages, setMessages]   = useState([]);

  // isLoading — true while waiting for backend response
  const [isLoading, setIsLoading] = useState(false);

  // history — array of { id, label, sub }
  // Sidebar reads this to render the checkbox list
  const [history, setHistory]     = useState([
    { id: 1, label: "File upload", sub: "just now" }
  ]);

  // Which history item is currently selected (highlighted)
  const [activeConv, setActiveConv] = useState(1);

  // ── sendMessage ─────────────────────────────────────────
  // Called by <ChatInput> with (text, filesArray)
  const sendMessage = async (text, files) => {
    if (!text.trim() && files.length === 0) return;

    // 1. Show user bubble immediately
    const userMsg = { role: "user", content: text || `📎 ${files.map(f => f.name).join(", ")}` };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setIsLoading(true);

    // 2. Add to sidebar history on first message
    if (messages.length === 0) {
      setHistory(prev => [
        { id: Date.now(), label: text.slice(0, 38) || "New conversation", sub: "just now" },
        ...prev
      ]);
    }

    // 3. Call Python backend
    try {
      const formData = new FormData();
      formData.append("query", text);
      files.forEach(f => formData.append("files", f));

      const res  = await fetch("http://localhost:8000/chat", {
        method: "POST",
        body: formData   // FormData handles its own Content-Type header
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      setMessages([
        ...updated,
        { role: "assistant", content: data.answer || data.response || "No answer returned." }
      ]);
    } catch (err) {
      setMessages([
        ...updated,
        { role: "assistant", content: `⚠️ Error: ${err.message}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat and deselect history
  const startNewChat = () => {
    setMessages([]);
    setActiveConv(null);
  };
  const deleteConversations = (ids) => {
  setHistory(prev => prev.filter(item => !ids.includes(item.id)));

  // If active chat deleted → clear chat
  if (ids.includes(activeConv)) {
    setMessages([]);
    setActiveConv(null);
  }
};

  return (
    <div className="app">

      {/* Left column — header + messages + input */}
      <div className="chat-area">
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
        />
        <ChatInput
          sendMessage={sendMessage}
          isLoading={isLoading}
        />
      </div>

      {/* Right column — sidebar history panel */}
      <Sidebar
        history={history}
        activeConv={activeConv}
        onSelectConv={setActiveConv}
        onNewChat={startNewChat}
        onDelete={deleteConversations}
      />

    </div>
  );
}

export default App;
