let addBtn = document.getElementById("addBtn");
let todoInput = document.getElementById("todoInput");
let todoList = document.getElementById("todoList");

// Load saved todos on page load
window.onload = function() {
  let savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
  savedTodos.forEach(todo => addTodo(todo.text, todo.completed));
};

// Add todo on button click
addBtn.addEventListener("click", function () {
  let task = todoInput.value.trim();
  if (task !== "") {
    addTodo(task, false);
    saveTodos();
    todoInput.value = "";
  } else {
    alert("⚠️ Please enter a task!");
  }
});

function addTodo(task, completed) {
  let li = document.createElement("li");

  let span = document.createElement("span");
  span.textContent = task;
  span.style.flex = "1";
  if (completed) li.classList.add("completed");

  // Toggle complete on click
  span.addEventListener("click", function () {
    li.classList.toggle("completed");
    saveTodos();
  });

  // Edit button
  let editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.className = "edit-btn";
  editBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    let editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = span.textContent;
    editInput.className = "edit-input";

    li.insertBefore(editInput, span);
    li.removeChild(span);
    editInput.focus();

    editInput.addEventListener("blur", saveEdit);
    editInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") saveEdit();
    });

    function saveEdit() {
      span.textContent = editInput.value.trim() || span.textContent;
      li.insertBefore(span, editInput);
      li.removeChild(editInput);
      saveTodos();
    }
  });

  // Delete button
  let delBtn = document.createElement("button");
  delBtn.textContent = "X";
  delBtn.className = "delete-btn";
  delBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    todoList.removeChild(li);
    saveTodos();
  });

  li.appendChild(span);
  li.appendChild(editBtn);
  li.appendChild(delBtn);
  todoList.appendChild(li);
}

function saveTodos() {
  let todos = [];
  document.querySelectorAll("#todoList li").forEach(li => {
    todos.push({ 
      text: li.querySelector("span").textContent, 
      completed: li.classList.contains("completed") 
    });
  });
  localStorage.setItem("todos", JSON.stringify(todos));
}
