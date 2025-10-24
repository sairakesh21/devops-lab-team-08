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
        profileImg.style.display = 'block';
        const profileSvg = document.getElementById('profile-svg');
        if (profileSvg) profileSvg.style.display = 'none';
    }

    // Get todos function
    function getTodos() {
        const todos = localStorage.getItem(`todos_${uid}`);
        return todos ? JSON.parse(todos) : [];
    }

    // Save todos function
    function saveTodos(todos) {
        localStorage.setItem(`todos_${uid}`, JSON.stringify(todos));
        updateStats();
    }

    // Update stats function
    function updateStats() {
        const todos = getTodos();
        const total = todos.length;
        const completed = todos.filter(t => t.completed).length;
        const pending = total - completed;

        const statTotal = document.getElementById('stat-total');
        const statCompleted = document.getElementById('stat-completed');
        const statPending = document.getElementById('stat-pending');

        if (statTotal) statTotal.textContent = total;
        if (statCompleted) statCompleted.textContent = completed;
        if (statPending) statPending.textContent = pending;
    }

    // Render todos
    function renderTodos() {
        const todos = getTodos();
        todoList.innerHTML = '';

        if (todos.length === 0) {
            todoList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📝</div>
                    <h3>No tasks yet</h3>
                    <p>Add your first task to get started!</p>
                </div>
            `;
            updateStats();
            return;
        }

        todos.forEach((todo, index) => {
            const todoItem = document.createElement('div');
            todoItem.className = 'todo-item';
            if (todo.completed) {
                todoItem.classList.add('completed');
            }

            todoItem.innerHTML = `
                <input type="checkbox" ${todo.completed ? 'checked' : ''} class="todo-checkbox">
                <span class="todo-text">${todo.text}</span>
                <button class="delete-todo-btn">Delete</button>
            `;

            // Toggle completion
            const checkbox = todoItem.querySelector('.todo-checkbox');
            checkbox.addEventListener('change', () => {
                const todos = getTodos();
                todos[index].completed = checkbox.checked;
                saveTodos(todos);
                todoItem.classList.toggle('completed', checkbox.checked);
                updateStats();
            });

            // Delete button
            const deleteBtn = todoItem.querySelector('.delete-todo-btn');
            deleteBtn.addEventListener('click', () => {
                selectedTodoId = index;
                popupOverlay.style.display = 'block';
                deletePopup.style.display = 'block';
            });

            todoList.appendChild(todoItem);
        });

        updateStats();
    }

    // Add todo
    function addTodo() {
        const text = todoInput.value.trim();
        if (!text) return;

        const todos = getTodos();
        todos.push({
            text: text,
            completed: false
        });
        saveTodos(todos);
        todoInput.value = '';
        renderTodos();
    }

    // Delete todo
    function deleteTodo() {
        if (selectedTodoId === null) return;

        const todos = getTodos();
        todos.splice(selectedTodoId, 1);
        saveTodos(todos);
        renderTodos();

        closePopups();
        selectedTodoId = null;
    }

    // Close popups
    function closePopups() {
        popupOverlay.style.display = 'none';
        deletePopup.style.display = 'none';
        profilePopup.style.display = 'none';
    }

    // Event listeners
    addTodoBtn.addEventListener('click', addTodo);

    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTodo();
        }
    });

    confirmDeleteBtn.addEventListener('click', deleteTodo);

    cancelDeleteBtn.addEventListener('click', closePopups);

    popupOverlay.addEventListener('click', closePopups);

    // Profile menu toggle
    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profilePopup.style.display = profilePopup.style.display === 'block' ? 'none' : 'block';
    });

    // Profile option
    profileOption.addEventListener('click', () => {
        window.location.href = `profile.html?uid=${uid}`;
    });

    // Accounts option (switch accounts)
    accountsOption.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Logout option - GO TO INDEX.HTML
    logoutOption.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Filter tabs functionality
    const filterTabs = document.querySelectorAll('.filter-tab');
    if (filterTabs.length > 0) {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Update active tab
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const filter = tab.dataset.filter;
                const todoItems = document.querySelectorAll('.todo-item');

                todoItems.forEach(item => {
                    if (filter === 'all') {
                        item.style.display = 'flex';
                    } else if (filter === 'completed') {
                        item.style.display = item.classList.contains('completed') ? 'flex' : 'none';
                    } else if (filter === 'pending') {
                        item.style.display = !item.classList.contains('completed') ? 'flex' : 'none';
                    }
                });
            });
        });
    }

    // Initial render
    renderTodos();
    updateStats();
});