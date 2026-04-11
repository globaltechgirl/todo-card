const checkbox      = document.querySelector('[data-testid="test-todo-complete-toggle"]');
const card          = document.querySelector('[data-testid="test-todo-card"]');
const statusEl      = document.querySelector('[data-testid="test-todo-status"]');
const timeRemaining = document.querySelector('[data-testid="test-todo-time-remaining"]');

const DUE_DATE = new Date("2026-04-16T18:00:00Z");

checkbox.addEventListener("change", () => {
  if (checkbox.checked) {
    card.classList.add("completed");
    statusEl.textContent = "Done";
    statusEl.setAttribute("aria-label", "Status: Done");
    statusEl.classList.remove("status");
    statusEl.classList.add("done");
  } else {
    card.classList.remove("completed");
    statusEl.textContent = "In Progress";
    statusEl.setAttribute("aria-label", "Status: In Progress");
    statusEl.classList.remove("done");
    statusEl.classList.add("status");
  }
});

function updateTimeRemaining() {
  const now  = new Date();
  const diff = DUE_DATE - now;
  const absDiff = Math.abs(diff);

  const totalMinutes = Math.floor(absDiff / (1000 * 60));
  const totalHours   = Math.floor(absDiff / (1000 * 60 * 60));
  const totalDays    = Math.floor(absDiff / (1000 * 60 * 60 * 24));

  let label;

  if (diff <= 0) {
    if (totalHours >= 1) {
      label = `Overdue by ${totalHours} hour${totalHours !== 1 ? "s" : ""}`;
    } else if (totalMinutes >= 1) {
      label = `Overdue by ${totalMinutes} minute${totalMinutes !== 1 ? "s" : ""}`;
    } else {
      label = "Due now!";
    }
  } else {
    if (totalDays > 1) {
      label = `Due in ${totalDays} days`;
    } else if (totalDays === 1) {
      label = "Due tomorrow";
    } else if (totalHours >= 1) {
      label = `Due in ${totalHours} hour${totalHours !== 1 ? "s" : ""}`;
    } else if (totalMinutes >= 1) {
      label = `Due in ${totalMinutes} minute${totalMinutes !== 1 ? "s" : ""}`;
    } else {
      label = "Due now!";
    }
  }

  timeRemaining.textContent = label;

  timeRemaining.setAttribute("datetime", DUE_DATE.toISOString());
}

updateTimeRemaining();
setInterval(updateTimeRemaining, 60000);

document
  .querySelector('[data-testid="test-todo-edit-button"]')
  .addEventListener("click", () => {
    console.log("edit clicked");
  });

document
  .querySelector('[data-testid="test-todo-delete-button"]')
  .addEventListener("click", () => {
    alert("Delete clicked");
  });