document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const useridInput = document.getElementById('userid');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const rememberMeInput = document.getElementById('remember-me');
    const warningMessage = document.getElementById('warning-message');

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSignup();
    });

    // Handle Enter key for form submission
    signupForm.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSignup();
        }
    });

    function handleSignup() {
        const userid = useridInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const rememberMe = rememberMeInput.checked;

        // Validate inputs
        if (!userid || !password || !confirmPassword) {
            showWarning('All fields are required');
            return;
        }

        if (password !== confirmPassword) {
            showWarning('Passwords do not match');
            return;
        }

        // Check for existing accounts
        const accounts = JSON.parse(localStorage.getItem('accounts')) || {};
        if (accounts[userid]) {
            showWarning('User ID already exists. Please choose a different User ID.');
            return;
        }

        // Store new account
        accounts[userid] = { username: userid, password: password };
        localStorage.setItem('accounts', JSON.stringify(accounts));

        // Update remember me status
        const rememberMeData = JSON.parse(localStorage.getItem('rememberMe')) || {};
        rememberMeData[userid] = rememberMe;
        localStorage.setItem('rememberMe', JSON.stringify(rememberMeData));

        // Set last opened account
        localStorage.setItem('lastOpenedAccount', userid);

        // Redirect to home page
        window.location.href = `home.html?uid=${userid}`;
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