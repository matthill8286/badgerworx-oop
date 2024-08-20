class Auth {
    constructor() {
        this.validUsername = 'user';
        this.validPassword = 'password';
    }

    async authenticate(username, password) {
        // Simulate an asynchronous authentication process
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(username === this.validUsername && password === this.validPassword);
            }, 500);
        });
    }
}

class UserSession {
    static getUsername() {
        return localStorage.getItem('username');
    }

    static setUsername(username) {
        localStorage.setItem('username', username);
    }

    static clearSession() {
        localStorage.removeItem('username');
    }
}

class BadgerworxLogin {
    constructor(auth) {
        this.auth = auth;
        this.userActions = document.getElementById('userActions');
        this.loginButton = document.getElementById('loginButton');
        this.loginContainer = document.getElementById('loginContainer');
        this.pageHeading = document.getElementById('mainTitle');
        this.username = UserSession.getUsername();

        this.init();
    }

    init() {
        if (this.username) {
            this.displayLoggedInState();
        } else {
            this.displayLoggedOutState();
        }
        this.attachEventListeners();
    }

    attachEventListeners() {
        if (this.loginButton) {
            this.loginButton.addEventListener('click', () => {
                this.displayLoginForm();
            });
        }

        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (event) => {
                await this.handleLogin(event);
            });
        }
    }

    displayLoggedOutState() {
        this.userActions.innerHTML = '<button id="loginButton" class="button button--primary" aria-label="Login to Badgerworx">Login</button>';
        this.loginButton = document.getElementById('loginButton');
        this.pageHeading.innerHTML = `Welcome to Badgerworx`;
        this.loginContainer.style.display = 'none';
        this.attachEventListeners();
    }

    displayLoggedInState() {
        this.userActions.innerHTML = `<span>Welcome, ${this.username}</span> <button id="logoutButton" class="button button--primary" aria-label="Log out of Badgerworx">Log out</button>`;
        this.pageHeading.innerHTML = `Welcome to Badgerworx, ${this.username}`;
        this.loginContainer.style.display = 'none';
        this.loginContainer.setAttribute('aria-hidden', 'true');
        document.getElementById('logoutButton').addEventListener('click', () => {
            this.handleLogout();
        });
    }

    displayLoginForm() {
        this.loginContainer.style.display = 'block';
        this.loginContainer.setAttribute('aria-hidden', 'false');
    }

    async handleLogin(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        const isAuthenticated = await this.auth.authenticate(username, password);

        if (isAuthenticated) {
            if (rememberMe) {
                UserSession.setUsername(username);
            }
            this.username = username;
            this.displayLoggedInState();
        } else {
            alert('Invalid login credentials');
            document.getElementById('username').focus();
        }
    }

    handleLogout() {
        UserSession.clearSession();
        this.username = null;
        this.displayLoggedOutState();
    }
}


