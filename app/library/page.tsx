"use client";

import { useState } from "react";
import { useAppContext } from "@/lib/AppContext";
import { showToast } from "@/components/Toast";

export default function LibraryPage() {
  const { isPremium, setIsPremium, folders, addFolder, deleteFolder, renameFolder } = useAppContext();
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [expandedFolderId, setExpandedFolderId] = useState<string | null>(null);

  const totalWords = folders.reduce((acc, f) => acc + f.words.length, 0);
  const totalQuestions = folders.reduce((acc, f) => acc + f.questions.length, 0);

  const wordLimit = 1000;
  const questionLimit = 500;

  if (!isPremium) {
    return (
      <div className="section" style={{ paddingTop: "2.5rem" }}>
        <div className="container">
          <div className="card" style={{ textAlign: "center", padding: "4rem 2rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔒</div>
            <h2 style={{ marginBottom: "1rem" }}>Premium Feature</h2>
            <p style={{ color: "var(--foreground-muted)", marginBottom: "2rem", maxWidth: "500px", margin: "0 auto 2rem" }}>
              Library and folder management is only available for premium members. Upgrade now to organize your study materials.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <a href="/pricing" className="btn-primary">Upgrade to Premium</a>
              <button onClick={() => setIsPremium(true)} className="btn-secondary">Simulate Premium (Dev)</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    addFolder(newFolderName.trim());
    setNewFolderName("");
  };

  const handleStartRename = (id: string, currentName: string) => {
    setEditingFolderId(id);
    setEditingName(currentName);
  };

  const handleSaveRename = (id: string) => {
    if (!editingName.trim()) return;
    renameFolder(id, editingName.trim());
    setEditingFolderId(null);
  };

  return (
    <div className="section" style={{ paddingTop: "2.5rem" }}>
      <div className="container">
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          
          <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1 style={{ margin: "0 0 0.5rem", fontSize: "clamp(2rem, 5vw, 3rem)" }}>
                My Library
              </h1>
              <p style={{ color: "var(--foreground-muted)" }}>Manage your custom study sets and folders.</p>
            </div>
            <button onClick={() => setIsPremium(false)} className="btn-secondary" style={{ color: "var(--rose)", borderColor: "var(--rose)" }}>
              Dev: Lock Premium
            </button>
          </div>

          {/* Limits Overview */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
            <div className="card" style={{ padding: "1.5rem" }}>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--foreground-muted)" }}>Total Words</p>
              <p style={{ margin: "0.25rem 0 0.5rem", fontSize: "2rem", fontWeight: 800 }}>{totalWords} / {wordLimit}</p>
              <div style={{ height: "6px", background: "var(--border)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ width: `${(totalWords / wordLimit) * 100}%`, height: "100%", background: "var(--primary)" }} />
              </div>
            </div>
            <div className="card" style={{ padding: "1.5rem" }}>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--foreground-muted)" }}>Total Questions</p>
              <p style={{ margin: "0.25rem 0 0.5rem", fontSize: "2rem", fontWeight: 800 }}>{totalQuestions} / {questionLimit}</p>
              <div style={{ height: "6px", background: "var(--border)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ width: `${(totalQuestions / questionLimit) * 100}%`, height: "100%", background: "var(--primary)" }} />
              </div>
            </div>
          </div>

          {/* Create Folder Form */}
          <div className="card" style={{ marginBottom: "2rem", padding: "1.5rem" }}>
            <form onSubmit={handleCreateFolder} style={{ display: "flex", gap: "1rem" }}>
              <input 
                type="text" 
                className="input-base" 
                placeholder="New folder name..." 
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn-primary">Create Folder</button>
            </form>
          </div>

          {/* Folders List */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem" }}>
            {folders.map(folder => (
              <div key={folder.id} className="card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  {editingFolderId === folder.id ? (
                    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                      <input 
                        type="text" 
                        className="input-base" 
                        value={editingName} 
                        onChange={(e) => setEditingName(e.target.value)}
                        style={{ padding: "0.25rem 0.5rem", fontSize: "0.875rem" }}
                      />
                      <button onClick={() => handleSaveRename(folder.id)} className="btn-primary" style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}>Save</button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <h3 style={{ margin: 0, fontSize: "1.125rem" }}>{folder.name}</h3>
                      <button onClick={() => handleStartRename(folder.id, folder.name)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.875rem", color: "var(--foreground-faint)" }}>✏️</button>
                    </div>
                  )}
                  <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--foreground-muted)" }}>{folder.words.length} words</p>
                  <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--foreground-muted)" }}>{folder.questions.length} questions</p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
                  <button 
                    className="btn-secondary" 
                    style={{ padding: "0.375rem 0.75rem", fontSize: "0.8125rem" }}
                    onClick={() => setExpandedFolderId(expandedFolderId === folder.id ? null : folder.id)}
                  >
                    {expandedFolderId === folder.id ? "Hide Content ▲" : "View Content ▼"}
                  </button>
                  <button 
                    onClick={() => {
                      if (confirm(`Delete folder "${folder.name}"?`)) {
                        deleteFolder(folder.id);
                        showToast(`Folder "${folder.name}" deleted.`, "success");
                      }
                    }} 
                    className="btn-secondary" 
                    style={{ padding: "0.375rem 0.75rem", fontSize: "0.8125rem", color: "var(--premium-red)", borderColor: "rgba(239, 68, 68, 0.2)" }}
                  >
                    Delete
                  </button>
                </div>

                {/* Expanded Content Panel */}
                {expandedFolderId === folder.id && (
                  <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
                    {folder.words.length === 0 && folder.questions.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "1.5rem", color: "var(--foreground-faint)", fontSize: "0.875rem" }}>
                        <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>📂</div>
                        <p style={{ margin: 0 }}>This folder is empty.</p>
                        <p style={{ margin: "0.5rem 0 0", fontSize: "0.8125rem" }}>Words and questions from practice sessions will appear here.</p>
                      </div>
                    ) : (
                      <div>
                        {folder.words.length > 0 && (
                          <div style={{ marginBottom: "1rem" }}>
                            <p style={{ margin: "0 0 0.5rem", fontSize: "0.8125rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--foreground-muted)" }}>Words ({folder.words.length})</p>
                            {folder.words.slice(0, 5).map((w, i) => (
                              <div key={i} style={{ fontSize: "0.875rem", padding: "0.375rem 0", borderBottom: "1px solid var(--border-subtle)", color: "var(--foreground)" }}>{String(w)}</div>
                            ))}
                            {folder.words.length > 5 && <p style={{ margin: "0.5rem 0 0", fontSize: "0.75rem", color: "var(--foreground-faint)" }}>+{folder.words.length - 5} more words</p>}
                          </div>
                        )}
                        {folder.questions.length > 0 && (
                          <div>
                            <p style={{ margin: "0 0 0.5rem", fontSize: "0.8125rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--foreground-muted)" }}>Questions ({folder.questions.length})</p>
                            {folder.questions.slice(0, 3).map((q, i) => (
                              <div key={i} style={{ fontSize: "0.875rem", padding: "0.375rem 0", borderBottom: "1px solid var(--border-subtle)", color: "var(--foreground)" }}>{String(q)}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
