document.addEventListener('DOMContentLoaded', () => {
    const currentUser = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    const accounts = JSON.parse(localStorage.getItem('accounts') || '{}');
    document.getElementById('welcome').textContent = `Welcome, ${accounts[currentUser].name}`;
    renderTodos();

    // Auto-save todos on input
    document.getElementById('newTodo').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });
});

function addTodo() {
    const input = document.getElementById('newTodo');
    const task = input.value.trim();
    if (!task) return;

    const currentUser = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser');
    const accounts = JSON.parse(localStorage.getItem('accounts') || '{}');
    accounts[currentUser].todos.push({ task, completed: false });
    localStorage.setItem('accounts', JSON.stringify(accounts));
    input.value = '';
    renderTodos();
}

function toggleTodo(index) {
    const currentUser = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser');
    const accounts = JSON.parse(localStorage.getItem('accounts') || '{}');
    accounts[currentUser].todos[index].completed = !accounts[currentUser].todos[index].completed;
    localStorage.setItem('accounts', JSON.stringify(accounts));
    renderTodos();
}

function deleteTodo(index) {
    const currentUser = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser');
    const accounts = JSON.parse(localStorage.getItem('accounts') || '{}');
    accounts[currentUser].todos.splice(index, 1);
    localStorage.setItem('accounts', JSON.stringify(accounts));
    renderTodos();
}

function renderTodos() {
    const currentUser = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser');
    const accounts = JSON.parse(localStorage.getItem('accounts') || '{}');
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';

    accounts[currentUser].todos.forEach((todo, index) => {
        const todoDiv = document.createElement('div');
        todoDiv.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        todoDiv.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''} onclick="toggleTodo(${index})">
            <span>${todo.task}</span>
            <button onclick="deleteTodo(${index})">Delete</button>
        `;
        todoList.appendChild(todoDiv);
    });
}

function logout() {
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}