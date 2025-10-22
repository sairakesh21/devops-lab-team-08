document.addEventListener('DOMContentLoaded', () => {
    const accountList = document.getElementById('accountList');
    const errorDiv = document.getElementById('error');
    
    // Check if there are accounts, redirect to signup if none
    const accounts = JSON.parse(localStorage.getItem('accounts') || '{}');
    if (Object.keys(accounts).length === 0) {
        window.location.href = 'signup.html';
        return;
    }

    // Display accounts
    Object.keys(accounts).forEach(username => {
        const accountDiv = document.createElement('div');
        accountDiv.className = 'account-item';
        accountDiv.innerHTML = `
            <span>${username}</span>
            <input type="password" placeholder="Password" id="pass_${username}">
            <div class="keep-signed-in">
                <input type="checkbox" id="keep_${username}">
                <label for="keep_${username}">Keep signed in</label>
            </div>
            <button onclick="login('${username}')">Login</button>
        `;
        accountList.appendChild(accountDiv);
    });

    // Check for auto-login
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser && accounts[savedUser]) {
        window.location.href = 'home.html';
    }
});

function login(username) {
    const accounts = JSON.parse(localStorage.getItem('accounts') || '{}');
    const password = document.getElementById(`pass_${username}`).value;
    const keepSignedIn = document.getElementById(`keep_${username}`).checked;
    
    if (accounts[username].password === password) {
        if (keepSignedIn) {
            localStorage.setItem('currentUser', username);
        }
        sessionStorage.setItem('currentUser', username);
        window.location.href = 'home.html';
    } else {
        document.getElementById('error').textContent = 'Incorrect password';
    }
}