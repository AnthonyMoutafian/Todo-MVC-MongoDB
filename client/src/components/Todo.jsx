import { useEffect, useState } from "react";
import {
  getCurrentUser,
  addTodo,
  editTodo,
  saveTodo,
  doneTodo,
  deleteTodo,
  logoutUser,
} from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Todo() {
  const [todos, setTodos] = useState([]);
  const [value, setValue] = useState("");
  const [loggedIn, setLoggedIn] = useState(true);
  const navigate = useNavigate();

  async function loadTodos() {
    try {
      const data = await getCurrentUser();

      if (!data.success) {
        setLoggedIn(false);
        return;
      }

      setTodos(data.todos || []);
    } catch (err) {
      setLoggedIn(false);
    }
  }

  useEffect(() => {
    loadTodos();
  }, []);

  async function createTodo(e) {
    e.preventDefault();

    await addTodo(value);

    setValue("");

    loadTodos();
  }

  async function handleEdit(id) {
    await editTodo(id);

    loadTodos();
  }

  async function handleSave(id, todo) {
    await saveTodo(id, todo);

    loadTodos();
  }

  async function handleDone(id) {
    await doneTodo(id);

    loadTodos();
  }

  async function handleDelete(id) {
    await deleteTodo(id);

    loadTodos();
  }

  async function logout() {
    await logoutUser();

    setLoggedIn(false);
    setTodos([]);
    navigate("/login");
  }

  if (!loggedIn) {
    return (
      <div className="todoContainer">
        <div className="todoBox">
          <h2>You need to login first</h2>
          <a href="/login">Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="todoContainer">
      <div className="todoBox">
        <form className="todoForm" onSubmit={createTodo}>
          <input
            placeholder="Add Todo"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <button type="submit">+</button>
        </form>

        <div className="todosBox">
          {todos.map((todo) => (
            <div className="todo" key={todo._id}>
              <input
                className={`todoInput
                ${todo.isEditing ? "editableTodo" : ""}
                ${todo.isChecked ? "checkedTodo" : ""}`}
                type="text"
                value={todo.todo}
                disabled={!todo.isEditing || todo.isChecked}
                onChange={(e) => {
                  setTodos(
                    todos.map((t) =>
                      t._id === todo._id
                        ? {
                            ...t,
                            todo: e.target.value,
                          }
                        : t,
                    ),
                  );
                }}
              />

              {!todo.isChecked && (
                <button
                  className="editBtn"
                  onClick={() =>
                    todo.isEditing
                      ? handleSave(todo._id, todo.todo)
                      : handleEdit(todo._id)
                  }
                >
                  {todo.isEditing ? (
                    <i className="bi bi-floppy"></i>
                  ) : (
                    <i className="bi bi-pencil-fill"></i>
                  )}
                </button>
              )}

              <div>
                {!todo.isChecked && (
                  <button
                    className="doneBtn"
                    onClick={() => handleDone(todo._id)}
                  >
                    <i className="bi bi-check-circle-fill"></i>
                  </button>
                )}

                <button
                  className="deleteBtn"
                  onClick={() => handleDelete(todo._id)}
                >
                  <i className="bi bi-trash3"></i>
                </button>
              </div>
            </div>
          ))}
        </div>

        <button className="logOutBtn" onClick={logout}>
          LogOut
        </button>
      </div>
    </div>
  );
}
