const checkbox = document.querySelector('[data-testid="test-todo-complete-toggle"]');
const card = document.querySelector('[data-testid="test-todo-card"]');

const statusControl = document.querySelector('[data-testid="test-todo-status-control"]');
const statusDisplay = document.querySelector('[data-testid="test-todo-status-display"]');

const timeRemaining = document.querySelector('[data-testid="test-todo-time-remaining"]');
const overdueIndicator = document.querySelector('[data-testid="test-todo-overdue-indicator"]');

const editBtn = document.querySelector('[data-testid="test-todo-edit-button"]');
const form = document.querySelector('[data-testid="test-todo-edit-form"]');
const saveBtn = document.querySelector('[data-testid="test-todo-save-button"]');
const cancelBtn = document.querySelector('[data-testid="test-todo-cancel-button"]');

const titleEl = document.querySelector('[data-testid="test-todo-title"]');
const descEl = document.querySelector('[data-testid="test-todo-description"]');

const priorityIndicator = document.querySelector('[data-testid="test-todo-priority-indicator"]');
const priorityBadge = document.querySelector('[data-testid="test-todo-priority"]');

const expandBtn = document.querySelector('[data-testid="test-todo-expand-toggle"]');
const collapsible = document.querySelector('[data-testid="test-todo-collapsible-section"]');

const dueDateEl = document.querySelector('[data-testid="test-todo-due-date"]');

const DUE_DATE = new Date(dueDateEl.getAttribute("datetime"));

/* ---------------- STATE ---------------- */
let state = {
  title: titleEl.textContent,
  description: descEl.textContent,
  priority: "High",
  status: statusControl.value || "In Progress",
  dueDate: DUE_DATE
};

let backupState = null;
let timer = null;

/* ---------------- PRIORITY ---------------- */
function updatePriorityUI(priority) {
  priorityIndicator.className = `priority-indicator ${priority.toLowerCase()}`;
  priorityBadge.textContent = priority;
  priorityBadge.className = `badge ${priority.toLowerCase()}`;
}

/* ---------------- STATUS ---------------- */
function updateStatusUI(status) {
  state.status = status;

  checkbox.checked = status === "Done";
  
  card.classList.toggle("completed", status === "Done");

  statusControl.value = status;
  statusDisplay.textContent = status;

  statusControl.classList.remove(
    "status-pending",
    "status-in-progress",
    "status-done"
  );

  statusControl.classList.add(
    `status-${status.toLowerCase().replace(" ", "-")}`
  );

  if (status === "Done" && timer) {
    clearInterval(timer);
    timer = null;
    timeRemaining.textContent = "Completed";
    overdueIndicator.classList.add("hidden");
  }
}

/* checkbox + dropdown sync */
checkbox.addEventListener("change", () => {
  updateStatusUI(checkbox.checked ? "Done" : "Pending");
});

statusControl.addEventListener("change", (e) => {
  updateStatusUI(e.target.value);
});

/* ---------------- EDIT MODE ---------------- */
function openEditMode() {
  backupState = structuredClone(state);

  form.classList.remove("hidden");

  // FIX 3: aria-hidden removal
  form.removeAttribute("aria-hidden");

  const titleInput = form.querySelector('[data-testid="test-todo-edit-title-input"]');
  const descInput = form.querySelector('[data-testid="test-todo-edit-description-input"]');
  const priorityInput = form.querySelector('[data-testid="test-todo-edit-priority-select"]');
  const dateInput = form.querySelector('[data-testid="test-todo-edit-due-date-input"]');

  titleInput.value = state.title;
  descInput.value = state.description;
  priorityInput.value = state.priority;
  dateInput.value = state.dueDate.toISOString().slice(0, 16);

  titleInput.focus();
}

function closeEditMode() {
  form.classList.add("hidden");

  // FIX 3: restore aria-hidden
  form.setAttribute("aria-hidden", "true");

  editBtn.focus();
}

editBtn.addEventListener("click", openEditMode);

saveBtn.addEventListener("click", () => {
  const titleInput = form.querySelector('[data-testid="test-todo-edit-title-input"]');
  const descInput = form.querySelector('[data-testid="test-todo-edit-description-input"]');
  const priorityInput = form.querySelector('[data-testid="test-todo-edit-priority-select"]');
  const dateInput = form.querySelector('[data-testid="test-todo-edit-due-date-input"]');

  state.title = titleInput.value;
  state.description = descInput.value;
  state.priority = priorityInput.value;
  state.dueDate = new Date(dateInput.value);

  titleEl.textContent = state.title;
  descEl.textContent = state.description;

  updatePriorityUI(state.priority);

  closeEditMode();
});

cancelBtn.addEventListener("click", () => {
  if (backupState) {
    state = structuredClone(backupState);

    titleEl.textContent = state.title;
    descEl.textContent = state.description;

    updatePriorityUI(state.priority);
    updateStatusUI(state.status);
  }

  closeEditMode();
});

/* ---------------- EXPAND ---------------- */
function initCollapseByLength() {
  const text = descEl.textContent.trim();

  if (text.length > 120) {
    collapsible.classList.add("collapsed");
    expandBtn.setAttribute("aria-expanded", "false");
  } else {
    expandBtn.style.display = "none";
  }
}

expandBtn.addEventListener("click", () => {
  const expanded = expandBtn.getAttribute("aria-expanded") === "true";

  expandBtn.setAttribute("aria-expanded", String(!expanded));
  collapsible.classList.toggle("collapsed");

  expandBtn.textContent = expanded ? "Expand" : "Collapse";
});

initCollapseByLength();

/* ---------------- TIME ---------------- */
function formatTime(diffMs) {
  const minutes = Math.floor(Math.abs(diffMs) / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day(s)`;
  if (hours > 0) return `${hours} hour(s)`;
  return `${minutes} minute(s)`;
}

function updateTime() {
  if (state.status === "Done") return;

  const now = new Date();
  const diff = state.dueDate - now;

  const absTime = formatTime(diff);

  if (diff < 0) {
    overdueIndicator.classList.remove("hidden");
    timeRemaining.classList.add("overdue");
    timeRemaining.textContent = `Overdue by ${absTime}`;
  } else {
    overdueIndicator.classList.add("hidden");
    timeRemaining.classList.remove("overdue");
    timeRemaining.textContent = `Due in ${absTime}`;
  }
}

updateTime();
timer = setInterval(updateTime, 30000);