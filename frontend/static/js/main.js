// static/js/main.js

class AuthManager {
    static updateAuthUI() {
        const token = localStorage.getItem('access_token');
        const loginButton = document.getElementById('loginButton');
        const logoutButton = document.getElementById('logoutButton');
        
        if (token) {
            loginButton?.classList.add('d-none');
            logoutButton?.classList.remove('d-none');
        } else {
            loginButton?.classList.remove('d-none');
            logoutButton?.classList.add('d-none');
        }
    }

    static setupLogout() {
        document.getElementById('logoutButton')?.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            AuthManager.updateAuthUI();
            window.location.href = '/';
        });
    }
}

// Utility functions for loading spinner
const showLoading = () => document.getElementById('loading-spinner')?.classList.remove('d-none');
const hideLoading = () => document.getElementById('loading-spinner')?.classList.add('d-none');

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    AuthManager.updateAuthUI();
    AuthManager.setupLogout();
});