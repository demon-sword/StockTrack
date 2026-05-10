import React, { useState, useEffect } from 'react';

const Reports = () => {
  const [currentStock, setCurrentStock] = useState(null);
  const [pendingJobs, setPendingJobs] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const [stock, jobs] = await Promise.all([
        window.electronAPI.reports.getStock(),
        window.electronAPI.reports.getPendingJobs()
      ]);
      setCurrentStock(stock);
      setPendingJobs(jobs);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading reports...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Reports</h1>
      </div>

      <div className="grid grid-3">
        <div className="stats-card">
          <div className="stats-value">{currentStock?.rawMaterial?.length || 0}</div>
          <div className="stats-label">Raw Material Batches</div>
        </div>
        <div className="stats-card">
          <div className="stats-value">{currentStock?.semiFinished?.length || 0}</div>
          <div className="stats-label">Semi-Finished Batches</div>
        </div>
        <div className="stats-card">
          <div className="stats-value">{currentStock?.finishedGoods?.length || 0}</div>
          <div className="stats-label">Finished Goods Batches</div>
        </div>
      </div>

      <div className="grid grid-2 mt-4">
        <div className="card">
          <h3 className="card-title">Pending Jobs</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <strong>Job Work:</strong> {pendingJobs?.pendingJobWork?.count || 0} orders ({pendingJobs?.pendingJobWork?.total_kg || 0} kg)
            </div>
            <div>
              <strong>Polishing:</strong> {pendingJobs?.pendingPolishing?.count || 0} orders ({pendingJobs?.pendingPolishing?.total_pieces || 0} pieces)
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Export Data</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={() => {
              window.electronAPI.reports.exportAll().then(data => {
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `stocktrack-backup-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
              });
            }}>Export All Data (JSON)</button>
            <button className="btn btn-secondary" onClick={() => {
              alert('Import functionality coming soon');
            }}>Import Data</button>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <h3 className="card-title">Report Types (Coming Soon)</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '8px 0', borderBottom: '1px solid #e1e5eb' }}>Current Stock Report</li>
          <li style={{ padding: '8px 0', borderBottom: '1px solid #e1e5eb' }}>Material Movement History</li>
          <li style={{ padding: '8px 0', borderBottom: '1px solid #e1e5eb' }}>Batch Traceability Report</li>
          <li style={{ padding: '8px 0', borderBottom: '1px solid #e1e5eb' }}>Pending Jobs Report</li>
          <li style={{ padding: '8px 0', borderBottom: '1px solid #e1e5eb' }}>Worker Summary Report</li>
          <li style={{ padding: '8px 0' }}>Sales Report (Date Range)</li>
        </ul>
      </div>
    </div>
  );
};

export default Reports;