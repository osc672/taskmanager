const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Initial render
renderTasks();

function addTask() {
  const text = taskInput.value.trim();
  if (text) {
    tasks.push({ text, completed: false });
    taskInput.value = "";
    saveAndRender();
  }
}

function saveAndRender() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task-item";
    li.draggable = true;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.onchange = () => {
      tasks[index].completed = checkbox.checked;
      saveAndRender();
    };

    const span = document.createElement("span");
    span.textContent = task.text;
    if (task.completed) span.style.textDecoration = "line-through";

    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.onclick = () => {
      tasks.splice(index, 1);
      saveAndRender();
    };

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);

    li.addEventListener("dragstart", () => li.classList.add("dragging"));
    li.addEventListener("dragend", () => {
      li.classList.remove("dragging");
      updateOrder();
    });

    taskList.appendChild(li);
  });

  enableDragAndDrop();
  filterTasks(); // keep filtered view active after any change
}

function enableDragAndDrop() {
  taskList.addEventListener("dragover", (e) => {
    e.preventDefault();
    const dragging = document.querySelector(".dragging");
    const siblings = [...taskList.querySelectorAll(".task-item:not(.dragging)")];
    const next = siblings.find(sibling => e.clientY < sibling.getBoundingClientRect().top + sibling.offsetHeight / 2);
    taskList.insertBefore(dragging, next);
  });
}

function updateOrder() {
  const items = [...taskList.children];
  tasks = items.map(item => {
    const text = item.querySelector("span").textContent;
    const completed = item.querySelector("input").checked;
    return { text, completed };
  });
  saveAndRender();
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

function filterTasks() {
  const query = searchInput.value.toLowerCase();
  const items = [...taskList.children];
  items.forEach(item => {
    const text = item.querySelector("span").textContent.toLowerCase();
    item.style.display = text.includes(query) ? "flex" : "none";
  });
}

function clearAll() {
  if (confirm("Are you sure you want to delete all tasks?")) {
    tasks = [];
    saveAndRender();
  }
}
