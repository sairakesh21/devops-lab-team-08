document.addEventListener('DOMContentLoaded', () => {
    const backBtn = document.getElementById('back-btn');
    const profileImg = document.getElementById('profile-img');
    const profileSvg = document.getElementById('profile-svg');
    const profileImageContainer = document.getElementById('profile-image-container');
    const imageUpload = document.getElementById('image-upload');
    const uploadImageBtn = document.getElementById('upload-image-btn');
    const deleteImageBtn = document.getElementById('delete-image-btn');
    const useridInput = document.getElementById('userid');
    const editUidBtn = document.getElementById('edit-uid');
    const changePasswordBtn = document.getElementById('change-password');
    const deleteAccountBtn = document.getElementById('delete-account');
    const logoutBtn = document.getElementById('logout');
    const popupOverlay = document.getElementById('popup-overlay');
    const uidPopup = document.getElementById('uid-popup');
    const newUidInput = document.getElementById('new-uid');
    const submitUidBtn = document.getElementById('submit-uid');
    const passwordPopup = document.getElementById('password-popup');
    const currentPasswordInput = document.getElementById('current-password');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const confirmPasswordChangeBtn = document.getElementById('confirm-password-change');
    const deleteAccountPopup = document.getElementById('delete-account-popup');
    const deletePasswordInput = document.getElementById('delete-password');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const warningMessage = document.getElementById('warning-message');

    // Get UID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.get('uid');

    if (!uid) {
        window.location.href = 'index.html';
        return;
    }

    // Load profile image and UID
    const accounts = JSON.parse(localStorage.getItem('accounts')) || {};
    useridInput.value = accounts[uid]?.username || uid;
    const storedImage = localStorage.getItem(`profile_image_${uid}`);
    if (storedImage) {
        profileImg.src = storedImage;
        profileImg.style.display = 'block';
        profileSvg.style.display = 'none';
        deleteImageBtn.style.display = 'block';
    }

    // Back to home
    backBtn.addEventListener('click', () => {
        window.location.href = `home.html?uid=${uid}`;
    });

    // Handle image upload
    uploadImageBtn.addEventListener('click', () => {
        imageUpload.click();
    });

    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const size = Math.min(img.width, img.height);
                    canvas.width = 100;
                    canvas.height = 100;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, 100, 100);
                    const jpegData = canvas.toDataURL('image/jpeg', 0.8);
                    profileImg.src = jpegData;
                    profileImg.style.display = 'block';
                    profileSvg.style.display = 'none';
                    deleteImageBtn.style.display = 'block';
                    localStorage.setItem(`profile_image_${uid}`, jpegData);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle image deletion
    deleteImageBtn.addEventListener('click', () => {
        profileImg.style.display = 'none';
        profileSvg.style.display = 'flex';
        deleteImageBtn.style.display = 'none';
        localStorage.removeItem(`profile_image_${uid}`);
    });

    // Handle UID edit
    editUidBtn.addEventListener('click', () => {
        newUidInput.value = useridInput.value;
        popupOverlay.style.display = 'block';
        uidPopup.style.display = 'block';
        newUidInput.focus();
    });

    submitUidBtn.addEventListener('click', () => {
        const newUid = newUidInput.value.trim();
        if (!newUid) {
            showWarning('User ID cannot be empty');
            return;
        }
        if (newUid !== uid && accounts[newUid]) {
            showWarning('User ID already exists');
            return;
        }
        if (newUid !== uid) {
            accounts[newUid] = accounts[uid];
            delete accounts[uid];
            localStorage.setItem('accounts', JSON.stringify(accounts));

            const rememberMeData = JSON.parse(localStorage.getItem('rememberMe')) || {};
            if (rememberMeData[uid]) {
                rememberMeData[newUid] = rememberMeData[uid];
                delete rememberMeData[uid];
                localStorage.setItem('rememberMe', JSON.stringify(rememberMeData));
            }

            const todos = JSON.parse(localStorage.getItem(`todos_${uid}`)) || [];
            if (todos.length > 0) {
                localStorage.setItem(`todos_${newUid}`, JSON.stringify(todos));
                localStorage.removeItem(`todos_${uid}`);
            }

            const storedImage = localStorage.getItem(`profile_image_${uid}`);
            if (storedImage) {
                localStorage.setItem(`profile_image_${newUid}`, storedImage);
                localStorage.removeItem(`profile_image_${uid}`);
            }

            if (localStorage.getItem('lastOpenedAccount') === uid) {
                localStorage.setItem('lastOpenedAccount', newUid);
            }

            useridInput.value = newUid;
            showWarning('User ID changed successfully');
            closeUidPopup();
            window.location.href = `profile.html?uid=${newUid}`;
        } else {
            closeUidPopup();
        }
    });

    // Handle Enter key for UID change
    newUidInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitUidBtn.click();
        }
    });

    // Handle password change popup
    changePasswordBtn.addEventListener('click', () => {
        popupOverlay.style.display = 'block';
        passwordPopup.style.display = 'block';
        currentPasswordInput.focus();
    });

    // Handle password change
    confirmPasswordChangeBtn.addEventListener('click', () => {
        const currentPassword = currentPasswordInput.value;
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            showWarning('All password fields are required');
            return;
        }

        if (accounts[uid].password !== currentPassword) {
            showWarning('Incorrect current password');
            currentPasswordInput.value = '';
            return;
        }

        if (newPassword !== confirmPassword) {
            showWarning('New passwords do not match');
            newPasswordInput.value = '';
            confirmPasswordInput.value = '';
            return;
        }

        accounts[uid].password = newPassword;
        localStorage.setItem('accounts', JSON.stringify(accounts));
        showWarning('Password changed successfully');
        closePasswordPopup();
    });

    // Handle Enter and Esc keys for password popup
    passwordPopup.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            confirmPasswordChangeBtn.click();
        }
    });

    passwordPopup.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePasswordPopup();
        }
    });

    // Handle delete account
    deleteAccountBtn.addEventListener('click', () => {
        popupOverlay.style.display = 'block';
        deleteAccountPopup.style.display = 'block';
        deletePasswordInput.focus();
    });

    // Handle logout
    logoutBtn.addEventListener('click', () => {
        localStorage.setItem('lastOpenedAccount', 'accountspage');
        window.location.href = 'index.html';
    });

    // Handle delete account confirmation
    confirmDeleteBtn.addEventListener('click', () => {
        const deletePassword = deletePasswordInput.value;
        if (accounts[uid].password === deletePassword) {
            delete accounts[uid];
            localStorage.setItem('accounts', JSON.stringify(accounts));
            localStorage.removeItem(`todos_${uid}`);
            localStorage.removeItem(`profile_image_${uid}`);
            const rememberMeData = JSON.parse(localStorage.getItem('rememberMe')) || {};
            delete rememberMeData[uid];
            localStorage.setItem('rememberMe', JSON.stringify(rememberMeData));
            if (localStorage.getItem('lastOpenedAccount') === uid) {
                localStorage.setItem('lastOpenedAccount', 'accountspage');
            }
            showWarning('Account deleted successfully');
            window.location.href = 'index.html';
        } else {
            showWarning('Incorrect password');
            deletePasswordInput.value = '';
        }
    });

    // Handle Enter and Esc keys for delete account popup
    deleteAccountPopup.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            confirmDeleteBtn.click();
        }
    });

    deleteAccountPopup.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeDeletePopup();
        }
    });

    // Close popups when clicking overlay
    popupOverlay.addEventListener('click', () => {
        closeUidPopup();
        closePasswordPopup();
        closeDeletePopup();
    });

    function closeUidPopup() {
        popupOverlay.style.display = 'none';
        uidPopup.style.display = 'none';
        newUidInput.value = '';
    }

    function closePasswordPopup() {
        popupOverlay.style.display = 'none';
        passwordPopup.style.display = 'none';
        currentPasswordInput.value = '';
        newPasswordInput.value = '';
        confirmPasswordInput.value = '';
    }

    function closeDeletePopup() {
        popupOverlay.style.display = 'none';
        deleteAccountPopup.style.display = 'none';
        deletePasswordInput.value = '';
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