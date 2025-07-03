"use client";
import React, { useState } from "react";
import styles from "../styles/Home.module.css";
import { Todo } from "./TodoList";

type Props = {
  addManualTodo: (todo: Todo) => void;
};

const ManualInput: React.FC<Props> = ({ addManualTodo }) => {
  const [manual, setManual] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manual.trim()) {
      addManualTodo({ text: manual.trim(), completed: false });
      setManual("");
    }
  };

  return (
    <form className={styles.inputWrapper} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        placeholder="Manually add a task"
        value={manual}
        onChange={(e) => setManual(e.target.value)}
      />
      <button className={styles.button} type="submit">
        Quick Add
      </button>
    </form>
  );
};

export default ManualInput;
