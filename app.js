const STORAGE_KEY = 'sapling-demo-tasks';

let tasks = loadTasks();
let currentFilter = 'all';

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


function clearCompleted() {
  tasks = tasks.filter((task) => !task.done);
  saveTasks();
  render();
}


function render() {
  const list = document.getElementById('task-list');
  list.innerHTML = '';

  const visible = tasks.filter((task) => {
     if (currentFilter === 'pending') return !task.done;
     if (currentFilter === 'done') return task.done;
     return true;
   });

  visible.forEach((task) => {
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
  const done = tasks.filter((task) => task.done).length;
  document.getElementById('stat-done').textContent = done;
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

document.getElementById('theme-toggle').addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

document.getElementById('filters').addEventListener('click', (event) => {
     const button = event.target.closest('.filter');
     if (!button) return;
     currentFilter = button.dataset.filter;
     document
       .querySelectorAll('.filter')
       .forEach((el) => el.classList.toggle('is-active', el === button));
     render();
   });

/* DEMO 9(a) · Rama paralela "extras" — "feat: exportar tareas a JSON"
   Descomenta esta función:
function exportTasks() {
  const blob = new Blob([JSON.stringify(tasks, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'tareas.json';
  link.click();
  URL.revokeObjectURL(url);
}
*/

/* DEMO 9(a) · Listeners de los botones nuevos (van aquí, antes de render()).
   En la rama "utilidades" descomenta la línea de clear-done;
   en la rama "extras" descomenta la línea de export-tasks:
document.getElementById('clear-done').addEventListener('click', clearCompleted);
document.getElementById('export-tasks').addEventListener('click', exportTasks);
*/
   
render();
