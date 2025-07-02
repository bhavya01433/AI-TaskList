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
  return (
    <div className={styles.inputWrap}>
      <input
        className={styles.input}
        placeholder="Ask AI to create tasks"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button className={styles.button} onClick={askGemini} disabled={loading}>
        {loading ? "Thinking..." : "AI Add"}
      </button>
    </div>
  );
};

export default TodoInput;
