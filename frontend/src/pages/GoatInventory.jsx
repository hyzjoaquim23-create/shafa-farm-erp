import React, { useState, useEffect } from 'react';
import apiClient from '../api';
import './GoatInventory.css';

function GoatInventory() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInventoryStats();
  }, []);

  const fetchInventoryStats = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/goats/stats/inventory');
      setStats(response.data.stats);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch inventory stats');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="inventory-loading">Loading inventory data...</div>;
  }

  if (error) {
    return <div className="error-alert">{error}</div>;
  }

  if (!stats) {
    return <div className="error-alert">No inventory data available</div>;
  }

  return (
    <div className="goat-inventory">
      <div className="inventory-header">
        <h1>Goat Inventory Dashboard</h1>
        <p className="subtitle">Total Goats: <strong>{stats.total}</strong></p>
      </div>

      {/* Main Stats */}
      <div className="stats-grid">
        <div className="stat-card total-card">
          <div className="stat-icon">🐐</div>
          <div className="stat-content">
            <h3>Total Goats</h3>
            <p className="stat-number">{stats.total}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">♂</div>
          <div className="stat-content">
            <h3>Male</h3>
            <p className="stat-number">{stats.byGender.male}</p>
            <p className="percentage">{((stats.byGender.male / stats.total) * 100).toFixed(1)}%</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">♀</div>
          <div className="stat-content">
            <h3>Female</h3>
            <p className="stat-number">{stats.byGender.female}</p>
            <p className="percentage">{((stats.byGender.female / stats.total) * 100).toFixed(1)}%</p>
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
              <p className="stat-number">{stats.byAgeGroup.kids}</p>
              <div className="sub-stats">
                <span>♂ {stats.byAgeGroupMale.kids}</span>
                <span>♀ {stats.byAgeGroupFemale.kids}</span>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🐑</div>
            <div className="stat-content">
              <h3>Yearlings (12-24 months)</h3>
              <p className="stat-number">{stats.byAgeGroup.yearlings}</p>
              <div className="sub-stats">
                <span>♂ {stats.byAgeGroupMale.yearlings}</span>
                <span>♀ {stats.byAgeGroupFemale.yearlings}</span>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🐐</div>
            <div className="stat-content">
              <h3>Adults (24+ months)</h3>
              <p className="stat-number">{stats.byAgeGroup.adults}</p>
              <div className="sub-stats">
                <span>♂ {stats.byAgeGroupMale.adults}</span>
                <span>♀ {stats.byAgeGroupFemale.adults}</span>
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
              <p className="stat-number">{stats.byHealthStatus.healthy}</p>
              <p className="percentage">{((stats.byHealthStatus.healthy / stats.total) * 100).toFixed(1)}%</p>
            </div>
          </div>

          <div className="stat-card health-sick">
            <div className="stat-icon">⚠</div>
            <div className="stat-content">
              <h3>Sick</h3>
              <p className="stat-number">{stats.byHealthStatus.sick}</p>
              <p className="percentage">{((stats.byHealthStatus.sick / stats.total) * 100).toFixed(1)}%</p>
            </div>
          </div>

          <div className="stat-card health-pregnant">
            <div className="stat-icon">🤰</div>
            <div className="stat-content">
              <h3>Pregnant</h3>
              <p className="stat-number">{stats.byHealthStatus.pregnant}</p>
              <p className="percentage">{((stats.byHealthStatus.pregnant / stats.total) * 100).toFixed(1)}%</p>
            </div>
          </div>

          <div className="stat-card health-injured">
            <div className="stat-icon">🩹</div>
            <div className="stat-content">
              <h3>Injured</h3>
              <p className="stat-number">{stats.byHealthStatus.injured}</p>
              <p className="percentage">{((stats.byHealthStatus.injured / stats.total) * 100).toFixed(1)}%</p>
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
              <p className="stat-number">{stats.byBreedingStatus.breeding}</p>
              <p className="percentage">{((stats.byBreedingStatus.breeding / stats.total) * 100).toFixed(1)}%</p>
            </div>
          </div>

          <div className="stat-card breeding-inactive">
            <div className="stat-icon">✗</div>
            <div className="stat-content">
              <h3>Non-Breeding</h3>
              <p className="stat-number">{stats.byBreedingStatus['non-breeding']}</p>
              <p className="percentage">{((stats.byBreedingStatus['non-breeding'] / stats.total) * 100).toFixed(1)}%</p>
            </div>
          </div>

          <div className="stat-card breeding-retired">
            <div className="stat-icon">⏸</div>
            <div className="stat-content">
              <h3>Retired</h3>
              <p className="stat-number">{stats.byBreedingStatus.retired}</p>
              <p className="percentage">{((stats.byBreedingStatus.retired / stats.total) * 100).toFixed(1)}%</p>
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
            <span className="value">{((stats.byBreedingStatus.breeding / stats.total) * 100).toFixed(1)}%</span>
          </div>
          <div className="summary-item">
            <span className="label">Health Wellness Score:</span>
            <span className="value">{((stats.byHealthStatus.healthy / stats.total) * 100).toFixed(1)}%</span>
          </div>
          <div className="summary-item">
            <span className="label">Population Composition:</span>
            <span className="value">{stats.byAgeGroup.adults} adults, {stats.byAgeGroup.yearlings} yearlings, {stats.byAgeGroup.kids} kids</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GoatInventory;
