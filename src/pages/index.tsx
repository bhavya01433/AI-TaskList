"use client";
import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import TodoInput from "../components/TodoInput";
import ManualInput from "../components/ManualInput";
import TodoList from "../components/TodoList";

export default function Home() {
  const [input, setInput] = useState("");
  const [manualInput, setManualInput] = useState("");
  const [todos, setTodos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [mode, setMode] = useState<"none" | "edit" | "delete">("none");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  // Clear toast message after 3s
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Ask Gemini to generate tasks
  const askGemini = async () => {
    if (!input.trim()) {
      setMessage("Please enter something for AI to process.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();

      if (data.result) {
        const cleaned = data.result.trim();
        setTodos((prev) => [...prev, cleaned]);
        setMessage("AI response added as a single task ✨");
      } else {
        setMessage("No response from Gemini.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setMessage("Something went wrong. Gemini bailed.");
    } finally {
      setLoading(false);
    }
  };

  // Add manual task
  const addManualTodo = () => {
    if (!manualInput.trim()) {
      setMessage("Please enter a manual task.");
      return;
    }
    setTodos((prev) => [...prev, manualInput.trim()]);
    setManualInput("");
    setMessage("Task added manually ✅");
  };

  // Save inline edit
  const saveEditedTask = () => {
    if (editingIndex !== null && editValue.trim()) {
      const updated = [...todos];
      updated[editingIndex] = editValue.trim();
      setTodos(updated);
      setEditingIndex(null);
      setEditValue("");
      setMode("none");
      setMessage(`Task #${editingIndex} updated ✏️`);
    }
  };

  // Delete task by index
  const handleDeleteTask = (index: number) => {
    const updated = [...todos];
    updated.splice(index, 1);
    setTodos(updated);
    setMode("none");
    setMessage(`Task #${index} deleted 🗑️`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🤖 AI ToDo List + You</h1>

      {message && <div className={styles.toast}>{message}</div>}

      {/* AI Task Input */}
      <TodoInput
        input={input}
        setInput={setInput}
        askGemini={askGemini}
        loading={loading}
      />

      {/* Manual Task Input */}
      <ManualInput
        manualInput={manualInput}
        setManualInput={setManualInput}
        addManualTodo={addManualTodo}
      />

      {/* Edit/Delete Mode Buttons */}
      {todos.length > 0 && (
        <div className={styles.globalActions}>
          <button
            className={`${styles.actionButton} ${
              mode === "edit" ? styles.active : ""
            }`}
            onClick={() => {
              setMode(mode === "edit" ? "none" : "edit");
              setEditingIndex(null);
            }}
          >
            ✏️ Edit Mode
          </button>
          <button
            className={`${styles.actionButton} ${
              mode === "delete" ? styles.active : ""
            }`}
            onClick={() => {
              setMode(mode === "delete" ? "none" : "delete");
              setEditingIndex(null);
            }}
          >
            🗑️ Delete Mode
          </button>
        </div>
      )}

      {/* Task List */}
      <TodoList
        todos={todos}
        mode={mode}
        editingIndex={editingIndex}
        setEditingIndex={setEditingIndex}
        editValue={editValue}
        setEditValue={setEditValue}
        saveEditedTask={saveEditedTask}
        handleDeleteTask={handleDeleteTask}
      />
    </div>
  );
}
