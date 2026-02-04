import React, { useState, useEffect } from 'react';
import apiClient from '../api';
import { getVaccines, createVaccine, getVaccinations, createVaccination, updateVaccination, deleteVaccination } from '../api';
import './GoatManagement.css';

function GoatManagement() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [goats, setGoats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingGoat, setEditingGoat] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showParentModal, setShowParentModal] = useState(false);
  const [selectedGoatForParent, setSelectedGoatForParent] = useState(null);
  const [parentFormData, setParentFormData] = useState({ parent_id: '', relationship_type: 'dam' });
  const [existingMother, setExistingMother] = useState(null);
  const [showReplaceConfirm, setShowReplaceConfirm] = useState(false);

  // Status management
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedGoatForStatus, setSelectedGoatForStatus] = useState(null);
  const [statusAction, setStatusAction] = useState(null); // 'health', 'sold', 'dead'
  const [statusFormData, setStatusFormData] = useState({ health_status: '', sold_price: '', date_sold: new Date().toISOString().split('T')[0], date_of_death: new Date().toISOString().split('T')[0] });

  // Delivery management
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [selectedGoatForDelivery, setSelectedGoatForDelivery] = useState(null);
  const [deliveryFormData, setDeliveryFormData] = useState({ tag_number: '', gender: 'female', breed: '', color: '' });

  const [vaccines, setVaccines] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [showVaccForm, setShowVaccForm] = useState(false);
  const [showVaccineForm, setShowVaccineForm] = useState(false);
  const [editingVaccination, setEditingVaccination] = useState(null);
  const [deleteVaccConfirm, setDeleteVaccConfirm] = useState(null);
  const [goatSearchTerm, setGoatSearchTerm] = useState('');
  const [showGoatSuggestions, setShowGoatSuggestions] = useState(false);

  const [allGoatsForTree, setAllGoatsForTree] = useState([]);
  const [selectedGoatForTree, setSelectedGoatForTree] = useState(null);
  const [familyData, setFamilyData] = useState(null);
  const [loadingFamily, setLoadingFamily] = useState(false);
  const [treeSearchTerm, setTreeSearchTerm] = useState('');

  // Inventory Stats for Stock Overview
  const [inventoryStats, setInventoryStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const [formData, setFormData] = useState({
    tag_number: '', date_of_birth: '', gender: 'female',
    breed: '', color: '', health_status: 'healthy', location: '',
    weight: '', breeding_status: 'non-breeding', notes: ''
  });

  const [vaccForm, setVaccForm] = useState({
    goat_id: '', goat_search: '', vaccine_id: '',
    vaccination_date: new Date().toISOString().split('T')[0],
    next_due_date: '', veterinarian_name: '', batch_number: '',
    route: 'injection', site: '', notes: ''
  });

  const [vaccineForm, setVaccineForm] = useState({
    name: '', description: '', manufacturer: '', disease_protection: '', dosage: ''
  });

  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const isOwner = user?.role === 'owner';
  const canManage = user && (user.role === 'manager' || user.role === 'admin');

  useEffect(() => {
    fetchAllData();
    fetchInventoryStats();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [goatsRes, vaccinesRes, vaccinationsRes, treeRes] = await Promise.all([
        apiClient.get('/goats'),
        getVaccines(),
        getVaccinations(),
        apiClient.get('/family-tree')
      ]);

      setGoats(goatsRes.data.goats || []);
      setVaccines(vaccinesRes.data.vaccines || []);
      setVaccinations(vaccinationsRes.data.vaccinations || []);
      setAllGoatsForTree(treeRes.data.familyTree || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const fetchInventoryStats = async () => {
    try {
      setStatsLoading(true);
      const response = await apiClient.get('/goats/stats/inventory');
      setInventoryStats(response.data.stats);
    } catch (err) {
      console.error('Error fetching inventory stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  // ==================== GOATS ====================

  const handleOpenForm = (goat = null) => {
    if (goat) {
      setEditingGoat(goat);
      setFormData({
        tag_number: goat.tag_number, date_of_birth: goat.date_of_birth,
        gender: goat.gender, breed: goat.breed || '', color: goat.color || '',
        health_status: goat.health_status, location: goat.location || '', weight: goat.weight || '',
        breeding_status: goat.breeding_status, notes: goat.notes || ''
      });
    } else {
      setEditingGoat(null);
      setFormData({
        tag_number: '', date_of_birth: '', gender: 'female',
        breed: '', color: '', health_status: 'healthy', location: '',
        weight: '', breeding_status: 'non-breeding', notes: ''
      });
    }
    setShowForm(true);
  };

  const handleCloseForm = () => { setShowForm(false); setEditingGoat(null); };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGoat) {
        await apiClient.put(`/goats/${editingGoat.id}`, formData);
        setSuccess('Goat updated successfully');
      } else {
        await apiClient.post('/goats', formData);
        setSuccess('Goat added successfully');
      }
      handleCloseForm();
      fetchAllData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save goat');
    }
  };

  const handleDelete = (goat) => { setConfirmDelete(goat); };

  const handleConfirmDelete = async () => {
    try {
      await apiClient.delete(`/goats/${confirmDelete.id}`);
      setSuccess('Goat deleted successfully');
      setConfirmDelete(null);
      fetchAllData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete goat');
    }
  };

  const handleOpenParentModal = async (goat) => {
    setSelectedGoatForParent(goat);
    setParentFormData({ parent_id: '', relationship_type: 'dam' });
    setShowReplaceConfirm(false);
    
    // Fetch existing dam from pedigree
    try {
      const response = await apiClient.get(`/family-tree/${goat.id}/genealogy`);
      const existingDam = response.data.ancestors?.find(a => a.relationship_type === 'dam');
      setExistingMother(existingDam || null);
    } catch (err) {
      console.error('Error fetching existing dam:', err);
      setExistingMother(null);
    }
    
    setShowParentModal(true);
  };

  const handleCloseParentModal = () => { setShowParentModal(false); };

  const handleAddParent = async (e) => {
    e.preventDefault();
    if (!parentFormData.parent_id) {
      setError('Please select a mother goat');
      return;
    }
    
    try {
      // If replacing existing dam, delete it first
      if (existingMother && showReplaceConfirm) {
        await apiClient.delete(`/goats/${selectedGoatForParent.id}/pedigree/${existingMother.id}`);
      }
      
      // Add new dam
      await apiClient.post(`/goats/${selectedGoatForParent.id}/pedigree`, {
        parent_goat_id: parentFormData.parent_id,
        relationship_type: 'dam'
      });
      setSuccess('Mother added successfully');
      handleCloseParentModal();
      fetchAllData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add mother');
    }
  };

  // ==================== STATUS MANAGEMENT ====================

  const handleOpenStatusModal = (goat) => {
    setSelectedGoatForStatus(goat);
    setStatusAction(null);
    setStatusFormData({ 
      health_status: goat.health_status || 'healthy', 
      sold_price: '', 
      date_sold: new Date().toISOString().split('T')[0], 
      date_of_death: new Date().toISOString().split('T')[0] 
    });
    setShowStatusModal(true);
  };

  const handleCloseStatusModal = () => { 
    setShowStatusModal(false); 
    setStatusAction(null);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedGoatForStatus || !statusAction) {
      setError('Please select a goat and action');
      return;
    }

    try {
      setError('');
      setSuccess('');
      
      if (statusAction === 'health') {
        console.log('Updating health status:', {goatId: selectedGoatForStatus.id, status: statusFormData.health_status});
        const response = await apiClient.patch(`/goats/${selectedGoatForStatus.id}/health-status`, {
          health_status: statusFormData.health_status
        });
        console.log('Health status response:', response.data);
        setSuccess(`Health status updated to ${statusFormData.health_status}`);
      } else if (statusAction === 'sold') {
        if (!statusFormData.sold_price || !statusFormData.date_sold) {
          setError('Please provide price and date sold');
          return;
        }
        console.log('Marking as sold:', {goatId: selectedGoatForStatus.id, price: statusFormData.sold_price, date: statusFormData.date_sold});
        const response = await apiClient.patch(`/goats/${selectedGoatForStatus.id}/sold`, {
          sold_price: parseFloat(statusFormData.sold_price),
          date_sold: statusFormData.date_sold
        });
        console.log('Sold response:', response.data);
        setSuccess(`Goat marked as sold for K ${parseFloat(statusFormData.sold_price).toLocaleString()}`);
      } else if (statusAction === 'dead') {
        if (!statusFormData.date_of_death) {
          setError('Please provide date of death');
          return;
        }
        console.log('Marking as dead:', {goatId: selectedGoatForStatus.id, date: statusFormData.date_of_death, cause: statusFormData.cause});
        const response = await apiClient.patch(`/goats/${selectedGoatForStatus.id}/dead`, {
          date_of_death: statusFormData.date_of_death,
          cause: statusFormData.cause || ''
        });
        console.log('Dead response:', response.data);
        setSuccess('Goat marked as deceased');
      }
      
      setTimeout(() => {
        handleCloseStatusModal();
        fetchAllData();
      }, 1000);
    } catch (err) {
      console.error('Status update error:', err);
      const errorMsg = err.response?.data?.error || err.message || 'Failed to update status';
      setError(errorMsg);
    }
  };

  const handleReactivateGoat = async (goat) => {
    if (window.confirm(`Reactivate goat #${goat.tag_number}? This will remove its sold/dead status.`)) {
      try {
        setError('');
        setSuccess('');
        const response = await apiClient.patch(`/goats/${goat.id}/reactivate`);
        setSuccess('Goat reactivated successfully');
        console.log('Reactivate response:', response.data);
        
        setTimeout(() => {
          fetchAllData();
        }, 1000);
      } catch (err) {
        console.error('Reactivate error:', err);
        const errorMsg = err.response?.data?.error || err.message || 'Failed to reactivate goat';
        setError(errorMsg);
      }
    }
  };

  // ==================== DELIVERY MANAGEMENT ====================

  const handleOpenDeliveryModal = (goat) => {
    setSelectedGoatForDelivery(goat);
    setDeliveryFormData({ tag_number: '', gender: 'female', breed: goat.breed || '', color: goat.color || '' });
    setShowDeliveryModal(true);
  };

  const handleCloseDeliveryModal = () => {
    setShowDeliveryModal(false);
    setSelectedGoatForDelivery(null);
  };

  const handleDeliveryInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRecordDelivery = async (e) => {
    e.preventDefault();
    if (!selectedGoatForDelivery || !deliveryFormData.tag_number) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setError('');
      setSuccess('');
      const response = await apiClient.post(`/goats/${selectedGoatForDelivery.id}/deliver`, deliveryFormData);
      console.log('Delivery response:', response.data);
      setSuccess(`Baby goat #${deliveryFormData.tag_number} born successfully! Mother's health updated to healthy.`);
      
      setTimeout(() => {
        handleCloseDeliveryModal();
        fetchAllData();
      }, 1000);
    } catch (err) {
      console.error('Delivery error:', err);
      const errorMsg = err.response?.data?.error || err.message || 'Failed to record delivery';
      setError(errorMsg);
    }
  };

  const filteredGoats = goats.filter(g => 
    g.tag_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ==================== VACCINATIONS ====================

  const handleAddVaccination = async (e) => {
    e.preventDefault();
    try {
      await createVaccination({
        goat_id: vaccForm.goat_id,
        vaccine_id: vaccForm.vaccine_id,
        vaccination_date: vaccForm.vaccination_date,
        next_due_date: vaccForm.next_due_date,
        veterinarian_name: vaccForm.veterinarian_name,
        batch_number: vaccForm.batch_number,
        route: vaccForm.route,
        site: vaccForm.site,
        notes: vaccForm.notes
      });
      setSuccess('Vaccination added successfully');
      setShowVaccForm(false);
      setVaccForm({
        goat_id: '', goat_search: '', vaccine_id: '',
        vaccination_date: new Date().toISOString().split('T')[0],
        next_due_date: '', veterinarian_name: '', batch_number: '',
        route: 'injection', site: '', notes: ''
      });
      fetchAllData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add vaccination');
    }
  };

  // ==================== FAMILY TREE ====================

  const handleGetFamilyData = async (goatId) => {
    try {
      setLoadingFamily(true);
      const response = await apiClient.get(`/family-tree/${goatId}/genealogy`);
      // debug: log server returned parents/ancestors
      console.debug('family-tree response ancestors:', response.data.ancestors);
      console.debug('family-tree response directParents:', response.data.directParents);

      setFamilyData({
        root: response.data.goat,
        // prefer directParents provided by backend; fallback to ancestors filter
        parents: (response.data.directParents || response.data.ancestors || []).filter(a => a.relationship_type === 'dam').slice(0,1),
        children: response.data.descendants
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch family tree');
    } finally {
      setLoadingFamily(false);
    }
  };

  if (loading && !inventoryStats) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="goat-management">
      <div className="goat-mgmt-header">
        <h1>🐐 Goat Management Center</h1>
      </div>

      {error && <div className="error-alert">{error}</div>}
      {success && <div className="success-alert">{success}</div>}

      {/* TABS */}
      <div className="goat-tabs">
        <button className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>
          📋 Inventory
        </button>
        <button className={`tab-btn ${activeTab === 'vaccinations' ? 'active' : ''}`} onClick={() => setActiveTab('vaccinations')}>
          💉 Vaccinations
        </button>
        <button className={`tab-btn ${activeTab === 'delivery' ? 'active' : ''}`} onClick={() => setActiveTab('delivery')}>
          🐣 Delivery
        </button>
        <button className={`tab-btn ${activeTab === 'family-tree' ? 'active' : ''}`} onClick={() => setActiveTab('family-tree')}>
          👨‍👩‍👧‍👦 Family Tree
        </button>
        <button className={`tab-btn ${activeTab === 'stock-overview' ? 'active' : ''}`} onClick={() => setActiveTab('stock-overview')}>
          📊 Stock Overview
        </button>
      </div>

      {/* INVENTORY TAB */}
      {activeTab === 'inventory' && (
        <div className="tab-content inventory-content">
          <div className="inventory-header">
            <div className="header-top">
              <h2>📋 Goat Inventory</h2>
              {!isOwner && <button className="btn btn-primary btn-add-goat" onClick={() => handleOpenForm()}>+ Add Goat</button>}
            </div>
            <div className="search-section">
              <input 
                type="text" 
                placeholder="🔍 Search by tag number..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="search-input" 
              />
            </div>
          </div>

          {showForm && (
            <div className="modal-overlay" onClick={handleCloseForm}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>{editingGoat ? 'Edit' : 'Add'} Goat</h2>
                  <button className="close-btn" onClick={handleCloseForm}>×</button>
                </div>
                <form onSubmit={handleSubmit} className="goat-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Tag Number *</label>
                      <input type="text" name="tag_number" value={formData.tag_number} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                      <label>Gender *</label>
                      <select name="gender" value={formData.gender} onChange={handleInputChange} required>
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>DOB *</label>
                      <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                      <label>Breed</label>
                      <input type="text" name="breed" value={formData.breed} onChange={handleInputChange} />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Color</label>
                      <input type="text" name="color" value={formData.color} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>Location</label>
                      <input type="text" name="location" value={formData.location} onChange={handleInputChange} />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Health</label>
                      <select name="health_status" value={formData.health_status} onChange={handleInputChange}>
                        <option value="healthy">Healthy</option>
                        <option value="sick">Sick</option>
                        <option value="pregnant">Pregnant</option>
                        <option value="injured">Injured</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Breeding</label>
                      <select name="breeding_status" value={formData.breeding_status} onChange={handleInputChange}>
                        <option value="breeding">Breeding</option>
                        <option value="non-breeding">Non-Breeding</option>
                        <option value="retired">Retired</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
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
                    <button type="submit" className="btn btn-primary">Save</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {confirmDelete && (
            <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
              <div className="modal-content confirm-modal" onClick={e => e.stopPropagation()}>
                <h2>Delete?</h2>
                <p>#{confirmDelete.tag_number}</p>
                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
                  <button className="btn btn-danger" onClick={handleConfirmDelete}>Delete</button>
                </div>
              </div>
            </div>
          )}

          {showParentModal && selectedGoatForParent && (
            <div className="modal-overlay" onClick={handleCloseParentModal}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>👩 Add Mother to #{selectedGoatForParent.tag_number}</h2>
                  <button className="close-btn" onClick={handleCloseParentModal}>×</button>
                </div>

                {!existingMother && (
                  <div className="no-mother-info">
                    <div className="alert alert-warning">
                      <p><strong>⚠️ No Mother Assigned</strong></p>
                      <p>This goat does not have a mother (dam) assigned. Please select one below.</p>
                    </div>
                  </div>
                )}
                
                {existingMother && !showReplaceConfirm && (
                  <div className="existing-mother-info">
                    <div className="alert alert-success">
                      <div className="alert-header">
                        <strong>✓ Current Mother (Dam):</strong>
                        <span>#{existingMother.tag_number}</span>
                      </div>
                      <div className="alert-breed">Breed: {existingMother.breed || 'Unknown'}</div>
                      <button type="button" className="btn btn-warning" onClick={() => setShowReplaceConfirm(true)}>
                        🔄 Replace Mother
                      </button>
                    </div>
                  </div>
                )}

                <form onSubmit={handleAddParent}>
                  <div className="form-group">
                    <label>Select Mother (Dam) *</label>
                    <select 
                      value={parentFormData.parent_id} 
                      onChange={(e) => setParentFormData({...parentFormData, parent_id: e.target.value})} 
                      required
                    >
                      <option value="">-- Choose a mother goat --</option>
                      {goats
                        .filter(g => g.gender === 'female' && g.id !== selectedGoatForParent.id)
                        .map(g => (
                          <option key={g.id} value={g.id}>
                            #{g.tag_number} - {g.breed || 'Unknown'} (DOB: {g.date_of_birth})
                          </option>
                        ))
                      }
                    </select>
                  </div>

                  <p className="info-text">📌 Only the mother (dam) can be assigned. Sire information is managed separately.</p>

                  <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={handleCloseParentModal}>Cancel</button>
                    <button type="submit" className="btn btn-primary">
                      {existingMother && showReplaceConfirm ? 'Replace Mother' : 'Add Mother'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showStatusModal && selectedGoatForStatus && (
            <div className="modal-overlay" onClick={handleCloseStatusModal}>
              <div className="modal-content status-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>⚕️ Manage Status - #{selectedGoatForStatus.tag_number}</h2>
                  <button className="close-btn" onClick={handleCloseStatusModal}>×</button>
                </div>

                <div className="status-actions-grid">
                  <button 
                    type="button" 
                    className={`status-action-btn ${statusAction === 'health' ? 'active' : ''}`}
                    onClick={() => setStatusAction('health')}
                  >
                    🏥 Health Status
                  </button>
                  <button 
                    type="button" 
                    className={`status-action-btn ${statusAction === 'sold' ? 'active' : ''}`}
                    onClick={() => setStatusAction('sold')}
                  >
                    💰 Mark as Sold
                  </button>
                  <button 
                    type="button" 
                    className={`status-action-btn ${statusAction === 'dead' ? 'active' : ''}`}
                    onClick={() => setStatusAction('dead')}
                  >
                    🪦 Mark as Dead
                  </button>
                </div>

                {statusAction && (
                  <form onSubmit={handleUpdateStatus} className="status-form">
                    {statusAction === 'health' && (
                      <div className="form-group">
                        <label>Health Status *</label>
                        <select 
                          value={statusFormData.health_status}
                          onChange={(e) => setStatusFormData({...statusFormData, health_status: e.target.value})}
                          required
                        >
                          <option value="healthy">🟢 Healthy</option>
                          <option value="sick">🔴 Sick</option>
                          <option value="injured">🟡 Injured</option>
                          <option value="pregnant" disabled={selectedGoatForStatus?.gender === 'male'}>
                            🤰 Pregnant {selectedGoatForStatus?.gender === 'male' ? '(Females only)' : ''}
                          </option>
                        </select>
                        {selectedGoatForStatus?.gender === 'male' && statusFormData.health_status === 'pregnant' && (
                          <small style={{ color: '#e74c3c' }}>Male goats cannot be marked as pregnant</small>
                        )}
                      </div>
                    )}

                    {statusAction === 'sold' && (
                      <>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Selling Price (K) *</label>
                            <input 
                              type="number" 
                              value={statusFormData.sold_price}
                              onChange={(e) => setStatusFormData({...statusFormData, sold_price: e.target.value})}
                              step="0.01"
                              min="0"
                              required
                              placeholder="Enter price in Kwacha"
                            />
                          </div>
                          <div className="form-group">
                            <label>Date Sold *</label>
                            <input 
                              type="date" 
                              value={statusFormData.date_sold}
                              onChange={(e) => setStatusFormData({...statusFormData, date_sold: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        <div className="alert alert-info">
                          ℹ️ Sold goats will be removed from the inventory but tracked in Stock Overview.
                        </div>
                      </>
                    )}

                    {statusAction === 'dead' && (
                      <>
                        <div className="form-group">
                          <label>Date of Death *</label>
                          <input 
                            type="date" 
                            value={statusFormData.date_of_death}
                            onChange={(e) => setStatusFormData({...statusFormData, date_of_death: e.target.value})}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Cause of Death / Notes</label>
                          <textarea
                            value={statusFormData.cause || ''}
                            onChange={(e) => setStatusFormData({...statusFormData, cause: e.target.value})}
                            placeholder="Enter reason or notes about the death (optional)"
                            rows={3}
                          />
                        </div>
                        <div className="alert alert-warning">
                          ⚠️ This action will record the goat's death and remove it from active inventory.
                        </div>
                      </>
                    )}

                    <div className="form-actions">
                      <button type="button" className="btn btn-secondary" onClick={handleCloseStatusModal}>Cancel</button>
                      <button type="submit" className="btn btn-primary">
                        {statusAction === 'health' && 'Update Health Status'}
                        {statusAction === 'sold' && 'Mark as Sold'}
                        {statusAction === 'dead' && 'Mark as Dead'}
                      </button>
                    </div>
                  </form>
                )}

                {!statusAction && (
                  <div className="status-notice">
                    <p>Select an action above to manage this goat's status.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="goats-list">
            {filteredGoats.length > 0 ? (
              <div className="goats-grid">
                {filteredGoats.map(goat => {
                  const isDeactivated = goat.is_sold || goat.is_dead;
                  return (
                  <div key={goat.id} className={`goat-card ${isDeactivated ? 'deactivated' : ''}`}>
                    <div className="goat-header">
                      <div className="tag-gender">
                        <h3 className="tag-number">#{goat.tag_number}</h3>
                        <span className={`gender-badge ${goat.gender}`}>{goat.gender === 'male' ? '♂ Male' : '♀ Female'}</span>
                      </div>
                      {isDeactivated && (
                        <div className="status-badge-wrapper">
                          <span className={`deactivation-badge ${goat.is_sold ? 'sold' : 'dead'}`}>
                            {goat.is_sold ? '✓ SOLD' : '✕ DEAD'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="goat-details">
                      <div className="detail-row">
                        <span className="label">Breed:</span>
                        <span className="value">{goat.breed || 'Not specified'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">DOB:</span>
                        <span className="value">{goat.date_of_birth}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Location:</span>
                        <span className="value">{goat.location || 'N/A'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Health:</span>
                        <span className={`status-badge health-${goat.health_status}`}>{goat.health_status}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Breeding:</span>
                        <span className={`status-badge breeding-${goat.breeding_status}`}>{goat.breeding_status}</span>
                      </div>
                      {goat.is_sold && (
                        <div className="detail-row">
                          <span className="label">Sold Price:</span>
                          <span className="value">K {parseFloat(goat.sold_price).toLocaleString()}</span>
                        </div>
                      )}
                      {goat.is_dead && (
                        <div className="detail-row">
                          <span className="label">Date of Death:</span>
                          <span className="value">{goat.date_of_death}</span>
                        </div>
                      )}
                    </div>
                    {!isOwner && (
                      <div className="goat-actions">
                        <button 
                          className="btn-icon btn-status" 
                          onClick={() => handleOpenStatusModal(goat)} 
                          title={isDeactivated ? 'Goat is deactivated' : 'Manage Status'}
                          disabled={isDeactivated}
                        >
                          ⚕️
                        </button>
                        <button 
                          className="btn-icon btn-parents" 
                          onClick={() => handleOpenParentModal(goat)} 
                          title={isDeactivated ? 'Goat is deactivated' : 'Add Parents'}
                          disabled={isDeactivated}
                        >
                          👨‍👩‍👦
                        </button>
                        <button 
                          className="btn-icon btn-edit" 
                          onClick={() => handleOpenForm(goat)} 
                          title={isDeactivated ? 'Goat is deactivated' : 'Edit'}
                          disabled={isDeactivated}
                        >
                          ✎
                        </button>
                        {isDeactivated && user?.role === 'admin' && (
                          <button 
                            className="btn-icon btn-reactivate" 
                            onClick={() => handleReactivateGoat(goat)} 
                            title="Reactivate Goat"
                          >
                            ↻
                          </button>
                        )}
                        <button 
                          className="btn-icon btn-delete" 
                          onClick={() => handleDelete(goat)} 
                          title="Delete"
                          disabled={isDeactivated}
                        >
                          🗑
                        </button>
                      </div>
                    )}
                  </div>
                );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <p>📭 No goats found. {searchTerm ? 'Try a different search.' : 'Add your first goat to get started.'}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STOCK OVERVIEW TAB */}
      {activeTab === 'stock-overview' && (
        <div className="tab-content stock-overview-content">
          <div className="stock-header">
            <h2>📊 Goat Inventory Dashboard</h2>
            {inventoryStats && <p className="subtitle">Total Livestock: <strong>{inventoryStats.total} Goats</strong></p>}
          </div>

          {statsLoading && <div className="inventory-loading">Loading inventory data...</div>}
          {!statsLoading && inventoryStats && (
            <>
              {/* Main Stats */}
              <div className="stats-grid">
                <div className="stat-card total-card">
                  <div className="stat-icon">🐐</div>
                  <div className="stat-content">
                    <h3>Total Goats</h3>
                    <p className="stat-number">{inventoryStats.total}</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">♂</div>
                  <div className="stat-content">
                    <h3>Male</h3>
                    <p className="stat-number">{inventoryStats.byGender.male}</p>
                    <p className="percentage">{((inventoryStats.byGender.male / inventoryStats.total) * 100).toFixed(1)}%</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">♀</div>
                  <div className="stat-content">
                    <h3>Female</h3>
                    <p className="stat-number">{inventoryStats.byGender.female}</p>
                    <p className="percentage">{((inventoryStats.byGender.female / inventoryStats.total) * 100).toFixed(1)}%</p>
                  </div>
                </div>

                <div className="stat-card sold-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-content">
                    <h3>Sold</h3>
                    <p className="stat-number">{inventoryStats.totalSold}</p>
                    <p className="sold-revenue">K {inventoryStats.soldRevenue?.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                  </div>
                </div>

                <div className="stat-card dead-card">
                  <div className="stat-icon">🪦</div>
                  <div className="stat-content">
                    <h3>Deceased</h3>
                    <p className="stat-number">{inventoryStats.totalDead}</p>
                  </div>
                </div>
              </div>

              {/* Age Groups */}
              <div className="section">
                <h2>Age Groups</h2>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">🐣</div>
                    <div className="stat-content">
                      <h3>Kids (&lt; 12 months)</h3>
                      <p className="stat-number">{inventoryStats.byAgeGroup.kids}</p>
                      <div className="sub-stats">
                        <span>♂ {inventoryStats.byAgeGroupMale.kids}</span>
                        <span>♀ {inventoryStats.byAgeGroupFemale.kids}</span>
                      </div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">🐑</div>
                    <div className="stat-content">
                      <h3>Yearlings (12-24 months)</h3>
                      <p className="stat-number">{inventoryStats.byAgeGroup.yearlings}</p>
                      <div className="sub-stats">
                        <span>♂ {inventoryStats.byAgeGroupMale.yearlings}</span>
                        <span>♀ {inventoryStats.byAgeGroupFemale.yearlings}</span>
                      </div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">🐐</div>
                    <div className="stat-content">
                      <h3>Adults (24+ months)</h3>
                      <p className="stat-number">{inventoryStats.byAgeGroup.adults}</p>
                      <div className="sub-stats">
                        <span>♂ {inventoryStats.byAgeGroupMale.adults}</span>
                        <span>♀ {inventoryStats.byAgeGroupFemale.adults}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Health Status */}
              <div className="section">
                <h2>Health Status</h2>
                <div className="stats-grid">
                  <div className="stat-card health-healthy">
                    <div className="stat-icon">✓</div>
                    <div className="stat-content">
                      <h3>Healthy</h3>
                      <p className="stat-number">{inventoryStats.byHealthStatus.healthy}</p>
                      <p className="percentage">{((inventoryStats.byHealthStatus.healthy / inventoryStats.total) * 100).toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="stat-card health-sick">
                    <div className="stat-icon">⚠</div>
                    <div className="stat-content">
                      <h3>Sick</h3>
                      <p className="stat-number">{inventoryStats.byHealthStatus.sick}</p>
                      <p className="percentage">{((inventoryStats.byHealthStatus.sick / inventoryStats.total) * 100).toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="stat-card health-pregnant">
                    <div className="stat-icon">🤰</div>
                    <div className="stat-content">
                      <h3>Pregnant</h3>
                      <p className="stat-number">{inventoryStats.byHealthStatus.pregnant}</p>
                      <p className="percentage">{((inventoryStats.byHealthStatus.pregnant / inventoryStats.total) * 100).toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="stat-card health-injured">
                    <div className="stat-icon">🩹</div>
                    <div className="stat-content">
                      <h3>Injured</h3>
                      <p className="stat-number">{inventoryStats.byHealthStatus.injured}</p>
                      <p className="percentage">{((inventoryStats.byHealthStatus.injured / inventoryStats.total) * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Breeding Status */}
              <div className="section">
                <h2>Breeding Status</h2>
                <div className="stats-grid">
                  <div className="stat-card breeding-active">
                    <div className="stat-icon">👫</div>
                    <div className="stat-content">
                      <h3>Breeding</h3>
                      <p className="stat-number">{inventoryStats.byBreedingStatus.breeding}</p>
                      <p className="percentage">{((inventoryStats.byBreedingStatus.breeding / inventoryStats.total) * 100).toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="stat-card breeding-inactive">
                    <div className="stat-icon">✗</div>
                    <div className="stat-content">
                      <h3>Non-Breeding</h3>
                      <p className="stat-number">{inventoryStats.byBreedingStatus['non-breeding']}</p>
                      <p className="percentage">{((inventoryStats.byBreedingStatus['non-breeding'] / inventoryStats.total) * 100).toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="stat-card breeding-retired">
                    <div className="stat-icon">⏸</div>
                    <div className="stat-content">
                      <h3>Retired</h3>
                      <p className="stat-number">{inventoryStats.byBreedingStatus.retired}</p>
                      <p className="percentage">{((inventoryStats.byBreedingStatus.retired / inventoryStats.total) * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="summary-section">
                <h2>Summary</h2>
                <div className="summary-info">
                  <div className="summary-item">
                    <span className="label">Average Breeding Efficiency:</span>
                    <span className="value">{((inventoryStats.byBreedingStatus.breeding / inventoryStats.total) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Health Wellness Score:</span>
                    <span className="value">{((inventoryStats.byHealthStatus.healthy / inventoryStats.total) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Population Composition:</span>
                    <span className="value">{inventoryStats.byAgeGroup.adults} adults, {inventoryStats.byAgeGroup.yearlings} yearlings, {inventoryStats.byAgeGroup.kids} kids</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* VACCINATIONS TAB */}
      {activeTab === 'vaccinations' && (
        <div className="tab-content vaccinations-content">
          <div className="vaccinations-header">
            <h2>🐐 Vaccinations Management</h2>
            <div className="vacc-action-buttons">
              {!isOwner && <button className="btn btn-primary" onClick={() => setShowVaccineForm(true)}>+ New Vaccine</button>}
              {!isOwner && <button className="btn btn-primary" onClick={() => setShowVaccForm(true)}>+ Vaccinate Goat</button>}
            </div>
          </div>

          {/* Add New Vaccine Modal */}
          {showVaccineForm && (
            <div className="modal-overlay" onClick={() => setShowVaccineForm(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>Add New Vaccine</h2>
                  <button className="close-btn" onClick={() => setShowVaccineForm(false)}>×</button>
                </div>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    await createVaccine(vaccineForm);
                    setSuccess('Vaccine added successfully');
                    setShowVaccineForm(false);
                    setVaccineForm({ name: '', description: '', manufacturer: '', disease_protection: '', dosage: '' });
                    fetchAllData();
                  } catch (err) {
                    setError(err.response?.data?.error || 'Failed to add vaccine');
                  }
                }}>
                  <div className="form-group">
                    <label>Vaccine Name *</label>
                    <input type="text" placeholder="e.g., FMD Vaccine" value={vaccineForm.name} onChange={(e) => setVaccineForm({...vaccineForm, name: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Disease Protection *</label>
                    <input type="text" placeholder="e.g., Foot and Mouth Disease" value={vaccineForm.disease_protection} onChange={(e) => setVaccineForm({...vaccineForm, disease_protection: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Manufacturer</label>
                    <input type="text" placeholder="Manufacturer name" value={vaccineForm.manufacturer} onChange={(e) => setVaccineForm({...vaccineForm, manufacturer: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Dosage</label>
                    <input type="text" placeholder="e.g., 2ml" value={vaccineForm.dosage} onChange={(e) => setVaccineForm({...vaccineForm, dosage: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea placeholder="Vaccine description" value={vaccineForm.description} onChange={(e) => setVaccineForm({...vaccineForm, description: e.target.value})} rows="3" />
                  </div>
                  <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowVaccineForm(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Add Vaccine</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Vaccinate Goat Modal */}
          {showVaccForm && (
            <div className="modal-overlay" onClick={() => setShowVaccForm(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>Record Vaccination</h2>
                  <button className="close-btn" onClick={() => setShowVaccForm(false)}>×</button>
                </div>
                <form onSubmit={handleAddVaccination}>
                  <div className="form-group">
                    <label>Select Goat *</label>
                    <select value={vaccForm.goat_id} onChange={(e) => setVaccForm({...vaccForm, goat_id: e.target.value})} required>
                      <option value="">Choose a goat...</option>
                      {goats.map(g => <option key={g.id} value={g.id}>#{g.tag_number}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Select Vaccine *</label>
                    <select value={vaccForm.vaccine_id} onChange={(e) => setVaccForm({...vaccForm, vaccine_id: e.target.value})} required>
                      <option value="">Choose a vaccine...</option>
                      {vaccines.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                    </select>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Vaccination Date *</label>
                      <input type="date" value={vaccForm.vaccination_date} onChange={(e) => setVaccForm({...vaccForm, vaccination_date: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label>Next Due Date</label>
                      <input type="date" value={vaccForm.next_due_date} onChange={(e) => setVaccForm({...vaccForm, next_due_date: e.target.value})} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Batch Number</label>
                      <input type="text" value={vaccForm.batch_number} onChange={(e) => setVaccForm({...vaccForm, batch_number: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>Veterinarian</label>
                      <input type="text" value={vaccForm.veterinarian_name} onChange={(e) => setVaccForm({...vaccForm, veterinarian_name: e.target.value})} />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowVaccForm(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Record Vaccination</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Vaccinations List */}
          <div className="vaccinations-section">
            <h3>Recent Vaccinations</h3>
            {vaccinations && vaccinations.length > 0 ? (
              <div className="vaccinations-list">
                {vaccinations.map(vacc => (
                  <div key={vacc.id} className="vaccination-card">
                    <div className="vacc-info">
                      <p><strong>Goat:</strong> #{vacc.goat_id}</p>
                      <p><strong>Vaccine:</strong> {vacc.vaccine_id}</p>
                      <p><strong>Date:</strong> {vacc.vaccination_date}</p>
                      <p><strong>Next Due:</strong> {vacc.next_due_date || 'N/A'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No vaccinations recorded yet</p>
            )}
          </div>

          {/* Vaccines List */}
          <div className="vaccines-section">
            <h3>Available Vaccines</h3>
            {vaccines && vaccines.length > 0 ? (
              <div className="vaccines-grid">
                {vaccines.map(vaccine => (
                  <div key={vaccine.id} className="vaccine-card">
                    <div className="vaccine-icon">💉</div>
                    <div className="vaccine-details">
                      <h4>{vaccine.name}</h4>
                      <p><strong>Protection:</strong> {vaccine.disease_protection}</p>
                      <p><strong>Manufacturer:</strong> {vaccine.manufacturer || 'N/A'}</p>
                      <p><strong>Dosage:</strong> {vaccine.dosage || 'N/A'}</p>
                      {vaccine.description && <p><strong>Description:</strong> {vaccine.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No vaccines available. Create one to get started.</p>
            )}
          </div>
        </div>
      )}

      {/* DELIVERY TAB */}
      {activeTab === 'delivery' && (
        <div className="tab-content delivery-content">
          <div className="delivery-header">
            <h2>🐣 Pregnancy Delivery</h2>
            <p className="header-subtitle">Record delivery of baby goats from pregnant mothers</p>
          </div>

          <div className="pregnant-goats-list">
            <h3>Pregnant Goats Ready for Delivery</h3>
            {goats.filter(g => g.health_status === 'pregnant' && !g.is_sold && !g.is_dead).length > 0 ? (
              <div className="pregnant-cards">
                {goats.filter(g => g.health_status === 'pregnant' && !g.is_sold && !g.is_dead).map(goat => (
                  <div key={goat.id} className="pregnant-card">
                    <div className="pregnant-card-info">
                      <div className="pregnant-card-tag">#{goat.tag_number}</div>
                      <div className="pregnant-card-details">
                        <div className="detail-item">
                          <span className="detail-label">Gender</span>
                          <span className="detail-value">
                            {goat.gender === 'female' ? '♀' : '♂'} {goat.gender}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Breed</span>
                          <span className="detail-value">{goat.breed || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Date of Birth</span>
                          <span className="detail-value">{goat.date_of_birth}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Location</span>
                          <span className="detail-value">{goat.location || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="pregnant-card-actions">
                      <button 
                        className="btn-delivery" 
                        onClick={() => handleOpenDeliveryModal(goat)}
                      >
                        🐣 Record Delivery
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-pregnancy">
                <div className="empty-pregnancy-icon">🐑</div>
                <h3>No Pregnant Goats</h3>
                <p>There are currently no pregnant goats ready for delivery</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FAMILY TREE TAB */}
      {activeTab === 'family-tree' && (
        <div className="tab-content family-tree-content">
          <div className="family-tree-header">
            <h2>👨‍👩‍👧‍👦 Family Tree Lineage</h2>
            <p className="header-subtitle">Trace the ancestry and descendants of your goats</p>
          </div>

          <div className="family-tree-selector">
            <div className="selector-inner">
              <label htmlFor="goat-select">📌 Select a Goat to View Family:</label>
              <select 
                id="goat-select"
                onChange={(e) => {
                  if (e.target.value) {
                    handleGetFamilyData(e.target.value);
                  } else {
                    setFamilyData(null);
                  }
                }} 
                className="goat-selector"
              >
                <option value="">-- Choose a goat --</option>
                {allGoatsForTree.map(g => (
                  <option key={g.id} value={g.id}>
                    #{g.tag_number} {g.breed ? `(${g.breed})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loadingFamily && (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading family tree...</p>
            </div>
          )}

          {familyData ? (
            <div className="family-tree-grid">
              {/* Mother Section */}
              <div className="tree-card mother-card">
                <div className="card-header">
                  <span className="card-title">👩 Mother (Dam)</span>
                </div>
                {familyData.parents && familyData.parents.length > 0 ? (
                  <div className="parent-items">
                    {familyData.parents.map(p => (
                      <div key={p.id} className="parent-item">
                        <div className="parent-gender">{p.gender === 'male' ? '♂' : '♀'}</div>
                        <div className="parent-info">
                          <div className="parent-tag">#{p.tag_number}</div>
                          <div className="parent-breed">{p.breed || 'Unknown breed'}</div>
                          <div className="parent-dob">{p.date_of_birth}</div>
                        </div>
                        <button 
                          className="parent-view-btn" 
                          onClick={() => handleGetFamilyData(p.id)}
                          title="View this goat's family tree"
                        >
                          →
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-parent">
                    <span className="no-data-icon">❌</span>
                    <p>No mother information</p>
                  </div>
                )}
              </div>

              {/* Selected Goat Section - Center */}
              <div className="tree-card selected-card">
                <div className="card-header">
                  <span className="card-title">📍 Selected Goat</span>
                </div>
                <div className="selected-goat">
                  <div className="selected-gender-icon">{familyData.root.gender === 'male' ? '♂' : '♀'}</div>
                  <div className="selected-info">
                    <h3 className="selected-tag">#{familyData.root.tag_number}</h3>
                    <p className="selected-breed">{familyData.root.breed || 'Breed: Unknown'}</p>
                    <p className="selected-dob">DOB: {familyData.root.date_of_birth}</p>
                    <p className="selected-status">
                      {familyData.root.health_status && (
                        <span className={`status-pill health-${familyData.root.health_status}`}>
                          {familyData.root.health_status}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Children Section */}
              <div className="tree-card children-card">
                <div className="card-header">
                  <span className="card-title">👶 Children (Descendants)</span>
                </div>
                {familyData.children && familyData.children.length > 0 ? (
                  <div className="children-items">
                    {familyData.children.map(child => (
                      <div key={child.id} className="child-item">
                        <div className="child-gender">{child.gender === 'male' ? '♂' : '♀'}</div>
                        <div className="child-info">
                          <div className="child-tag">#{child.tag_number}</div>
                          <div className="child-breed">{child.breed || 'Unknown breed'}</div>
                          <div className="child-dob">{child.date_of_birth}</div>
                        </div>
                        <button 
                          className="child-view-btn" 
                          onClick={() => handleGetFamilyData(child.id)}
                          title="View this goat's family tree"
                        >
                          →
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-children">
                    <span className="no-data-icon">🤷</span>
                    <p>No offspring recorded</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="family-tree-empty">
              <div className="empty-container">
                <div className="empty-icon">🌳</div>
                <h3>No Family Data</h3>
                <p>Select a goat from the dropdown above to view their family tree</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delivery Modal */}
      {showDeliveryModal && selectedGoatForDelivery && (
        <div className="modal-overlay">
          <div className="modal-content delivery-modal">
            <div className="modal-header">
              <h2>🐣 Record Delivery</h2>
              <button className="modal-close" onClick={handleCloseDeliveryModal}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="mother-info">
                <h3>Mother: {selectedGoatForDelivery.tag_number}</h3>
                <p className="info-detail">
                  <strong>Breed:</strong> {selectedGoatForDelivery.breed || 'N/A'}
                </p>
                <p className="info-detail">
                  <strong>Color:</strong> {selectedGoatForDelivery.color || 'N/A'}
                </p>
              </div>

              <div className="delivery-form">
                <h3>Baby Goat Information</h3>
                
                <div className="form-group">
                  <label htmlFor="baby-tag">
                    Tag Number <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="baby-tag"
                    name="tag_number"
                    value={deliveryFormData.tag_number}
                    onChange={handleDeliveryInputChange}
                    placeholder="e.g., BABY-001"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="baby-gender">
                    Gender <span className="required">*</span>
                  </label>
                  <select
                    id="baby-gender"
                    name="gender"
                    value={deliveryFormData.gender}
                    onChange={handleDeliveryInputChange}
                    className="form-input"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">♂ Male</option>
                    <option value="female">♀ Female</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="baby-breed">Breed</label>
                  <input
                    type="text"
                    id="baby-breed"
                    name="breed"
                    value={deliveryFormData.breed}
                    onChange={handleDeliveryInputChange}
                    placeholder="Leave blank to inherit from mother"
                    className="form-input"
                  />
                  <small className="form-hint">Inherits from mother if left empty</small>
                </div>

                <div className="form-group">
                  <label htmlFor="baby-color">Color</label>
                  <input
                    type="text"
                    id="baby-color"
                    name="color"
                    value={deliveryFormData.color}
                    onChange={handleDeliveryInputChange}
                    placeholder="Leave blank to inherit from mother"
                    className="form-input"
                  />
                  <small className="form-hint">Inherits from mother if left empty</small>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={handleCloseDeliveryModal}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleRecordDelivery}
                disabled={!deliveryFormData.tag_number || !deliveryFormData.gender}
              >
                Record Delivery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GoatManagement;
