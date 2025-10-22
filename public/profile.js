document.addEventListener('DOMContentLoaded', () => {
    const currentUser = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    const accounts = JSON.parse(localStorage.getItem('accounts') || '{}');
    document.getElementById('name').value = accounts[currentUser].name;
});

function updateProfile() {
    const currentUser = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser');
    const accounts = JSON.parse(localStorage.getItem('accounts') || '{}');
    const name = document.getElementById('name').value.trim();
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('error');

    if (!name) {
        errorDiv.textContent = 'Name is required';
        return;
    }

    accounts[currentUser].name = name;
    if (password) {
        accounts[currentUser].password = password;
    }
    localStorage.setItem('accounts', JSON.stringify(accounts));
    errorDiv.textContent = 'Profile updated successfully';
    setTimeout(() => {
        window.location.href = 'home.html';
    }, 1000);
}

function deleteAccount() {
    if (!confirm('Are you sure you want to delete your account?')) return;
    
    const currentUser = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser');
    const accounts = JSON.parse(localStorage.getItem('accounts') || '{}');
    delete accounts[currentUser];
    localStorage.setItem('accounts', JSON.stringify(accounts));
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}