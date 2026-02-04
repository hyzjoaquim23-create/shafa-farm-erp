import React, { useState, useEffect } from 'react';
import apiClient from '../api';
import './ChickenManagement.css';

function ChickenManagement() {
  const [chickens, setChickens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    tag_number: '',
    date_of_birth: '',
    gender: 'female',
    breed: '',
    color: '',
    health_status: 'healthy',
    location: '',
    weight: '',
    notes: ''
  });

  useEffect(() => {
    fetchChickens();
  }, []);

  const fetchChickens = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/chickens');
      setChickens(res.data.chickens || res.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch chickens');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (chicken = null) => {
    if (chicken) {
      setEditing(chicken);
      setFormData({
        name: chicken.name,
        tag_number: chicken.tag_number,
        date_of_birth: chicken.date_of_birth,
        gender: chicken.gender || 'female',
        breed: chicken.breed || '',
        color: chicken.color || '',
        health_status: chicken.health_status || 'healthy',
        location: chicken.location || '',
        weight: chicken.weight || '',
        notes: chicken.notes || ''
      });
    } else {
      setEditing(null);
      setFormData({
        name: '',
        tag_number: '',
        date_of_birth: '',
        gender: 'female',
        breed: '',
        color: '',
        health_status: 'healthy',
        location: '',
        weight: '',
        notes: ''
      });
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.tag_number) {
      setError('Name and tag number are required');
      return;
    }

    try {
      if (editing) {
        await apiClient.put(`/chickens/${editing.id}`, formData);
        setSuccess(`Chicken "${formData.name}" updated`);
      } else {
        await apiClient.post('/chickens', formData);
        setSuccess(`Chicken "${formData.name}" added`);
      }
      await fetchChickens();
      handleCloseForm();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save chicken');
      console.error(err);
    }
  };

  const handleDelete = (chicken) => setConfirmDelete(chicken);

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    try {
      await apiClient.delete(`/chickens/${confirmDelete.id}`);
      await fetchChickens();
      setConfirmDelete(null);
    } catch (err) {
      setError('Failed to delete chicken');
      console.error(err);
    }
  };

  const handleCancelDelete = () => setConfirmDelete(null);

  const filtered = chickens.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.tag_number || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="chicken-mgmt-loading">Loading chickens...</div>;

  return (
    <div className="chicken-management">
      <div className="goat-mgmt-header">
        <h1>Chicken Management</h1>
        <button className="btn btn-primary" onClick={() => handleOpenForm()}>+ Add Chicken</button>
      </div>

      {error && <div className="error-alert">{error}</div>}
      {success && <div className="success-alert">{success}</div>}

      <div className="search-section">
        <input className="search-input" placeholder="Search by name or tag..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={handleCloseForm}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Edit Chicken' : 'Add Chicken'}</h2>
              <button className="close-btn" onClick={handleCloseForm}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="goat-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Name *</label>
                  <input name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Tag Number *</label>
                  <input name="tag_number" value={formData.tag_number} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleInputChange}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Breed</label>
                  <input name="breed" value={formData.breed} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Color</label>
                  <input name="color" value={formData.color} onChange={handleInputChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Location/Coop</label>
                  <input name="location" value={formData.location} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Weight (kg)</label>
                  <input type="number" name="weight" value={formData.weight} onChange={handleInputChange} step="0.1" />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows="3" />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCloseForm}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update Chicken' : 'Add Chicken'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="modal-overlay" onClick={handleCancelDelete}>
          <div className="modal-content confirm-modal" onClick={e => e.stopPropagation()}>
            <h2>Confirm Delete</h2>
            <p>Delete chicken <strong>{confirmDelete.name}</strong> ({confirmDelete.tag_number})?</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={handleCancelDelete}>Cancel</button>
              <button className="btn btn-danger" onClick={handleConfirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="goats-grid">
        {filtered.length === 0 ? (
          <div className="no-goats"><p>No chickens found.</p></div>
        ) : (
          filtered.map(chicken => (
            <div key={chicken.id} className="goat-card">
              <div className="goat-card-header">
                <div className="goat-card-title">
                  <span className="gender-icon" data-gender={chicken.gender}>{chicken.gender === 'male' ? '♂' : '♀'}</span>
                  <span className="goat-name">{chicken.name}</span>
                </div>
                <span className="goat-tag">#{chicken.tag_number}</span>
              </div>
              <div className="goat-card-body">
                <div className="info-row"><span className="label">Breed:</span><span className="value">{chicken.breed || 'Unknown'}</span></div>
                <div className="info-row"><span className="label">Location:</span><span className="value">{chicken.location || 'Not set'}</span></div>
                <div className="badges-row">
                  <span className={`badge health-${chicken.health_status || 'healthy'}`}>{(chicken.health_status || 'healthy').charAt(0).toUpperCase() + (chicken.health_status || 'healthy').slice(1)}</span>
                </div>
              </div>
              <div className="goat-card-actions">
                <button className="btn-icon btn-edit" onClick={() => handleOpenForm(chicken)}>✎</button>
                <button className="btn-icon btn-delete" onClick={() => handleDelete(chicken)}>🗑</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ChickenManagement;
