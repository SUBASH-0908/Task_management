import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // ── Auth State ──
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [isLogin, setIsLogin] = useState(true);
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // ── Task State ──
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch tasks when user logs in
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  // Helper: build auth header
  const authHeader = { Authorization: `Bearer ${token}` };

  // ── Auth Functions ──

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const url = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin
        ? { email: authEmail, password: authPassword }
        : { name: authName, email: authEmail, password: authPassword };

      const res = await axios.post(url, body);

      // Save token and user info in localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
    } catch (err) {
      setAuthError(err.response?.data?.error || 'Something went wrong. Try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
    setTasks([]);
  };

  // ── Task Functions ──

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/tasks', { headers: authHeader });
      setTasks(res.data);
      setError('');
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout(); // Token expired — force logout
      } else {
        setError('Failed to load tasks. Make sure the backend is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await axios.post('/api/tasks', { title: newTitle }, { headers: authHeader });
      setTasks([res.data, ...tasks]);
      setNewTitle('');
      setError('');
    } catch (err) {
      setError('Failed to add task. Please try again.');
    }
  };

  const toggleTask = async (id) => {
    try {
      const res = await axios.patch(`/api/tasks/${id}`, {}, { headers: authHeader });
      setTasks(tasks.map((task) => (task._id === id ? res.data : task)));
    } catch (err) {
      setError('Failed to update task.');
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`, { headers: authHeader });
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      setError('Failed to delete task.');
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  // ── Auth Screen ──
  if (!token) {
    return (
      <div className="app">
        <div className="auth-container">
          <div className="auth-card">
            <div className="header">
              <h1>📝 Task Manager</h1>
              <p className="subtitle">Stay organized, stay productive</p>
            </div>

            {/* Login / Register Tabs */}
            <div className="auth-tabs">
              <button
                id="login-tab"
                className={`auth-tab ${isLogin ? 'active' : ''}`}
                onClick={() => { setIsLogin(true); setAuthError(''); }}
              >
                Login
              </button>
              <button
                id="register-tab"
                className={`auth-tab ${!isLogin ? 'active' : ''}`}
                onClick={() => { setIsLogin(false); setAuthError(''); }}
              >
                Register
              </button>
            </div>

            {/* Auth Form */}
            <form className="auth-form" onSubmit={handleAuth}>
              {!isLogin && (
                <input
                  id="auth-name"
                  type="text"
                  className="task-input"
                  placeholder="Your name"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  required
                />
              )}
              <input
                id="auth-email"
                type="email"
                className="task-input"
                placeholder="Email address"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                required
              />
              <input
                id="auth-password"
                type="password"
                className="task-input"
                placeholder="Password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                required
              />

              {authError && <div className="error-banner">⚠️ {authError}</div>}

              <button
                id="auth-submit"
                type="submit"
                className="add-btn auth-submit-btn"
                disabled={authLoading}
              >
                {authLoading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ── Task Screen ──
  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <header className="header">
          <h1>📝 Task Manager</h1>
          <p className="subtitle">Welcome back, {user?.name}!</p>
          <button id="logout-btn" className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </header>

        {/* Stats */}
        {tasks.length > 0 && (
          <div className="stats">
            <span>{tasks.length} total</span>
            <span className="divider">•</span>
            <span className="completed-count">{completedCount} completed</span>
            <span className="divider">•</span>
            <span className="pending-count">{tasks.length - completedCount} pending</span>
          </div>
        )}

        {/* Add Task Form */}
        <form className="add-form" onSubmit={addTask}>
          <input
            id="task-input"
            type="text"
            className="task-input"
            placeholder="What needs to be done?"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button id="add-btn" type="submit" className="add-btn" disabled={!newTitle.trim()}>
            + Add
          </button>
        </form>

        {/* Error Message */}
        {error && <div className="error-banner">⚠️ {error}</div>}

        {/* Task List */}
        <div className="task-list">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">✅</span>
              <p>No tasks yet! Add one above.</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task._id}
                className={`task-card ${task.completed ? 'completed' : ''}`}
              >
                {/* Checkbox */}
                <button
                  id={`toggle-${task._id}`}
                  className={`checkbox ${task.completed ? 'checked' : ''}`}
                  onClick={() => toggleTask(task._id)}
                  title={task.completed ? 'Mark as pending' : 'Mark as complete'}
                >
                  {task.completed ? '✓' : ''}
                </button>

                {/* Task Title */}
                <span className="task-title">{task.title}</span>

                {/* Delete Button */}
                <button
                  id={`delete-${task._id}`}
                  className="delete-btn"
                  onClick={() => deleteTask(task._id)}
                  title="Delete task"
                >
                  🗑
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <footer className="footer">
          <p>MERN Stack Task Manager</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
