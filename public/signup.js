function signup() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value.trim();
    const errorDiv = document.getElementById('error');

    if (!username || !password || !name) {
        errorDiv.textContent = 'All fields are required';
        return;
    }

    const accounts = JSON.parse(localStorage.getItem('accounts') || '{}');
    
    if (accounts[username]) {
        errorDiv.textContent = 'Username already exists';
        return;
    }

    accounts[username] = {
        password,
        name,
        todos: []
    };

    localStorage.setItem('accounts', JSON.stringify(accounts));
    sessionStorage.setItem('currentUser', username);
    window.location.href = 'home.html';
}