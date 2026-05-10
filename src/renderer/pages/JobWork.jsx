import React, { useState, useEffect } from 'react';
import { useIPC } from '../hooks/useIPC';

const JobWork = () => {
  const { data, loading, create, remove } = useIPC('jobWorkOrders');
  const [inwardEntries, setInwardEntries] = useState([]);
  const [jobWorkers, setJobWorkers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    order_number: '',
    parent_inward_id: '',
    job_worker_id: '',
    weight_sent_kg: '',
    sent_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    loadMasterData();
  }, []);

  const loadMasterData = async () => {
    const [inwardData, workersData] = await Promise.all([
      window.electronAPI.rawMaterialInward.getAll(),
      window.electronAPI.jobWorkers.getAll()
    ]);
    setInwardEntries(inwardData || []);
    setJobWorkers(workersData || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await create(formData);
    setFormData({
      order_number: '',
      parent_inward_id: '',
      job_worker_id: '',
      weight_sent_kg: '',
      sent_date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setShowModal(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Job Work Orders</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Create Job Work Order</button>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Batch #</th>
                <th>Job Worker</th>
                <th>Weight Sent (kg)</th>
                <th>Pieces Received</th>
                <th>Status</th>
                <th>Sent Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.order_number}</td>
                  <td>{item.batch_number}</td>
                  <td>{item.job_worker_name}</td>
                  <td>{item.weight_sent_kg}</td>
                  <td>{item.pieces_received || '-'}</td>
                  <td>
                    <span className={`badge ${item.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>{item.sent_date}</td>
                  <td className="actions">
                    <button className="btn btn-secondary" onClick={() => remove(item.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.length === 0 && <p className="text-center">No job work orders yet</p>}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Create Job Work Order</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Order Number *</label>
                <input type="text" value={formData.order_number} onChange={(e) => setFormData({ ...formData, order_number: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Raw Material Batch *</label>
                <select value={formData.parent_inward_id} onChange={(e) => setFormData({ ...formData, parent_inward_id: e.target.value })} required>
                  <option value="">Select Batch</option>
                  {inwardEntries.map(i => <option key={i.id} value={i.id}>{i.batch_number} - {i.weight_kg}kg</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Job Worker *</label>
                <select value={formData.job_worker_id} onChange={(e) => setFormData({ ...formData, job_worker_id: e.target.value })} required>
                  <option value="">Select Job Worker</option>
                  {jobWorkers.map(jw => <option key={jw.id} value={jw.id}>{jw.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Weight Sent (kg) *</label>
                <input type="number" step="0.01" value={formData.weight_sent_kg} onChange={(e) => setFormData({ ...formData, weight_sent_kg: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Sent Date *</label>
                <input type="date" value={formData.sent_date} onChange={(e) => setFormData({ ...formData, sent_date: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows="3" />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobWork;