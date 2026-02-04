import React, { useState, useEffect } from 'react';
import { getExpenses, createExpense, updateExpense, deleteExpense } from '../api';
import './Expenses.css';

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [activeCategory, setActiveCategory] = useState('livestock');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', amount: '', date: '', category: '', notes: '' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const isOwner = user?.role === 'owner';
  const canManage = user && (user.role === 'manager' || user.role === 'admin');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await getExpenses();
      setExpenses(res.data.expenses || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch expenses');
      console.error('Fetch expenses error:', err);
    } finally {
      setLoading(false);
    }
  };

  const openForm = (expense = null) => {
    if (expense) {
      setEditing(expense);
      setForm({ title: expense.title, amount: expense.amount, date: expense.date, category: expense.category || '', notes: expense.notes || '' });
    } else {
      setEditing(null);
      setForm({ title: '', amount: '', date: '', category: activeCategory, notes: '' });
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title || !form.amount || !form.date) {
      setError('Title, amount and date are required');
      return;
    }

    try {
      if (editing) {
        await updateExpense(editing.id, form);
      } else {
        await createExpense(form);
      }
      await fetchExpenses();
      closeForm();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save expense');
      console.error('Save expense error:', err);
    }
  };

  const handleDelete = async (id) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteExpense(deleteConfirm);
      await fetchExpenses();
      setDeleteConfirm(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete expense');
      console.error('Delete expense error:', err);
      setDeleteConfirm(null);
    }
  };

  if (loading) return <div className="expenses-loading">Loading expenses...</div>;

  return (
    <div className="expenses-page">
      <div className="expenses-header">
        <h1>Expenses</h1>
        <div className="expenses-filters">
          <button className={`btn ${activeCategory === 'livestock' ? 'active' : ''}`} onClick={() => setActiveCategory('livestock')}>Livestock Expenses</button>
          <button className={`btn ${activeCategory === 'crops' ? 'active' : ''}`} onClick={() => setActiveCategory('crops')}>Crops Expenses</button>
          <button className={`btn ${activeCategory === 'general' ? 'active' : ''}`} onClick={() => setActiveCategory('general')}>General Expenses</button>
        </div>
        {canManage && <button className="btn btn-primary" onClick={() => openForm()}>+ Add Expense</button>}
      </div>

      {error && <div className="error-alert">{error}</div>}

      {showForm && (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Edit Expense' : 'Add Expense'}</h2>
              <button className="close-btn" onClick={closeForm}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="expense-form">
              <div className="form-group">
                <label>Title *</label>
                <input name="title" value={form.title} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Amount *</label>
                <input name="amount" type="number" step="0.01" value={form.amount} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Date *</label>
                <input name="date" type="date" value={form.date} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <div className="category-display">{form.category || 'Uncategorized'}</div>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={closeForm}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="expenses-list">
        {expenses.filter(exp => exp.category === activeCategory).length === 0 ? (
          <p>No expenses recorded.</p>
        ) : (
          expenses.filter(exp => exp.category === activeCategory).map(exp => (
            <div key={exp.id} className="expense-card">
              <div className="expense-row">
                <div>
                  <div className="expense-title">{exp.title}</div>
                  <div className="expense-meta">{exp.date} • {exp.category || 'Uncategorized'}</div>
                </div>
                <div className="expense-amount">{(Number(exp.amount) || 0).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}).replace(/^/, 'K ')}</div>
              </div>
              <div className="expense-notes">{exp.notes}</div>
              <div className="expense-actions">
                {user?.role !== 'owner' && user?.role !== 'staff' && <button className="btn-icon" onClick={() => openForm(exp)} title="Edit expense">✎</button>}
                {user?.role !== 'owner' && user?.role !== 'staff' && <button className="btn-icon" onClick={() => handleDelete(exp.id)} title="Delete expense">🗑</button>}
              </div>
            </div>
          ))
        )}
      </div>

      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Delete Expense?</h3>
            <p>Are you sure you want to delete this expense? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Expenses;
