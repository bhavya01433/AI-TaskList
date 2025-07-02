"use client";
import React from "react";
import styles from "../styles/Home.module.css";

type Props = {
  manualInput: string;
  setManualInput: (val: string) => void;
  addManualTodo: () => void;
};

const ManualInput: React.FC<Props> = ({
  manualInput,
  setManualInput,
  addManualTodo,
}) => {
  return (
    <div className={styles.inputWrap}>
      <input
        className={styles.input}
        placeholder="Add your own task"
        value={manualInput}
        onChange={(e) => setManualInput(e.target.value)}
      />
      <button className={styles.button} onClick={addManualTodo}>
        Add Manually
      </button>
    </div>
  );
};

export default ManualInput;
