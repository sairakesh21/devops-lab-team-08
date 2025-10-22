document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const addTodoBtn = document.getElementById('add-todo');
    const todoList = document.getElementById('todo-list');
    const profileBtn = document.getElementById('profile-btn');
    const profileImg = document.getElementById('profile-img');
    const profilePopup = document.getElementById('profile-popup');
    const profileOption = document.getElementById('profile-option');
    const accountsOption = document.getElementById('accounts-option');
    const logoutOption = document.getElementById('logout-option');
    const popupOverlay = document.getElementById('popup-overlay');
    const deletePopup = document.getElementById('delete-popup');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    let selectedTodoId = null;

    // Get UID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.get('uid');

    if (!uid) {
        window.location.href = 'index.html';
        return;
    }

    // Load profile image from local storage
    const storedImage = localStorage.getItem(`profile_image_${uid}`);
    if (storedImage) {
        profileImg.src = storedImage;
        profileBtn.classList.add('has-image');
    }

    // Initialize todos for user
    const todos = JSON.parse(localStorage.getItem(`todos_${uid}`)) || [];

    // Render todos
    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
            const todoItem = document.createElement('div');
            todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            todoItem.innerHTML = `
                <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                <span>${todo.text}</span>
                <button>Delete</button>
            `;
            const checkbox = todoItem.querySelector('input');
            const deleteBtn = todoItem.querySelector('button');

            checkbox.addEventListener('change', () => {
                todos[index].completed = checkbox.checked;
                localStorage.setItem(`todos_${uid}`, JSON.stringify(todos));
                renderTodos();
            });

            deleteBtn.addEventListener('click', () => {
                selectedTodoId = index;
                popupOverlay.style.display = 'block';
                deletePopup.style.display = 'block';
            });

            todoList.appendChild(todoItem);
        });
    }

    // Add todo
    function addTodo() {
        const text = todoInput.value.trim();
        if (text) {
            todos.push({ text, completed: false });
            localStorage.setItem(`todos_${uid}`, JSON.stringify(todos));
            todoInput.value = '';
            renderTodos();
        }
    }

    addTodoBtn.addEventListener('click', addTodo);

    // Handle Enter key for adding todo
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    // Handle delete confirmation
    confirmDeleteBtn.addEventListener('click', () => {
        if (selectedTodoId !== null) {
            todos.splice(selectedTodoId, 1);
            localStorage.setItem(`todos_${uid}`, JSON.stringify(todos));
            renderTodos();
            closeDeletePopup();
        }
    });

    cancelDeleteBtn.addEventListener('click', closeDeletePopup);

    // Handle Enter and Esc keys for delete popup
    document.addEventListener('keydown', (e) => {
        if (deletePopup.style.display === 'block') {
            if (e.key === 'Enter') {
                confirmDeleteBtn.click();
            } else if (e.key === 'Escape') {
                cancelDeleteBtn.click();
            }
        }
    });

    function closeDeletePopup() {
        popupOverlay.style.display = 'none';
        deletePopup.style.display = 'none';
        selectedTodoId = null;
    }

    // Profile popup handling
    profileBtn.addEventListener('click', () => {
        profilePopup.style.display = profilePopup.style.display === 'block' ? 'none' : 'block';
    });

    profileOption.addEventListener('click', () => {
        window.location.href = `profile.html?uid=${uid}`;
    });

    accountsOption.addEventListener('click', () => {
        localStorage.setItem('lastOpenedAccount', 'accountspage');
        window.location.href = 'index.html';
    });

    logoutOption.addEventListener('click', () => {
        const rememberMeData = JSON.parse(localStorage.getItem('rememberMe')) || {};
        if (rememberMeData[uid]) {
            rememberMeData[uid] = false;
            localStorage.setItem('rememberMe', JSON.stringify(rememberMeData));
        }
        localStorage.setItem('lastOpenedAccount', 'accountspage');
        window.location.href = 'index.html';
    });

    // Close popup when clicking overlay
    popupOverlay.addEventListener('click', () => {
        profilePopup.style.display = 'none';
        closeDeletePopup();
    });

    // Initial render
    renderTodos();
});