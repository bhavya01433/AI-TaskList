"use client";

import React from "react";
import styles from "../styles/Home.module.css";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import ReactMarkdown from "react-markdown";

export type Todo = {
  text: string;
  completed: boolean;
};

type Props = {
  todos: Todo[];
  setTodos: (t: Todo[]) => void;
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
  setTodos,
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

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const updated = Array.from(todos);
    const [movedItem] = updated.splice(result.source.index, 1);
    updated.splice(result.destination.index, 0, movedItem);
    setTodos(updated);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="todo-list">
        {(provided) => (
          <ul
            className={styles.list}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {todos.map((todo, index) => (
              <Draggable
                key={index}
                draggableId={`todo-${index}`}
                index={index}
              >
                {(provided) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`${styles.item} ${
                      todo.completed ? styles.completed : ""
                    }`}
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
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TodoList;
