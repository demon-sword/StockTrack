import React from 'react';

const Settings = () => {
  const handleExport = async () => {
    try {
      const data = await window.electronAPI.reports.exportAll();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `stocktrack-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      alert('Data exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting data');
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const data = JSON.parse(event.target.result);
            // Import logic here
            alert('Import functionality coming soon!');
          } catch (error) {
            alert('Invalid JSON file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearDatabase = () => {
    if (window.confirm('Are you sure? This will delete ALL data permanently!')) {
      // Clear database logic
      alert('Clear database functionality coming soon!');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Settings</h1>
      </div>

      <div className="card">
        <h3 className="card-title">Data Management</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ color: '#666', marginBottom: '16px' }}>
            Backup your data regularly to avoid data loss. You can export all data and import it later if needed.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-primary" onClick={handleExport}>
              Export Data (JSON)
            </button>
            <button className="btn btn-secondary" onClick={handleImport}>
              Import Data
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title" style={{ color: '#ef4444' }}>Danger Zone</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ color: '#666', marginBottom: '16px' }}>
            Clearing the database will remove all your data permanently. This action cannot be undone.
          </p>
          <button className="btn btn-danger" onClick={handleClearDatabase}>
            Clear All Data
          </button>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">About</h3>
        <div>
          <p><strong>StockTrack</strong></p>
          <p style={{ color: '#666' }}>Version 1.0.0</p>
          <p style={{ color: '#666', marginTop: '8px' }}>
            Inventory tracking application for material business
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;