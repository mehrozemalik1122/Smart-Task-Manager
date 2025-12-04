document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
    }
    
    if (signupBtn) {
        signupBtn.addEventListener('click', handleSignup);
    }
    
    if (window.location.pathname.includes('index.html')) {
        checkAuthStatus();
    }
});

async function handleSignup() {
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    
    if (!name || !email || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters', 'error');
        return;
    }
    
    try {
        console.log('Sending signup request:', { name, email, password });
        const response = await api.signup({ name, email, password });
        console.log('Signup response:', response);
        
        if (response.success) {
            showMessage('Account created successfully!', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            showMessage('Signup failed: Invalid response', 'error');
        }
    } catch (error) {
        console.error('Signup error:', error);
        showMessage(error.error || 'Signup failed', 'error');
    }
}

async function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    try {
        const response = await api.login({ email, password });
        
        if (response.success) {
            showMessage('Login successful!', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        }
    } catch (error) {
        showMessage(error.error || 'Login failed', 'error');
    }
}

async function checkAuthStatus() {
    try {
        const response = await api.validateSession();
        
        if (response.success && response.user) {
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        console.log('Not authenticated');
    }
}

function showMessage(message, type) {
    const existingMessage = document.querySelector('.auth-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `auth-message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 4px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        transition: opacity 0.3s ease;
        ${type === 'success' ? 'background-color: #28a745;' : 'background-color: #dc3545;'}
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        if (window.location.pathname.includes('signup.html')) {
            handleSignup();
        } else if (window.location.pathname.includes('index.html')) {
            handleLogin();
        }
    }
});