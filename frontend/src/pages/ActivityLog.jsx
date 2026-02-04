import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../api';
import './ActivityLog.css';

function ActivityLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterEntity, setFilterEntity] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [stats, setStats] = useState([]);
  

  const fetchActivityLog = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (filterAction !== 'all') params.append('action', filterAction);
      if (filterEntity !== 'all') params.append('entityType', filterEntity);
      params.append('page', currentPage);
      params.append('limit', 25);

      const response = await apiClient.get(`/activity-log?${params.toString()}`);
      setLogs(response.data.logs || response.data || []);
      setPagination(response.data.pagination || { page: 1, totalPages: 1 });
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch activity logs');
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, filterAction, filterEntity, currentPage]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await apiClient.get('/activity-log/stats/summary');
      setStats(response.data.stats || []);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  const handleExportPDF = async () => {
    try {
      const params = new URLSearchParams();
      
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (filterAction !== 'all') params.append('action', filterAction);
      if (filterEntity !== 'all') params.append('entityType', filterEntity);

      const response = await apiClient.get(`/activity-log/export?${params.toString()}`);
      // Generate CSV (API may return an array or a wrapper)
      const logsData = response.data.logs || response.data || [];
      const csvContent = generateCSV(logsData);
      const fileName = `activity-log-${new Date().toISOString().split('T')[0]}.csv`;
      downloadFile(csvContent, fileName, 'text/csv');
    } catch (err) {
      setError('Failed to export data');
      console.error('Error exporting:', err);
    }
  };

  const generateCSV = (logsData) => {
    const headers = ['ID', 'Timestamp', 'User Name', 'User Email', 'Action', 'Entity Type', 'Entity ID', 'Description'];
    const rows = logsData.map(log => [
      log.id,
      log.timestamp,
      log.user_name || 'System',
      log.user_email || 'N/A',
      log.action,
      log.entity_type,
      log.entity_id,
      log.description || (log.old_value || log.new_value ? 'Modified' : 'N/A')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => 
        row.map(cell => 
          typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))
            ? `"${cell.replace(/"/g, '""')}"` 
            : cell
        ).join(',')
      )
    ].join('\n');

    return csvContent;
  };

  const downloadFile = (content, fileName, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleResetFilters = () => {
    setStartDate('');
    setEndDate('');
    setFilterAction('all');
    setFilterEntity('all');
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchActivityLog();
    fetchStats();
  }, [fetchActivityLog, fetchStats]);

  const getActionBadgeClass = (action) => {
    const classes = {
      create: 'badge-create',
      update: 'badge-update',
      delete: 'badge-delete'
    };
    return classes[action] || 'badge-default';
  };

  const getEntityBadgeClass = (entity) => {
    const classes = {
      user: 'badge-user',
      goat: 'badge-goat'
    };
    return classes[entity] || 'badge-default';
  };

  if (loading && logs.length === 0) {
    return <div className="activity-log-loading">Loading activity logs...</div>;
  }

  return (
    <div className="activity-log-container">
      <div className="activity-log-header">
        <h1>Activity Log</h1>
        <p className="subtitle">Monitor user activities and system changes</p>
      </div>

      {error && <div className="error-alert">{error}</div>}

      {/* Statistics Section */}
      <div className="activity-stats-section">
        <h3>Activity Summary</h3>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-value">{stat.count}</div>
              <div className="stat-label">{stat.action} on {stat.entity_type}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Section */}
      <div className="filters-section">
        <div className="filter-row">
          <div className="filter-group">
            <label>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>Action</label>
            <select
              value={filterAction}
              onChange={(e) => {
                setFilterAction(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              <option value="all">All Actions</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Entity Type</label>
            <select
              value={filterEntity}
              onChange={(e) => {
                setFilterEntity(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              <option value="all">All Entities</option>
              <option value="user">User</option>
              <option value="goat">Goat</option>
            </select>
          </div>

          <div className="filter-buttons">
            <button onClick={handleResetFilters} className="btn-reset">
              Reset Filters
            </button>
            <button onClick={handleExportPDF} className="btn-export">
              📥 Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Activity Log Table */}
      <div className="activity-log-table-container">
        {logs.length === 0 ? (
          <div className="no-logs">
            <p>No activity logs found</p>
          </div>
        ) : (
          <table className="activity-log-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Timestamp</th>
                <th>User</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Entity ID</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="log-row">
                  <td className="log-id">{log.id}</td>
                  <td className="log-timestamp">
                    {log.timestamp ? new Date(log.timestamp).toLocaleString() : '—'}
                  </td>
                  <td className="log-user">
                    <div className="user-info">
                      <strong>{log.user_name || 'System'}</strong>
                      <small>{log.user_email || 'N/A'}</small>
                    </div>
                  </td>
                  <td className="log-action">
                    <span className={`badge ${getActionBadgeClass(log.action)}`}>
                      {(log.action || '').toUpperCase()}
                    </span>
                  </td>
                  <td className="log-entity">
                    <span className={`badge ${getEntityBadgeClass(log.entity_type)}`}>
                      {(log.entity_type || '').toUpperCase()}
                    </span>
                  </td>
                  <td className="log-entity-id">{log.entity_id}</td>
                  <td className="log-description">
                    {log.description || (log.old_value || log.new_value ? 'Modified' : 'N/A')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="btn-pagination"
          >
            ← Previous
          </button>
          <span className="page-info">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
            disabled={currentPage === pagination.totalPages}
            className="btn-pagination"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default ActivityLog;
