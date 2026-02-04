import React, { useState, useEffect, useRef } from 'react';
import { getGoats, getDashboardData } from '../api';
import './Reports.css';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend } from 'chart.js';
import { Pie, Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend);

function Reports() {
  const [activeCategory, setActiveCategory] = useState('goats');
  const [activeReport, setActiveReport] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [goats, setGoats] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [inventoryFilter, setInventoryFilter] = useState('active');
  const [inventorySearch, setInventorySearch] = useState('');
  const reportRef = useRef();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const [, goatsRes] = await Promise.all([
        getDashboardData(),
        getGoats()
      ]);
      setGoats(goatsRes.data.goats || []);
      
      const vaccRes = await fetch('http://192.168.43.229:5000/api/vaccinations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (vaccRes.ok) {
        const vaccData = await vaccRes.json();
        setVaccinations(vaccData.vaccinations || []);
      }

      const expRes = await fetch('http://192.168.43.229:5000/api/expenses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (expRes.ok) {
        const expData = await expRes.json();
        setExpenses(expData.expenses || []);
      }

      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const downloadExcelHerdInventory = () => {
    let csv = 'ID,Name,Tag Number,Gender,Date of Birth,Breed,Health Status,Weight\n';
    const rows = goats.filter(g => {
      if (inventoryFilter === 'active') {
        if (g.is_sold || g.is_dead) return false;
      } else if (inventoryFilter === 'sold') {
        if (!g.is_sold) return false;
      } else if (inventoryFilter === 'dead') {
        if (!g.is_dead) return false;
      }
      const s = inventorySearch.trim().toLowerCase();
      if (!s) return true;
      return String(g.id).includes(s) || (g.name || '').toLowerCase().includes(s) || (g.tag_number || '').toLowerCase().includes(s) || (g.breed || '').toLowerCase().includes(s);
    });
    rows.forEach(g => {
      csv += `${g.id},"${g.name}","${g.tag_number}","${g.gender}","${g.date_of_birth}","${g.breed || ''}","${g.health_status || 'Unknown'}","${g.weight || ''}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Shafa-Farm-Herd-Inventory-${new Date().toLocaleDateString()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const computeGenderBreakdown = () => {
    const counts = { does: 0, bucks: 0, kids: 0 };
    const now = new Date();
    goats.forEach(g => {
      const dob = g.date_of_birth ? new Date(g.date_of_birth) : null;
      const ageYears = dob ? (now - dob) / (1000 * 60 * 60 * 24 * 365.25) : 2;
      if (ageYears < 1) counts.kids += 1;
      else if (g.gender === 'male') counts.bucks += 1;
      else counts.does += 1;
    });
    return counts;
  };

  const computeBreedDistribution = () => {
    const counts = {};
    goats.forEach(g => {
      const breed = g.breed || 'Unknown';
      counts[breed] = (counts[breed] || 0) + 1;
    });
    return counts;
  };

  const computeHealthStatusBreakdown = () => {
    const counts = { healthy: 0, sick: 0, unknown: 0 };
    goats.forEach(g => {
      const status = (g.health_status || 'unknown').toLowerCase();
      if (status === 'healthy') counts.healthy += 1;
      else if (status === 'sick') counts.sick += 1;
      else counts.unknown += 1;
    });
    return counts;
  };

  const computeExpensesByMonth = (months = 6) => {
    const map = {};
    const now = new Date();
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      map[key] = 0;
    }
    expenses.forEach(e => {
      if (!e.date) return;
      const d = new Date(e.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (key in map) map[key] += Number(e.amount || 0);
    });
    return map;
  };

  const computeTotalExpenses = () => {
    let total = 0;
    expenses.forEach(e => {
      total += Number(e.amount || 0);
    });
    return total;
  };

  const computeVaccinationsOverTime = (months = 6) => {
    const map = {};
    const now = new Date();
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      map[key] = 0;
    }
    vaccinations.forEach(v => {
      if (!v.vaccination_date) return;
      const d = new Date(v.vaccination_date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (key in map) map[key] += 1;
    });
    return map;
  };


  const filteredGoats = () => {
    return goats.filter(g => {
      if (inventoryFilter === 'active') {
        if (g.is_sold || g.is_dead) return false;
      } else if (inventoryFilter === 'sold') {
        if (!g.is_sold) return false;
      } else if (inventoryFilter === 'dead') {
        if (!g.is_dead) return false;
      }
      const s = inventorySearch.trim().toLowerCase();
      if (!s) return true;
      return String(g.id).includes(s) || (g.name || '').toLowerCase().includes(s) || (g.tag_number || '').toLowerCase().includes(s) || (g.breed || '').toLowerCase().includes(s);
    });
  };

  const totalCount = () => goats.length;
  const totalActive = () => goats.filter(g => !g.is_sold && !g.is_dead).length;
  const totalSold = () => goats.filter(g => g.is_sold).length;
  const totalDead = () => goats.filter(g => g.is_dead).length;
  const getSoldGoats = () => goats.filter(g => g.is_sold);

  if (loading) return <div className="reports-loading">Loading reports...</div>;

  return (
    <div className="reports-page">
      <div className="reports-header">
        <h1>📊 Farm Reports & Analytics</h1>
      </div>

      {error && <div className="error-alert">{error}</div>}

      <div className="category-nav">
        <button 
          className={`category-btn ${activeCategory === 'goats' ? 'active' : 'disabled'}`}
          onClick={() => {setActiveCategory('goats'); setActiveReport('overview');}}
        >
          🐐 Goats <span className="category-status">Active</span>
        </button>
        <button 
          className="category-btn disabled"
          title="Coming soon"
          onClick={() => alert('Chicken reports coming soon!')}
        >
          🐔 Chicken <span className="category-status">Coming Soon</span>
        </button>
        <button 
          className="category-btn disabled"
          title="Coming soon"
          onClick={() => alert('Crops reports coming soon!')}
        >
          🌾 Crops <span className="category-status">Coming Soon</span>
        </button>
      </div>

      {activeCategory === 'goats' && (
        <div className="reports-container">
          <aside className="reports-sidebar">
            <h3>📋 Goat Reports</h3>
            <div className="report-buttons">
              <button 
                className={`report-btn ${activeReport === 'overview' ? 'active' : ''}`} 
                onClick={() => setActiveReport('overview')}
              >
                📈 Overall Performance
              </button>
              <button 
                className={`report-btn ${activeReport === 'inventory' ? 'active' : ''}`} 
                onClick={() => setActiveReport('inventory')}
              >
                📋 Herd Inventory
              </button>
              <button 
                className={`report-btn ${activeReport === 'genetic' ? 'active' : ''}`} 
                onClick={() => setActiveReport('genetic')}
              >
                🧬 Genetic / Pedigree
              </button>
              <button 
                className={`report-btn ${activeReport === 'dead' ? 'active' : ''}`} 
                onClick={() => setActiveReport('dead')}
              >
                ⚰️ Dead Goats
              </button>
              <button 
                className={`report-btn ${activeReport === 'sold' ? 'active' : ''}`} 
                onClick={() => setActiveReport('sold')}
              >
                💰 Sold Goats
              </button>
            </div>
          </aside>

          <div className="report-content" ref={reportRef}>
            <section className="report-summary">
              <div className="summary-grid">
                <div className="summary-card">
                  <h3>Total goats in stock</h3>
                  <p>{totalActive()}</p>
                </div>
                <div className="summary-card">
                  <h3>💉 Vaccinations</h3>
                  <p>{vaccinations.length}</p>
                </div>
                <div className="summary-card">
                  <h3>💵 Total Expenses</h3>
                  <p className="amount-negative">-K {computeTotalExpenses().toLocaleString('en-US', {minimumFractionDigits:2})}</p>
                </div>
                <div className="summary-card">
                  <h3>💰 Sold Goats</h3>
                  <p>{getSoldGoats().length}</p>
                </div>
              </div>
            </section>

            {activeReport === 'overview' && (
              <section className="report-section">
                <h2>📈 Overall Herd Performance</h2>
                <p className="section-subtitle">Visual insights into your goat farm operations</p>
                
                <div className="charts-grid">
                  <div className="chart-card">
                    <h4>🐐 Herd Composition</h4>
                    <Pie 
                      data={{
                        labels: ['Does (Females)', 'Bucks (Males)', 'Kids (Young)'],
                        datasets: [{
                          data: Object.values(computeGenderBreakdown()),
                          backgroundColor: ['#e74c3c', '#3498db', '#f39c12'],
                          borderColor: '#fff',
                          borderWidth: 2
                        }]
                      }}
                      options={{ maintainAspectRatio: true }}
                    />
                  </div>

                  <div className="chart-card">
                    <h4>🏥 Health Status Distribution</h4>
                    <Doughnut 
                      data={{
                        labels: ['Healthy', 'Sick', 'Unknown'],
                        datasets: [{
                          data: Object.values(computeHealthStatusBreakdown()),
                          backgroundColor: ['#2ecc71', '#e74c3c', '#95a5a6'],
                          borderColor: '#fff',
                          borderWidth: 2
                        }]
                      }}
                      options={{ maintainAspectRatio: true }}
                    />
                  </div>

                  <div className="chart-card">
                    <h4>💰 Monthly Expenses Trend</h4>
                    <Line 
                      data={{
                        labels: Object.keys(computeExpensesByMonth()),
                        datasets: [{
                          label: 'Expenses (K)',
                          data: Object.values(computeExpensesByMonth()),
                          borderColor: '#e67e22',
                          backgroundColor: 'rgba(230, 126, 34, 0.1)',
                          fill: true,
                          tension: 0.4,
                          pointRadius: 5,
                          pointBackgroundColor: '#e67e22'
                        }]
                      }}
                      options={{ maintainAspectRatio: true }}
                    />
                  </div>

                  <div className="chart-card">
                    <h4>💉 Vaccination Trend</h4>
                    <Bar 
                      data={{
                        labels: Object.keys(computeVaccinationsOverTime()),
                        datasets: [{
                          label: 'Vaccinations',
                          data: Object.values(computeVaccinationsOverTime()),
                          backgroundColor: '#27ae60',
                          borderColor: '#229954',
                          borderWidth: 1
                        }]
                      }}
                      options={{ maintainAspectRatio: true }}
                    />
                  </div>

                  <div className="chart-card">
                    <h4>📊 Breed Distribution</h4>
                    <Pie 
                      data={{
                        labels: Object.keys(computeBreedDistribution()),
                        datasets: [{
                          data: Object.values(computeBreedDistribution()),
                          backgroundColor: ['#9b59b6', '#e74c3c', '#3498db', '#2ecc71', '#f39c12'],
                          borderColor: '#fff',
                          borderWidth: 2
                        }]
                      }}
                      options={{ maintainAspectRatio: true }}
                    />
                  </div>
                </div>
              </section>
            )}

            {activeReport === 'inventory' && (
              <section className="report-section">
                <div className="section-header">
                  <h2>📋 Herd Inventory Report</h2>
                  <div style={{display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap'}}>
                    <input placeholder="Search by id, name, tag or breed" value={inventorySearch} onChange={e => setInventorySearch(e.target.value)} style={{padding: '8px 10px', borderRadius: 6, border: '1px solid #ddd'}} />
                    <div style={{display: 'flex', gap: '6px'}}>
                      <button className={`btn ${inventoryFilter === 'active' ? 'btn-primary' : ''}`} onClick={() => setInventoryFilter('active')}>Active</button>
                      <button className={`btn ${inventoryFilter === 'sold' ? 'btn-primary' : ''}`} onClick={() => setInventoryFilter('sold')}>Sold</button>
                      <button className={`btn ${inventoryFilter === 'dead' ? 'btn-primary' : ''}`} onClick={() => setInventoryFilter('dead')}>Dead</button>
                      <button className={`btn ${inventoryFilter === 'all' ? 'btn-primary' : ''}`} onClick={() => setInventoryFilter('all')}>All</button>
                    </div>
                    <button className="btn btn-primary" onClick={downloadExcelHerdInventory}>📥 Export</button>
                  </div>
                </div>
                <p className="section-subtitle">Showing <strong>{filteredGoats().length}</strong> of <strong>{totalCount()}</strong> — Active: {totalActive()} • Sold: {totalSold()} • Dead: {totalDead()}</p>

                <div className="table-container">
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Tag #</th>
                        <th>Gender</th>
                        <th>DOB</th>
                        <th>Breed</th>
                        <th>Health</th>
                        <th>Weight</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGoats().length > 0 ? filteredGoats().map(g => (
                        <tr key={g.id} className={g.is_sold ? 'sold-row' : g.is_dead ? 'dead-row' : ''}>
                          <td><strong>#{g.id}</strong></td>
                          <td>{g.name}</td>
                          <td>{g.tag_number || '-'}</td>
                          <td>{g.gender === 'male' ? '♂' : '♀'}</td>
                          <td>{g.date_of_birth ? new Date(g.date_of_birth).toLocaleDateString() : '-'}</td>
                          <td>{g.breed || '-'}</td>
                          <td><span className={`status-badge ${(g.health_status || 'unknown').toLowerCase()}`}>{g.health_status || 'Unknown'}</span></td>
                          <td>{g.weight || '-'}</td>
                        </tr>
                      )) : (
                        <tr><td colSpan="8" style={{textAlign: 'center', padding: '20px'}}>No goats found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {activeReport === 'genetic' && (
              <section className="report-section">
                <h2>🧬 Genetic & Pedigree Analysis</h2>
                <div className="report-placeholder">
                  <div className="placeholder-icon">🧬</div>
                  <h3>Genetic & Pedigree Dashboard</h3>
                  <p>Comprehensive genetic analysis tools in development</p>
                </div>
              </section>
            )}

            {activeReport === 'dead' && (
              <section className="report-section">
                <h2>⚰️ Dead Goats Report</h2>
                {goats.filter(g => g.is_dead).length > 0 ? (
                  <div>
                    <div className="summary-grid">
                      <div className="summary-card">
                        <h3>⚰️ Total Dead</h3>
                        <p>{goats.filter(g => g.is_dead).length}</p>
                      </div>
                    </div>
                    <div className="table-container">
                      <table className="report-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Tag #</th>
                            <th>Gender</th>
                            <th>Breed</th>
                            <th>Date of Death</th>
                            <th>Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {goats.filter(g => g.is_dead).map(g => (
                            <tr key={g.id} className="dead-row">
                              <td><strong>#{g.id}</strong></td>
                              <td>{g.name}</td>
                              <td>{g.tag_number || '-'}</td>
                              <td>{g.gender === 'male' ? '♂' : '♀'}</td>
                              <td>{g.breed || '-'}</td>
                              <td>{g.date_of_death ? new Date(g.date_of_death).toLocaleDateString() : '-'}</td>
                              <td>{g.notes || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="report-placeholder">
                    <div className="placeholder-icon">⚰️</div>
                    <h3>No Dead Goats Found</h3>
                  </div>
                )}
              </section>
            )}

            {activeReport === 'sold' && (
              <section className="report-section">
                <h2>💰 Sold Goats Report</h2>
                {getSoldGoats().length > 0 ? (
                  <div>
                    <div className="summary-grid">
                      <div className="summary-card">
                        <h3>💰 Total Sold</h3>
                        <p>{getSoldGoats().length}</p>
                      </div>
                      <div className="summary-card">
                        <h3>📅 Revenue</h3>
                        <p>K {getSoldGoats().reduce((sum, g) => sum + (parseFloat(g.sold_price) || 0), 0).toLocaleString('en-US', {minimumFractionDigits:2})}</p>
                      </div>
                    </div>
                    <div className="table-container">
                      <table className="report-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Tag #</th>
                            <th>Gender</th>
                            <th>Breed</th>
                            <th>Date Sold</th>
                            <th>Price (K)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getSoldGoats().map(g => (
                            <tr key={g.id} className="sold-row">
                              <td><strong>#{g.id}</strong></td>
                              <td>{g.name}</td>
                              <td>{g.tag_number || '-'}</td>
                              <td>{g.gender === 'male' ? '♂' : '♀'}</td>
                              <td>{g.breed || '-'}</td>
                              <td>{g.date_sold ? new Date(g.date_sold).toLocaleDateString() : '-'}</td>
                              <td className="amount-cell"><strong>K {parseFloat(g.sold_price || 0).toLocaleString('en-US', {minimumFractionDigits:2})}</strong></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="report-placeholder">
                    <div className="placeholder-icon">💰</div>
                    <h3>No Sold Goats Found</h3>
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;
