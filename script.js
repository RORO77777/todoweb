const taskList = document.getElementById("task-list");
    const taskInput = document.getElementById("task-input");
    const addTaskForm = document.querySelector(".add-task");
    const filterButtons = document.querySelectorAll(".filters button");
    const themeBtn = document.getElementById("theme-btn");
    const taskCount = document.getElementById("task-count");
    const clearCompletedBtn = document.querySelector(".clear-completed");
    let currentFilter = "all";

    function updateCount() {
      const activeTasks = taskList.querySelectorAll("li:not(.completed)").length;
      taskCount.textContent = `${activeTasks} task${activeTasks !== 1 ? "s" : ""} left`;
    }

    addTaskForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const value = taskInput.value.trim();
      if (!value) return;

      const li = document.createElement("li");
      li.setAttribute("draggable", "true");
      li.innerHTML = `
        <div class="task-left">
          <input type="checkbox" class="check">
          <span class="task-name">${value}</span>
        </div>
        <div class="task-actions">
          <span class="edit"><i class="fa-solid fa-pen-to-square"></i></span>
          <span class="delete"><i class="fa-solid fa-trash"></i></span>
        </div>
      `;
      taskList.appendChild(li);
      taskInput.value = "";
      updateCount();
    });

    taskList.addEventListener("click", (e) => {
      const li = e.target.closest("li");
      if (!li) return;

      if (e.target.closest(".delete")) {
        li.remove();
        updateCount();
      }

      if (e.target.closest(".edit")) {
        const taskName = li.querySelector(".task-name");
        const editBtn = li.querySelector(".edit");
        if (!li.classList.contains("editing")) {
          const input = document.createElement("input");
          input.type = "text";
          input.value = taskName.textContent;
          input.className = "edit-input";
          li.querySelector(".task-left").replaceChild(input, taskName);
          li.classList.add("editing");
          editBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i>';
          input.focus();
        } else {
          const input = li.querySelector(".edit-input");
          const span = document.createElement("span");
          span.textContent = input.value.trim() || "Untitled Task";
          span.className = "task-name";
          li.querySelector(".task-left").replaceChild(span, input);
          li.classList.remove("editing");
          editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
        }
      }

      if (e.target.classList.contains("check")) {
        li.classList.toggle("completed", e.target.checked);
        updateCount();
      }
    });

    filterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        currentFilter = btn.dataset.filter;
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        filterTasks();
      });
    });

    function filterTasks() {
      const tasks = taskList.querySelectorAll("li");
      tasks.forEach(task => {
        if (currentFilter === "all") {
          task.style.display = "flex";
        } else if (currentFilter === "active") {
          task.style.display = task.classList.contains("completed") ? "none" : "flex";
        } else if (currentFilter === "completed") {
          task.style.display = task.classList.contains("completed") ? "flex" : "none";
        }
      });
    }

    clearCompletedBtn.addEventListener("click", () => {
      document.querySelectorAll("li.completed").forEach(task => task.remove());
      updateCount();
    });

    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      themeBtn.innerHTML = document.body.classList.contains("dark")
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
    });

    // Drag and drop
    taskList.addEventListener("dragstart", (e) => {
      e.target.classList.add("dragging");
    });
    taskList.addEventListener("dragend", (e) => {
      e.target.classList.remove("dragging");
    });
    taskList.addEventListener("dragover", (e) => {
      e.preventDefault();
      const dragging = taskList.querySelector(".dragging");
      const afterElement = getDragAfterElement(taskList, e.clientY);
      if (afterElement == null) {
        taskList.appendChild(dragging);
      } else {
        taskList.insertBefore(dragging, afterElement);
      }
    });

    function getDragAfterElement(container, y) {
      const draggableElements = [...container.querySelectorAll("li:not(.dragging)")];
      return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    updateCount();