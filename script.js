const list = document.getElementById('todo-list');
const itemCountSpan = document.getElementById('item-count');
const uncheckedCountSpan = document.getElementById('unchecked-count');
const input = document.getElementById('new-task');
let todos = [];
const BASE_URL = 'https://database-9634e-default-rtdb.europe-west1.firebasedatabase.app/todos';

async function loadTodosFromFirebase() {
  try {
    const response = await fetch(`${BASE_URL}.json`);
    const data = await response.json();

    todos = [];
    for (const id in data) {
      todos.push({
        id,
        title: data[id].title,
        completed: data[id].completed
      });
    }
    render();
    updateCounter();
  } catch (err) {
    console.error('Помилка завантаження з Firebase:', err);
    alert('Не вдалося завантажити справи з бази даних.');
  }
}
function newTodo() {
  const title = input.value?.trim();
  if (!title) return;

  const todo = {
    title,
    completed: false
  };

  addTodoToFirebase(todo);
  input.value = '';
}

async function addTodoToFirebase(todo) {
  try {
    const response = await fetch(`${BASE_URL}.json`, {
      method: 'POST',
      body: JSON.stringify(todo),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    todo.id = data.name;
    todos.push(todo);
    render();
    updateCounter();
  } catch (err) {
    console.error('Помилка при додаванні до Firebase:', err);
    alert('Не вдалося додати справу.');
  }
}

async function deleteTodo(id) {
  try {
    await fetch(`${BASE_URL}/${id}.json`, {
      method: 'DELETE'
    });
    todos = todos.filter(todo => todo.id !== id);
    render();
    updateCounter();
  } catch (err) {
    console.error('Помилка при видаленні з Firebase:', err);
    alert('Не вдалося видалити справу.');
  }
}

async function checkTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;
  todo.completed = !todo.completed;
  try {
    await fetch(`${BASE_URL}/${id}.json`, {
      method: 'PATCH',
      body: JSON.stringify({ completed: todo.completed }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    render();
    updateCounter();
  } catch (err) {
    console.error('Помилка при оновленні у Firebase:', err);
    alert('Не вдалося оновити статус справи.');
  }
}

function renderTodo(todo) {
  const checked = todo.completed ? 'checked' : '';
  const textClass = todo.completed ? 'text-success text-decoration-line-through' : '';
  return `
    <li class="list-group-item">
      <input type="checkbox" class="form-check-input me-2" id="${todo.id}" ${checked} />
      <label for="${todo.id}"><span class="${textClass}">${todo.title}</span></label>
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
window.addEventListener('DOMContentLoaded', loadTodosFromFirebase);


