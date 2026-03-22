import React, { useState } from "react";

function Sidebar({ history, activeConv, onSelectConv, onNewChat, onDelete }) {

  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  // Toggle checkbox
  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Delete selected
  const handleDelete = () => {
    onDelete(selectedIds);
    setSelectedIds([]);
  };

  const filtered = history.filter(item =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="sidebar">

      {/* HEADER */}
      <div className="sidebar-header">
        <span>History</span>
        <button onClick={onNewChat}>＋</button>
      </div>

      {/* SHOW SELECTED COUNT */}
      {selectedIds.length > 0 && (
  <div className="sidebar-selected">
    <span>{selectedIds.length} selected</span>
    <button onClick={handleDelete}>Delete</button>
  </div>
)}

      {/* SEARCH */}
      <div className="sidebar-search">
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* NEW CHAT */}
       <div className="new-chat" onClick={onNewChat}>
  <b>+ New conversation</b>
  <div>Start a new conversation</div>
       </div>

      {/* LIST */}
      <div className="sidebar-list">
        {filtered.map(item => (
          <div
  key={item.id}
  className={`sidebar-item ${activeConv === item.id ? "active" : ""}`}
>

            {/* CHECKBOX */}
            <input
              type="checkbox"
              checked={selectedIds.includes(item.id)}
              onChange={() => toggleSelect(item.id)}
            />

            {/* TEXT */}
            <div
  className="sidebar-text"
  onClick={() => onSelectConv(item.id)}
>
  <div>{item.label}</div>
  <div>{item.sub}</div>
</div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;