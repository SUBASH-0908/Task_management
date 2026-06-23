import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setTasks(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load tasks. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Add a new task
  const addTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const response = await axios.post(API_URL, { title: newTitle });
      setTasks([response.data, ...tasks]);
      setNewTitle('');
      setError('');
    } catch (err) {
      setError('Failed to add task. Please try again.');
    }
  };

  // Toggle task completion
  const toggleTask = async (id) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}`);
      setTasks(tasks.map((task) => (task._id === id ? response.data : task)));
    } catch (err) {
      setError('Failed to update task.');
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      setError('Failed to delete task.');
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <header className="header">
          <h1>📝 Task Manager</h1>
          <p className="subtitle">Stay organized, stay productive</p>
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
