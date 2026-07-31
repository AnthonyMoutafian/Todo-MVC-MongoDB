const API = import.meta.env.VITE_API_URL;

function authHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
}

export async function registerUser(data) {
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function loginUser(data) {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function getCurrentUser() {
  const res = await fetch(`${API}/todo`, {
    headers: authHeaders(),
  });

  return res.json();
}

export async function addTodo(todo) {
  const res = await fetch(`${API}/todo/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ todo }),
  });

  return res.json();
}

export async function editTodo(id) {
  const res = await fetch(`${API}/todo/edit/${id}`, {
    method: "POST",
    headers: authHeaders(),
  });

  return res.json();
}

export async function saveTodo(id, todo) {
  const res = await fetch(`${API}/todo/save/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ todo }),
  });

  return res.json();
}

export async function doneTodo(id) {
  const res = await fetch(`${API}/todo/done/${id}`, {
    method: "POST",
    headers: authHeaders(),
  });

  return res.json();
}

export async function deleteTodo(id) {
  const res = await fetch(`${API}/todo/delete/${id}`, {
    method: "POST",
    headers: authHeaders(),
  });

  return res.json();
}

export async function logoutUser() {
  const res = await fetch(`${API}/logout`, {
    method: "POST",
    headers: authHeaders(),
  });

  localStorage.removeItem("token");

  return res.json();
}

export async function uploadAvatar(file) {
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await fetch(`${API}/avatar`, {
    method: "PUT",
    headers: authHeaders(),
    body: formData,
  });

  return res.json();
}

export async function deleteAvatar() {
  const res = await fetch(`${API}/avatar`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  return res.json();
}

export async function uploadTodoImage(id, file) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API}/todo/${id}/image`, {
    method: "PUT",
    headers: authHeaders(),
    body: formData,
  });

  return res.json();
}

export async function deleteTodoImage(id) {
  const res = await fetch(`${API}/todo/${id}/image`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  return res.json();
}
