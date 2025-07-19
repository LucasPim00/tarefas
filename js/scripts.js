const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterSelect = document.querySelector("#filter-select");
const viewApiBtn = document.querySelector("#view-api");

let oldTodo = null;
const API_URL = "http://localhost:3001/api/todos";

// Carregar tarefas da API
const loadTodos = async () => {
  const res = await fetch(API_URL);
  const todos = await res.json();
  renderTodos(todos);
};

// Exibir tarefas na interface
const renderTodos = (todos) => {
  todoList.innerHTML = "";
  todos.forEach((todo) => {
    const div = document.createElement("div");
    div.classList.add("todo");
    if (todo.completed) div.classList.add("done");

    const h3 = document.createElement("h3");
    h3.innerText = todo.title;

    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    doneBtn.addEventListener("click", () => toggleDone(todo));

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    editBtn.addEventListener("click", () => openEdit(todo));

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-todo");
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

    div.append(h3, doneBtn, editBtn, deleteBtn);
    todoList.appendChild(div);
  });
};

// Adicionar tarefa na API
const addTodo = async (title) => {
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  await loadTodos();
};

// Marcar/desmarcar tarefa como feita
const toggleDone = async (todo) => {
  await fetch(`${API_URL}/${todo.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: todo.title, completed: !todo.completed }),
  });
  await loadTodos();
};

// Excluir tarefa
const deleteTodo = async (id) => {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  await loadTodos();
};

// Abrir modo de edição
const openEdit = (todo) => {
  toggleForms();
  editInput.value = todo.title;
  oldTodo = todo;
};

// Atualizar tarefa editada
const updateTodo = async (newTitle) => {
  await fetch(`${API_URL}/${oldTodo.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: newTitle, completed: oldTodo.completed }),
  });
  toggleForms();
  await loadTodos();
};

// Alternar entre os formulários
const toggleForms = () => {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};

// Abrir a API em nova aba
viewApiBtn.addEventListener("click", () => {
  window.open(API_URL, "_blank");
});

// Eventos
todoForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = todoInput.value.trim();
  if (title) {
    await addTodo(title);
    todoInput.value = "";
  }
});

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newTitle = editInput.value.trim();
  if (newTitle) {
    await updateTodo(newTitle);
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value.toLowerCase();
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    const title = todo.querySelector("h3").innerText.toLowerCase();
    todo.style.display = title.includes(search) ? "flex" : "none";
  });
});

eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();
  searchInput.value = "";
  searchInput.dispatchEvent(new Event("keyup"));
});

filterSelect.addEventListener("change", (e) => {
  const value = e.target.value;
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    const isDone = todo.classList.contains("done");
    if (
      value === "all" ||
      (value === "done" && isDone) ||
      (value === "todo" && !isDone)
    ) {
      todo.style.display = "flex";
    } else {
      todo.style.display = "none";
    }
  });
});

// Iniciar
document.addEventListener("DOMContentLoaded", loadTodos);