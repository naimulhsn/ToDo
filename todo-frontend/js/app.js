/**
 * Vue 2 Todo Application
 * Main application logic and API integration
 */

// Support environment-based URLs for production deployment
// URL is set in config.js file
const API_BASE_URL = (typeof window !== 'undefined' && window.API_BASE_URL) 
  ? window.API_BASE_URL 
  : 'http://localhost:3000/api/todos';

// Initialize Vue app when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    Logger.info('Application initializing...');
    
    // Wait for AuthService to be available
    if (typeof AuthService === 'undefined') {
        console.error('AuthService not loaded');
        return;
    }

    new Vue({
        el: '#app',
        
        data: {
            todos: [],
            newTodo: {
                title: '',
                description: '',
                completed: false
            },
            editingTodo: null,
            loading: false,
            error: null,
            user: null,
            showDropdown: false
        },

        computed: {
            completedCount() {
                return this.todos.filter(t => t.completed).length;
            },
            
            pendingCount() {
                return this.todos.filter(t => !t.completed).length;
            },
            
            totalCount() {
                return this.todos.length;
            }
        },

        async mounted() {
            Logger.info('Vue app mounted');
            
            // Check authentication
            if (!AuthService.isAuthenticated()) {
                Logger.warn('User not authenticated, redirecting to login');
                window.location.href = 'login.html';
                return;
            }
            
            this.user = AuthService.getCurrentUser();
            Logger.info('User authenticated', { userId: this.user?.email });
            
            await this.fetchTodos();
            
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.dropdown')) {
                    this.closeDropdown();
                }
            });
        },

        methods: {
            /**
             * Fetch all todos from API
             */
            async fetchTodos() {
                this.loading = true;
                this.error = null;
                
                Logger.logApiRequestWithBackend('GET', API_BASE_URL);
                
                try {
                    const response = await axios.get(API_BASE_URL, {
                        headers: AuthService.getAuthHeader()
                    });
                    Logger.logApiResponseWithBackend('GET', API_BASE_URL, response.status, response.data);
                    
                    this.todos = response.data.data || [];
                    Logger.info(`Loaded ${this.todos.length} todos`);
                } catch (error) {
                    Logger.error('Failed to fetch todos', error);
                    this.error = 'Failed to load todos. Please try again.';
                } finally {
                    this.loading = false;
                }
            },

            /**
             * Add a new todo
             */
            async addTodo() {
                if (!this.newTodo.title.trim()) {
                    Logger.warn('Attempted to add todo without title');
                    this.error = 'Title is required';
                    return;
                }

                this.loading = true;
                this.error = null;
                
                const payload = {
                    title: this.newTodo.title.trim(),
                    description: this.newTodo.description.trim(),
                    completed: false
                };

                Logger.logUserActionWithBackend('Add Todo', { title: payload.title });
                Logger.logApiRequestWithBackend('POST', API_BASE_URL, payload);

                try {
                    const response = await axios.post(API_BASE_URL, payload, {
                        headers: AuthService.getAuthHeader()
                    });
                    Logger.logApiResponseWithBackend('POST', API_BASE_URL, response.status, response.data);
                    
                    this.todos.push(response.data.data);
                    
                    // Reset form
                    this.newTodo.title = '';
                    this.newTodo.description = '';
                    
                    Logger.info('Todo added successfully', response.data.data);
                } catch (error) {
                    Logger.error('Failed to add todo', error);
                    this.error = 'Failed to add todo. Please try again.';
                } finally {
                    this.loading = false;
                }
            },

            /**
             * Start editing a todo
             */
            startEdit(todo) {
                Logger.logUserActionWithBackend('Start Edit', { id: todo._id, title: todo.title });
                this.editingTodo = { ...todo };
            },

            /**
             * Cancel editing
             */
            cancelEdit() {
                Logger.logUserActionWithBackend('Cancel Edit');
                this.editingTodo = null;
            },

            /**
             * Save edited todo
             */
            async saveEdit() {
                if (!this.editingTodo.title.trim()) {
                    Logger.warn('Attempted to save todo without title');
                    this.error = 'Title is required';
                    return;
                }

                this.loading = true;
                this.error = null;
                
                const url = `${API_BASE_URL}/${this.editingTodo._id}`;
                const payload = {
                    title: this.editingTodo.title.trim(),
                    description: this.editingTodo.description.trim(),
                    completed: this.editingTodo.completed
                };

                Logger.logUserActionWithBackend('Save Edit', { id: this.editingTodo._id });
                Logger.logApiRequestWithBackend('PUT', url, payload);

                try {
                    const response = await axios.put(url, payload, {
                        headers: AuthService.getAuthHeader()
                    });
                    Logger.logApiResponseWithBackend('PUT', url, response.status, response.data);
                    
                    // Update todo in list
                    const index = this.todos.findIndex(t => t._id === this.editingTodo._id);
                    if (index !== -1) {
                        this.$set(this.todos, index, response.data.data);
                    }
                    
                    this.editingTodo = null;
                    Logger.info('Todo updated successfully');
                } catch (error) {
                    Logger.error('Failed to update todo', error);
                    this.error = 'Failed to update todo. Please try again.';
                } finally {
                    this.loading = false;
                }
            },

            /**
             * Toggle todo completion status
             */
            async toggleComplete(todo) {
                this.loading = true;
                this.error = null;
                
                const url = `${API_BASE_URL}/${todo._id}`;
                const payload = { completed: !todo.completed };

                Logger.logUserActionWithBackend('Toggle Complete', { 
                    id: todo._id, 
                    from: todo.completed, 
                    to: !todo.completed 
                });
                Logger.logApiRequestWithBackend('PUT', url, payload);

                try {
                    const response = await axios.put(url, payload, {
                        headers: AuthService.getAuthHeader()
                    });
                    Logger.logApiResponseWithBackend('PUT', url, response.status, response.data);
                    
                    // Update todo in list
                    const index = this.todos.findIndex(t => t._id === todo._id);
                    if (index !== -1) {
                        this.$set(this.todos, index, response.data.data);
                    }
                    
                    Logger.info(`Todo ${todo.completed ? 'unmarked' : 'marked'} as complete`);
                } catch (error) {
                    Logger.error('Failed to toggle todo', error);
                    this.error = 'Failed to update todo. Please try again.';
                } finally {
                    this.loading = false;
                }
            },

            /**
             * Delete a todo
             */
            async deleteTodo(todo) {
                if (!confirm(`Are you sure you want to delete "${todo.title}"?`)) {
                    Logger.logUserActionWithBackend('Delete Cancelled', { id: todo._id });
                    return;
                }

                this.loading = true;
                this.error = null;
                
                const url = `${API_BASE_URL}/${todo._id}`;

                Logger.logUserActionWithBackend('Delete Todo', { id: todo._id, title: todo.title });
                Logger.logApiRequestWithBackend('DELETE', url);

                try {
                    const response = await axios.delete(url, {
                        headers: AuthService.getAuthHeader()
                    });
                    Logger.logApiResponseWithBackend('DELETE', url, response.status, response.data);
                    
                    // Remove todo from list
                    this.todos = this.todos.filter(t => t._id !== todo._id);
                    
                    Logger.info('Todo deleted successfully');
                } catch (error) {
                    Logger.error('Failed to delete todo', error);
                    this.error = 'Failed to delete todo. Please try again.';
                } finally {
                    this.loading = false;
                }
            },

            /**
             * Clear error message
             */
            clearError() {
                this.error = null;
            },

            /**
             * Format date for display
             */
            formatDate(dateString) {
                const date = new Date(dateString);
                return date.toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            },

            /**
             * Toggle dropdown menu
             */
            toggleDropdown() {
                this.showDropdown = !this.showDropdown;
            },

            /**
             * Close dropdown when clicking outside
             */
            closeDropdown() {
                this.showDropdown = false;
            },

            /**
             * Logout user
             */
            async logout() {
                try {
                    await AuthService.logout();
                    Logger.info('User logged out from main app');
                    window.location.href = 'login.html';
                } catch (error) {
                    Logger.error('Logout error', error);
                    this.error = 'Logout failed. Please try again.';
                }
            }
        }
    });

    Logger.info('Application initialized successfully');
});

