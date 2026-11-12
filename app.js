const STORAGE_KEY = 'sapling-demo-tasks';

let tasks = loadTasks();

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function addTask(title) {
  tasks.push({ id: Date.now(), title, done: false });
  saveTasks();
  render();
}

function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, done: !task.done } : task
  );
  saveTasks();
  render();
}

function removeTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  render();
}

function render() {
  const list = document.getElementById('task-list');
  list.innerHTML = '';

  tasks.forEach((task) => {
    const item = document.createElement('li');
    item.className = 'task' + (task.done ? ' task--done' : '');

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.className = 'task__check';
    check.checked = task.done;
    check.addEventListener('change', () => toggleTask(task.id));

    const title = document.createElement('span');
    title.className = 'task__title';
    title.textContent = task.title;

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'task__remove';
    remove.textContent = '\u00d7';
    remove.setAttribute('aria-label', 'Eliminar tarea');
    remove.addEventListener('click', () => removeTask(task.id));

    item.append(check, title, remove);
    list.appendChild(item);
  });

  document.getElementById('stat-total').textContent = tasks.length;
  const pending = tasks.filter((task) => !task.done).length;
  document.getElementById('stat-pending').textContent = pending;
}

document.getElementById('task-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.getElementById('task-input');
  const title = input.value.trim();
  if (!title) return;
  addTask(title);
  input.value = '';
  input.focus();
});

render();
