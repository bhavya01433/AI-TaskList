"use client";
import React from "react";
import styles from "../styles/Home.module.css";
import ReactMarkdown from "react-markdown";

type Props = {
  todos: string[];
  mode: "none" | "edit" | "delete";
  editingIndex: number | null;
  setEditingIndex: (i: number | null) => void;
  editValue: string;
  setEditValue: (val: string) => void;
  saveEditedTask: () => void;
  handleDeleteTask: (index: number) => void;
};

const TodoList: React.FC<Props> = ({
  todos,
  mode,
  editingIndex,
  setEditingIndex,
  editValue,
  setEditValue,
  saveEditedTask,
  handleDeleteTask,
}) => {
  return (
    <ul className={styles.list}>
      {todos.map((todo, index) => (
        <li key={index} className={styles.item}>
          {editingIndex === index ? (
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={saveEditedTask}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  saveEditedTask();
                }
              }}
              className={styles.fullTextarea}
              autoFocus
              rows={10}
            />
          ) : (
            <div
              onClick={() => {
                if (mode === "edit") {
                  setEditingIndex(index);
                  setEditValue(todo);
                } else if (mode === "delete") {
                  handleDeleteTask(index);
                }
              }}
              className={`${styles.todoBlock} ${
                mode !== "none" ? styles.clickableTask : ""
              }`}
            >
              <ReactMarkdown>{todo}</ReactMarkdown>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
