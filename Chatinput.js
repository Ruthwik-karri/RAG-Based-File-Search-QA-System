import React, { useState, useRef, useEffect } from "react";

function ChatInput({ sendMessage, isLoading }) {

  const [input, setInput]   = useState("");
  const [files, setFiles]   = useState([]);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 138) + "px";
    }
  }, [input]);

  const handleFileChange = (e) => {
    const chosen = Array.from(e.target.files);
    setFiles(prev => [...prev, ...chosen]);
    e.target.value = ""; // allow re-selecting same file
  };

  const removeFile = (i) => {
    setFiles(prev => prev.filter((_, idx) => idx !== i));
  };

  // Send → lift data up → reset
  const handleSend = () => {
    if (isLoading) return;
    if (!input.trim() && files.length === 0) return;
    sendMessage(input.trim(), files);
    setInput("");
    setFiles([]);
  };

  // Enter = send  |  Shift+Enter = newline
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = !isLoading && (input.trim().length > 0 || files.length > 0);

  return (
    <div className="chat-input-area">
      <div className="chat-input-card">

        {/* File chips — only shown when files are attached */}
        {files.length > 0 && (
          <div className="file-chips">
            {files.map((f, i) => (
              <div key={i} className="file-chip">
                <span>📎 {f.name}</span>
                <button className="file-chip-remove" onClick={() => removeFile(i)}>
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input row: paperclip | textarea | send */}
        <div className="chat-input-row">

          {/* Hidden file input — triggered by the paperclip button */}
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: "none" }}
            multiple
            accept=".pdf,.txt,.docx,.md,.csv"
            onChange={handleFileChange}
          />

          {/* Paperclip icon button */}
          <button
            className="attach-btn"
            title="Attach file"
            onClick={() => fileInputRef.current?.click()}
          >
            📎
          </button>

          {/* Auto-resize textarea */}
          <textarea
            ref={textareaRef}
            className="chat-textarea"
            placeholder="Ask anything about your documents..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />

          {/* Send button */}
          <button
            className="send-btn"
            onClick={handleSend}
            disabled={!canSend}
            title="Send (Enter)"
          >
            ➤
          </button>
        </div>
      </div>

     
    </div>
  );
}

export default ChatInput;