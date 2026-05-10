import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    rawMaterial: [],
    jobWorkers: [],
    polishers: [],
    customers: [],
    pendingJobWork: 0,
    pendingPolishing: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [rawMaterial, jobWorkers, polishers, customers] = await Promise.all([
        window.electronAPI.rawMaterialInward.getAll(),
        window.electronAPI.jobWorkers.getAll(),
        window.electronAPI.polishers.getAll(),
        window.electronAPI.customers.getAll(),
      ]);

      setStats({
        rawMaterial: rawMaterial || [],
        jobWorkers: jobWorkers || [],
        polishers: polishers || [],
        customers: customers || [],
        pendingJobWork: 0,
        pendingPolishing: 0,
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="card">
          <h3>Error loading data</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>

      <div className="grid grid-4">
        <div className="stats-card">
          <div className="stats-value">{stats.rawMaterial.length}</div>
          <div className="stats-label">Raw Material Entries</div>
        </div>
        <div className="stats-card">
          <div className="stats-value">{stats.jobWorkers.length}</div>
          <div className="stats-label">Job Workers</div>
        </div>
        <div className="stats-card">
          <div className="stats-value">{stats.polishers.length}</div>
          <div className="stats-label">Polishers</div>
        </div>
        <div className="stats-card">
          <div className="stats-value">{stats.customers.length}</div>
          <div className="stats-label">Customers</div>
        </div>
      </div>

      <div className="grid grid-2 mt-4">
        <div className="card">
          <h3 className="card-title">Recent Raw Material</h3>
          {stats.rawMaterial.slice(0, 5).map((item) => (
            <div key={item.id} style={{ padding: '10px 0', borderBottom: '1px solid #e1e5eb' }}>
              <div><strong>{item.batch_number}</strong> - {item.weight_kg} kg</div>
              <div style={{ fontSize: '0.85rem', color: '#666' }}>{item.vendor_name}</div>
            </div>
          ))}
          {stats.rawMaterial.length === 0 && <p className="text-center">No data yet</p>}
        </div>

        <div className="card">
          <h3 className="card-title">Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button className="btn btn-primary" onClick={() => window.location.href = '/raw-material'}>Add Raw Material</button>
            <button className="btn btn-secondary" onClick={() => window.location.href = '/job-work'}>Create Job Work Order</button>
            <button className="btn btn-secondary" onClick={() => window.location.href = '/sales'}>Create Sale</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;