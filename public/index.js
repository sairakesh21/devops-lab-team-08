document.addEventListener('DOMContentLoaded', () => {
    const accountsListDiv = document.getElementById('accounts-list');
    const popupOverlay = document.getElementById('popup-overlay');
    const passwordPopup = document.getElementById('password-popup');
    const passwordInput = document.getElementById('password-input');
    const rememberMeInput = document.getElementById('remember-me');
    const submitPasswordBtn = document.getElementById('submit-password');
    const deleteAccountPopup = document.getElementById('delete-account-popup');
    const deletePasswordInput = document.getElementById('delete-password-input');
    const confirmDeleteAccountBtn = document.getElementById('confirm-delete-account');
    const warningMessage = document.getElementById('warning-message');
    let selectedUid = null;
    let deleteUid = null;

    // Initialize local storage if not already set
    if (!localStorage.getItem('accounts')) {
        localStorage.setItem('accounts', JSON.stringify({}));
    }
    if (!localStorage.getItem('rememberMe')) {
        localStorage.setItem('rememberMe', JSON.stringify({}));
    }

    // Check for accounts and redirect to signup if none exist
    const accounts = JSON.parse(localStorage.getItem('accounts'));
    if (Object.keys(accounts).length === 0) {
        window.location.href = 'signup.html';
        return;
    }

    // Check for last opened account
    const lastOpenedAccount = localStorage.getItem('lastOpenedAccount');
    const rememberMe = JSON.parse(localStorage.getItem('rememberMe'));
    if (lastOpenedAccount && lastOpenedAccount !== 'accountspage' && rememberMe[lastOpenedAccount]) {
        window.location.href = `home.html?uid=${lastOpenedAccount}`;
        return;
    }

    // Populate accounts
    for (const uid in accounts) {
        const accountDiv = document.createElement('div');
        accountDiv.className = 'account';
        const storedImage = localStorage.getItem(`profile_image_${uid}`);
        accountDiv.innerHTML = `
            ${storedImage ? 
                `<img src="${storedImage}" alt="Profile" class="account-image">` :
                `<div class="account-svg">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                </div>`}
            <span>${accounts[uid].username}</span>
            <button class="delete-account-btn" data-uid="${uid}">
                <svg viewBox="0 0 24 24">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
            </button>
        `;
        accountDiv.addEventListener('click', (e) => {
            if (!e.target.closest('.delete-account-btn')) {
                if (rememberMe[uid]) {
                    localStorage.setItem('lastOpenedAccount', uid);
                    window.location.href = `home.html?uid=${uid}`;
                } else {
                    selectedUid = uid;
                    popupOverlay.style.display = 'block';
                    passwordPopup.style.display = 'block';
                    rememberMeInput.checked = false;
                    passwordInput.focus();
                }
            }
        });
        const deleteBtn = accountDiv.querySelector('.delete-account-btn');
        deleteBtn.addEventListener('click', () => {
            deleteUid = uid;
            popupOverlay.style.display = 'block';
            deleteAccountPopup.style.display = 'block';
            deletePasswordInput.focus();
        });
        accountsListDiv.appendChild(accountDiv);
    }

    // Handle password submission for login
    submitPasswordBtn.addEventListener('click', verifyPassword);

    // Handle Enter key for login password submission
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            verifyPassword();
        }
    });

    // Handle Esc key for login popup
    passwordPopup.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePasswordPopup();
        }
    });

    function verifyPassword() {
        const password = passwordInput.value;
        if (selectedUid && accounts[selectedUid].password === password) {
            if (rememberMeInput.checked) {
                rememberMe[selectedUid] = true;
                localStorage.setItem('rememberMe', JSON.stringify(rememberMe));
            }
            localStorage.setItem('lastOpenedAccount', selectedUid);
            popupOverlay.style.display = 'none';
            passwordPopup.style.display = 'none';
            passwordInput.value = '';
            window.location.href = `home.html?uid=${selectedUid}`;
        } else {
            showWarning('Incorrect password');
            passwordInput.value = '';
        }
    }

    // Handle delete account confirmation
    confirmDeleteAccountBtn.addEventListener('click', () => {
        const password = deletePasswordInput.value;
        if (deleteUid && accounts[deleteUid].password === password) {
            delete accounts[deleteUid];
            localStorage.setItem('accounts', JSON.stringify(accounts));
            localStorage.removeItem(`todos_${deleteUid}`);
            localStorage.removeItem(`profile_image_${deleteUid}`);
            const rememberMeData = JSON.parse(localStorage.getItem('rememberMe')) || {};
            delete rememberMeData[deleteUid];
            localStorage.setItem('rememberMe', JSON.stringify(rememberMeData));
            if (localStorage.getItem('lastOpenedAccount') === deleteUid) {
                localStorage.setItem('lastOpenedAccount', 'accountspage');
            }
            showWarning('Account deleted successfully');
            closeDeletePopup();
            window.location.reload();
        } else {
            showWarning('Incorrect password');
            deletePasswordInput.value = '';
        }
    });

    // Handle Enter and Esc keys for delete account popup
    deleteAccountPopup.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            confirmDeleteAccountBtn.click();
        }
    });

    deleteAccountPopup.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeDeletePopup();
        }
    });

    // Close popups when clicking overlay
    popupOverlay.addEventListener('click', () => {
        closePasswordPopup();
        closeDeletePopup();
    });

    function closePasswordPopup() {
        popupOverlay.style.display = 'none';
        passwordPopup.style.display = 'none';
        passwordInput.value = '';
        selectedUid = null;
    }

    function closeDeletePopup() {
        popupOverlay.style.display = 'none';
        deleteAccountPopup.style.display = 'none';
        deletePasswordInput.value = '';
        deleteUid = null;
    }

    // Show warning message
    function showWarning(message) {
        warningMessage.textContent = message;
        warningMessage.style.display = 'block';
        setTimeout(() => {
            warningMessage.style.display = 'none';
        }, 3000);
    }
});