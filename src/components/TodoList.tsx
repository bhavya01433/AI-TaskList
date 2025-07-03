"use client";

import React from "react";
import styles from "../styles/Home.module.css";
import ReactMarkdown from "react-markdown";

export type Todo = {
  text: string;
  completed: boolean;
};

type Props = {
  todos: Todo[];
  editingIndex: number | null;
  setEditingIndex: (i: number | null) => void;
  editValue: string;
  setEditValue: (val: string) => void;
  saveEditedTask: () => void;
  handleDeleteTask: (index: number) => void;
  toggleComplete: (index: number) => void;
  setShowCompletedEditMessage: (val: boolean) => void;
};

const TodoList: React.FC<Props> = ({
  todos,
  editingIndex,
  setEditingIndex,
  editValue,
  setEditValue,
  saveEditedTask,
  handleDeleteTask,
  toggleComplete,
  setShowCompletedEditMessage,
}) => {
  if (!todos.length) return null;

  return (
    <ul className={styles.list}>
      {todos.map((todo, index) => (
        <li
          key={index}
          className={`${styles.item} ${todo.completed ? styles.completed : ""}`}
        >
          <div className={styles.taskContent}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(index)}
              className={styles.checkbox}
            />

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
                rows={3}
              />
            ) : (
              <div className={styles.taskText}>
                <ReactMarkdown>{todo.text}</ReactMarkdown>
              </div>
            )}
          </div>

          <div className={styles.taskActions}>
            <button
              className={`${styles.taskButton} ${
                todo.completed ? styles.fakeDisabled : ""
              }`}
              onClick={() => {
                if (todo.completed) {
                  setShowCompletedEditMessage(true);
                  return;
                }
                setEditingIndex(index);
                setEditValue(todo.text);
              }}
            >
              ✏️
            </button>

            <button
              className={styles.taskButton}
              onClick={() => handleDeleteTask(index)}
            >
              🗑️
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
