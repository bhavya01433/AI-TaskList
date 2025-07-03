"use client";
import React from "react";
import styles from "../styles/Home.module.css";

type Props = {
  input: string;
  setInput: (val: string) => void;
  askGemini: () => void;
  loading: boolean;
};

const TodoInput: React.FC<Props> = ({
  input,
  setInput,
  askGemini,
  loading,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loading && input.trim()) askGemini();
  };

  return (
    <form className={styles.inputWrap} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        placeholder="Ask AI to create tasks"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button className={styles.button} type="submit" disabled={loading}>
        {loading ? "Thinking..." : "Generate"}
      </button>
    </form>
  );
};

export default TodoInput;
