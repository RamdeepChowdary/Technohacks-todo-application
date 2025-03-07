
const todoList = document.getElementById('todoList');
const taskInput = document.getElementById('taskInput');

async function fetchTodos() {
  const response = await fetch('http://127.0.0.1:5000/todos');
  const todos = await response.json();
  displayTodos(todos);
}

function displayTodos(todos) {
  console.log('Displaying todos:', todos);
  todoList.innerHTML = '';
  todos.forEach(todo => {
    console.log('Rendering todo:', todo);
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="${todo.completed ? 'completed' : ''}">${todo.task}</span>
      <button class="toggle-btn" onclick="toggleComplete(${todo.id})">Toggle</button>
      <button class="update-btn" onclick="updateTodo(${todo.id}, prompt('Update task:', todo.task))">Update</button>
      <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
    `;
    console.log('Appending todo to list:', li);
    todoList.appendChild(li);
  });
}

async function createTodo() {
  const task = taskInput.value;
  if (task) {
    try {
      const response = await fetch('http://127.0.0.1:5000/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ task: task })
      });
      if (response.ok) {
        taskInput.value = '';
        fetchTodos();
      } else {
        console.error('Error adding task:', response.status);
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }
}

async function toggleComplete(id) {
  const response = await fetch(`http://127.0.0.1:5000/todos/${id}`);
  const todo = await response.json();
  await fetch(`http://127.0.0.1:5000/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ completed: !todo.completed })
  });
  fetchTodos();
}

async function updateTodo(id, newTask) {
  if (newTask) {
    await fetch(`http://127.0.0.1:5000/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ task: newTask })
    });
    fetchTodos();
  }
}

async function deleteTodo(id) {
  await fetch(`http://127.0.0.1:5000/todos/${id}`, { method: 'DELETE' });
  fetchTodos();
}

fetchTodos();
