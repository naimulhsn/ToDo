/**
 * Authentication utilities for the frontend
 */

const AUTH_SERVICE_URL = 'http://localhost:3001/api/auth';

// AuthService Class
class AuthServiceClass {
  constructor() {
    this.token = localStorage.getItem('authToken');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.token;
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return this.user;
  }

  /**
   * Get auth token
   */
  getToken() {
    return this.token;
  }

  /**
   * Set authentication data
   */
  setAuth(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Clear authentication data
   */
  clearAuth() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  /**
   * Sign up a new user
   */
  async signup(fullName, email, password) {
    try {
      const response = await axios.post(`${AUTH_SERVICE_URL}/signup`, {
        fullName,
        email,
        password
      });

      if (response.data.success) {
        this.setAuth(response.data.data.token, response.data.data.user);
        Logger.info('User signed up successfully', { email, fullName });
        return { success: true, data: response.data.data };
      } else {
        Logger.warn('Signup failed', { email, message: response.data.message });
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      Logger.error('Signup error', error);
      const message = error.response?.data?.message || 'Signup failed. Please try again.';
      return { success: false, message };
    }
  }

  /**
   * Login user
   */
  async login(email, password) {
    try {
      const response = await axios.post(`${AUTH_SERVICE_URL}/login`, {
        email,
        password
      });

      if (response.data.success) {
        this.setAuth(response.data.data.token, response.data.data.user);
        Logger.info('User logged in successfully', { email });
        return { success: true, data: response.data.data };
      } else {
        Logger.warn('Login failed', { email, message: response.data.message });
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      Logger.error('Login error', error);
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, message };
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      if (this.token) {
        await axios.post(`${AUTH_SERVICE_URL}/logout`, {}, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
      }
    } catch (error) {
      Logger.error('Logout error', error);
    } finally {
      this.clearAuth();
      Logger.info('User logged out');
    }
  }

  /**
   * Get user profile
   */
  async getProfile() {
    try {
      if (!this.token) {
        throw new Error('No authentication token');
      }

      const response = await axios.get(`${AUTH_SERVICE_URL}/profile`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (response.data.success) {
        this.user = response.data.data;
        localStorage.setItem('user', JSON.stringify(this.user));
        return { success: true, data: response.data.data };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      Logger.error('Get profile error', error);
      if (error.response?.status === 401) {
        this.clearAuth();
        return { success: false, message: 'Session expired. Please login again.' };
      }
      return { success: false, message: 'Failed to get profile' };
    }
  }

  /**
   * Get authorization header for API requests
   */
  getAuthHeader() {
    return this.token ? { 'Authorization': `Bearer ${this.token}` } : {};
  }
}

// Create and expose global auth service instance
window.AuthService = new AuthServiceClass();
