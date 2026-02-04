import React, { useState, useEffect } from 'react';
import apiClient from '../api';
import './PlantManagement.css';

function PlantManagement() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    species: '',
    planting_date: '',
    stage: 'seedling',
    location: '',
    health_status: 'healthy',
    yield_estimate: '',
    notes: ''
  });

  useEffect(() => { fetchPlants(); }, []);

  const fetchPlants = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/plants');
      setPlants(res.data.plants || res.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch plants');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (p = null) => {
    if (p) {
      setEditing(p);
      setFormData({
        name: p.name,
        species: p.species || '',
        planting_date: p.planting_date || '',
        stage: p.stage || 'seedling',
        location: p.location || '',
        health_status: p.health_status || 'healthy',
        yield_estimate: p.yield_estimate || '',
        notes: p.notes || ''
      });
    } else {
      setEditing(null);
      setFormData({ name:'', species:'', planting_date:'', stage:'seedling', location:'', health_status:'healthy', yield_estimate:'', notes:'' });
    }
    setShowForm(true);
  };

  const handleCloseForm = () => { setShowForm(false); setEditing(null); };

  const handleInputChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    if (!formData.name) { setError('Name is required'); return; }
    try {
      if (editing) {
        await apiClient.put(`/plants/${editing.id}`, formData);
        setSuccess('Plant updated');
      } else {
        await apiClient.post('/plants', formData);
        setSuccess('Plant added');
      }
      await fetchPlants(); handleCloseForm(); setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save plant'); console.error(err);
    }
  };

  const handleDelete = (p) => setConfirmDelete(p);
  const handleConfirmDelete = async () => { if (!confirmDelete) return; try { await apiClient.delete(`/plants/${confirmDelete.id}`); await fetchPlants(); setConfirmDelete(null); } catch (err) { setError('Failed to delete plant'); console.error(err); } };
  const handleCancelDelete = () => setConfirmDelete(null);

  const filtered = plants.filter(p => (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (p.species || '').toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div className="plant-mgmt-loading">Loading plants...</div>;

  return (
    <div className="plant-management">
      <div className="goat-mgmt-header">
        <h1>Plant Management</h1>
        <button className="btn btn-primary" onClick={() => handleOpenForm()}>+ Add Plant</button>
      </div>

      {error && <div className="error-alert">{error}</div>}
      {success && <div className="success-alert">{success}</div>}

      <div className="search-section">
        <input className="search-input" placeholder="Search by name or species..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={handleCloseForm}><div className="modal-content" onClick={e=>e.stopPropagation()}>
          <div className="modal-header"><h2>{editing? 'Edit Plant':'Add Plant'}</h2><button className="close-btn" onClick={handleCloseForm}>×</button></div>
          <form onSubmit={handleSubmit} className="goat-form">
            <div className="form-row"><div className="form-group"><label>Name *</label><input name="name" value={formData.name} onChange={handleInputChange} required/></div>
            <div className="form-group"><label>Species</label><input name="species" value={formData.species} onChange={handleInputChange}/></div></div>
            <div className="form-row"><div className="form-group"><label>Planting Date</label><input type="date" name="planting_date" value={formData.planting_date} onChange={handleInputChange}/></div>
            <div className="form-group"><label>Stage</label><select name="stage" value={formData.stage} onChange={handleInputChange}><option value="seedling">Seedling</option><option value="vegetative">Vegetative</option><option value="flowering">Flowering</option><option value="harvest">Harvest</option></select></div></div>
            <div className="form-row"><div className="form-group"><label>Location/Bed</label><input name="location" value={formData.location} onChange={handleInputChange}/></div>
            <div className="form-group"><label>Yield Estimate</label><input name="yield_estimate" value={formData.yield_estimate} onChange={handleInputChange}/></div></div>
            <div className="form-group full-width"><label>Notes</label><textarea name="notes" value={formData.notes} onChange={handleInputChange} rows="3"/></div>
            <div className="form-actions"><button type="button" className="btn btn-secondary" onClick={handleCloseForm}>Cancel</button><button type="submit" className="btn btn-primary">{editing? 'Update Plant':'Add Plant'}</button></div>
          </form></div></div>
      )}

      {confirmDelete && (<div className="modal-overlay" onClick={handleCancelDelete}><div className="modal-content confirm-modal" onClick={e=>e.stopPropagation()}><h2>Confirm Delete</h2><p>Delete plant <strong>{confirmDelete.name}</strong>?</p><div className="modal-actions"><button className="btn btn-secondary" onClick={handleCancelDelete}>Cancel</button><button className="btn btn-danger" onClick={handleConfirmDelete}>Delete</button></div></div></div>)}

      <div className="goats-grid">{filtered.length === 0 ? (<div className="no-goats"><p>No plants found.</p></div>) : (filtered.map(p => (
        <div key={p.id} className="goat-card"><div className="goat-card-header"><div className="goat-card-title"><span className="goat-name">{p.name}</span></div><span className="goat-tag">{p.species || ''}</span></div>
        <div className="goat-card-body"><div className="info-row"><span className="label">Stage:</span><span className="value">{p.stage}</span></div><div className="info-row"><span className="label">Location:</span><span className="value">{p.location || '—'}</span></div></div>
        <div className="goat-card-actions"><button className="btn-icon btn-edit" onClick={()=>handleOpenForm(p)}>✎</button><button className="btn-icon btn-delete" onClick={()=>handleDelete(p)}>🗑</button></div></div>
      )))}</div>
    </div>
  );
}

export default PlantManagement;
