const API = import.meta.env.VITE_API_URL;

export async function registerUser(data) {
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await res.json();
}

export async function loginUser(data) {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await res.json();
}

export async function getCurrentUser() {
  const res = await fetch(`${API}/todo`);

  return await res.json();
}

export async function addTodo(todo) {
  const res = await fetch(`${API}/todo/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      todo,
    }),
  });

  return await res.json();
}

export async function editTodo(id) {
  return await fetch(`${API}/todo/edit/${id}`, {
    method: "POST",
  });
}

export async function saveTodo(id, todo) {
  return await fetch(`${API}/todo/save/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      todo,
    }),
  });
}

export async function doneTodo(id) {
  return await fetch(`${API}/todo/done/${id}`, {
    method: "POST",
  });
}

export async function deleteTodo(id) {
  return await fetch(`${API}/todo/delete/${id}`, {
    method: "POST",
  });
}

export async function logoutUser() {
  return await fetch(`${API}/logout`, {
    method: "POST",
  });
}
export async function uploadAvatar(file) {
  const formData = new FormData();

  formData.append("avatar", file);

  const res = await fetch(`${API}/avatar`, {
    method: "PUT",
    body: formData,
  });

  return await res.json();
}

export async function deleteAvatar() {
  const res = await fetch(`${API}/avatar`, {
    method: "DELETE",
  });

  return res.json();
}

export async function uploadTodoImage(id, file) {
  const formData = new FormData();

  formData.append("image", file);

  const res = await fetch(`${API}/todo/${id}/image`, {
    method: "PUT",
    body: formData,
  });

  return res.json();
}

export async function deleteTodoImage(id) {
  const res = await fetch(`${API}/todo/${id}/image`, {
    method: "DELETE",
  });

  return res.json();
}
