const list = document.getElementById('todo-list');
const itemCountSpan = document.getElementById('item-count');
const uncheckedCountSpan = document.getElementById('unchecked-count');

let todos = [];

const savedTodos = JSON.parse(localStorage.getItem('todos'));
if (savedTodos && Array.isArray(savedTodos)) {
  todos = savedTodos;
} else {
  document.querySelectorAll('#todo-list li').forEach(li => {
    const checkbox = li.querySelector('input[type="checkbox"]');
    const label = li.querySelector('label span');
    const id = parseInt(checkbox.id);

    todos.push({
      id,
      title: label.textContent,
      completed: checkbox.checked
    });
  });
  saveTodos(); 
}

render();
updateCounter();

function newTodo() {
  const input = document.getElementById('new-task');
  const title = input.value?.trim();

  if (title) {
    const id = Date.now();
    const todo = {
      id,
      title,
      completed: false
    };

    todos.push(todo);
    input.value = '';
    render();
    updateCounter();
    saveTodos();
  }
}
function renderTodo(todo) {
  const checked = todo.completed ? 'checked' : '';
  const textClass = todo.completed ? 'text-success text-decoration-line-through' : '';
  return `
    <li class="list-group-item">
      <input type="checkbox" class="form-check-input me-2" id="${todo.id}" ${checked} />
      <label for="${todo.id}">
        <span class="${textClass}">${todo.title}</span>
      </label>
      <button class="btn btn-danger btn-sm float-end">delete</button>
    </li>
  `;
}
function render() {
  list.innerHTML = ''; 

  todos.forEach(todo => {
    const html = renderTodo(todo);
    list.insertAdjacentHTML('beforeend', html);

    document.getElementById(todo.id).addEventListener('change', () => checkTodo(todo.id));
    list.querySelector(`#todo-list li:last-child button.btn-danger`).addEventListener('click', () => deleteTodo(todo.id));
  });
}
function updateCounter() {
  itemCountSpan.textContent = todos.length;
  uncheckedCountSpan.textContent = todos.filter(todo => !todo.completed).length;
}
function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  render();
  updateCounter();
  saveTodos();
}
function checkTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;

  todo.completed = !todo.completed;
  render();
  updateCounter();
  saveTodos();
}
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

