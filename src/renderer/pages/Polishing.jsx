import React, { useState, useEffect } from 'react';
import { useIPC } from '../hooks/useIPC';

const Polishing = () => {
  const { data, loading, create, remove } = useIPC('polishingOrders');
  const [jobWorkOrders, setJobWorkOrders] = useState([]);
  const [polishers, setPolishers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    order_number: '',
    parent_job_work_id: '',
    polisher_id: '',
    pieces_sent: '',
    sent_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    loadMasterData();
  }, []);

  const loadMasterData = async () => {
    const [jobWorkData, polishersData] = await Promise.all([
      window.electronAPI.jobWorkOrders.getAll(),
      window.electronAPI.polishers.getAll()
    ]);
    setJobWorkOrders(jobWorkData || []);
    setPolishers(polishersData || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await create(formData);
    setFormData({
      order_number: '',
      parent_job_work_id: '',
      polisher_id: '',
      pieces_sent: '',
      sent_date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setShowModal(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Polishing Orders</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Create Polishing Order</button>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Job Work Order</th>
                <th>Polisher</th>
                <th>Pieces Sent</th>
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
                  <td>{item.job_work_order}</td>
                  <td>{item.polisher_name}</td>
                  <td>{item.pieces_sent}</td>
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
          {data.length === 0 && <p className="text-center">No polishing orders yet</p>}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Create Polishing Order</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Order Number *</label>
                <input type="text" value={formData.order_number} onChange={(e) => setFormData({ ...formData, order_number: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Job Work Order *</label>
                <select value={formData.parent_job_work_id} onChange={(e) => setFormData({ ...formData, parent_job_work_id: e.target.value })} required>
                  <option value="">Select Job Work Order</option>
                  {jobWorkOrders.map(jw => <option key={jw.id} value={jw.id}>{jw.order_number}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Polisher *</label>
                <select value={formData.polisher_id} onChange={(e) => setFormData({ ...formData, polisher_id: e.target.value })} required>
                  <option value="">Select Polisher</option>
                  {polishers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Pieces Sent *</label>
                <input type="number" value={formData.pieces_sent} onChange={(e) => setFormData({ ...formData, pieces_sent: e.target.value })} required />
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

export default Polishing;