"use client";

import { useState, useEffect, use } from "react";
import styles from "../styles/Home.module.css";
import TodoList from "../components/TodoList";
import TodoInput from "../components/TodoInput";
import ManualInput from "../components/ManualInput";
import { json } from "stream/consumers";

export type Todo = {
  text: string;
  completed: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [message, setMessage] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showCompletedEditMessage, setShowCompletedEditMessage] =
    useState(false);

  // Toast message
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (showCompletedEditMessage) {
      setMessage("You can't edit a completed task ❌");
      const timer = setTimeout(() => setShowCompletedEditMessage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showCompletedEditMessage]);

  //Local Storage
  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const askGemini = async () => {
    if (!input.trim()) {
      setMessage("Please enter a description.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/generateTasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.json();
      const tasks: string[] = data.tasks || [];
      const formatted = tasks.map((t: string) => ({
        text: t,
        completed: false,
      }));

      setTodos((prev) => [...prev, ...formatted]);
      setMessage("AI-generated tasks added ✨");
      setInput("");
    } catch (err) {
      console.error("Gemini error:", err);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  //Edit task
  const saveEditedTask = () => {
    if (editingIndex !== null && editValue.trim()) {
      const updated = [...todos];
      updated[editingIndex] = {
        ...updated[editingIndex],
        text: editValue.trim(),
      };
      setTodos(updated);
      setEditingIndex(null);
      setEditValue("");
      setMessage(`Task updated ✏️`);
    }
  };

  //Delete task
  const handleDeleteTask = (index: number) => {
    const updated = [...todos];
    updated.splice(index, 1);
    setTodos(updated);
    setMessage(`Task deleted 🗑️`);
  };

  //Complete task
  const toggleComplete = (index: number) => {
    const updated = [...todos];
    updated[index].completed = !updated[index].completed;
    setTodos(updated);
  };

  //New chat
  const startNewTaskList = () => {
    setTodos([]);
    localStorage.removeItem("todos");
    setMessage("New Task List Started ✅ ");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🤖 AI ToDo List + You</h1>
      {message && <div className={styles.toast}>{message}</div>}
      <button className={styles.newListButton} onClick={startNewTaskList}>
        🆕 New Task List
      </button>

      <TodoInput
        input={input}
        setInput={setInput}
        askGemini={askGemini}
        loading={loading}
      />

      <ManualInput
        addManualTodo={(todo: Todo) => {
          setTodos((prev) => [...prev, todo]);
          setMessage("Manual task added ✅");
        }}
      />

      <TodoList
        todos={todos}
        setTodos={setTodos}
        editingIndex={editingIndex}
        setEditingIndex={setEditingIndex}
        editValue={editValue}
        setEditValue={setEditValue}
        saveEditedTask={saveEditedTask}
        handleDeleteTask={handleDeleteTask}
        toggleComplete={toggleComplete}
        setShowCompletedEditMessage={setShowCompletedEditMessage}
      />
    </div>
  );
}
