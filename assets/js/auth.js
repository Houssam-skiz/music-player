// Authentication module
const auth = (function() {
    const API_BASE = 'http://localhost:3000/api';
    let currentUser = null;

    // Check if user is logged in
    function isLoggedIn() {
        return localStorage.getItem('authToken') !== null;
    }

    // Get current user role
    function getUserRole() {
        return localStorage.getItem('userRole');
    }

    // Login function
    async function login(username, password) {
        try {
            const response = await fetch(`${API_BASE}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userRole', data.role);
            currentUser = data.user;
            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    }

    // Logout function
    function logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        currentUser = null;
        window.location.href = 'home.html';
    }

    // Protect routes based on role
    function protectRoute(requiredRole) {
        if (!isLoggedIn()) {
            window.location.href = 'home.html';
            return;
        }

        if (getUserRole() !== requiredRole) {
            window.location.href = 'home.html';
        }
    }

    // Initialize auth module
    function init() {
        // Add logout button listener
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }
    }

    return {
        isLoggedIn,
        getUserRole,
        login,
        logout,
        protectRoute,
        init
    };
})();

// Initialize auth module on page load
document.addEventListener('DOMContentLoaded', auth.init);
