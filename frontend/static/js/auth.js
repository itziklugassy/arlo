// static/js/auth.js
class AuthHandler {
    static async login(username, password) {
        try {
            const response = await fetch('/api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Login failed');
            }

            const data = await response.json();
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            return true;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    static logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/';
    }

    static isAuthenticated() {
        return !!localStorage.getItem('access_token');
    }
}

// Update UI based on auth state
document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');

    if (AuthHandler.isAuthenticated()) {
        loginButton?.classList.add('d-none');
        logoutButton?.classList.remove('d-none');
    } else {
        loginButton?.classList.remove('d-none');
        logoutButton?.classList.add('d-none');
    }

    logoutButton?.addEventListener('click', (e) => {
        e.preventDefault();
        AuthHandler.logout();
    });
});