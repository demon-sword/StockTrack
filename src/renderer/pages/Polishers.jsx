import React, { useState } from 'react';
import { useIPC } from '../hooks/useIPC';

const Polishers = () => {
  const { data, loading, create, remove } = useIPC('polishers');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', contact: '', phone: '', payment_rate_per_piece: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await create(formData);
    setFormData({ name: '', contact: '', phone: '', payment_rate_per_piece: '' });
    setShowModal(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Polishers</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Polishing</button>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Contact</th>
                <th>Rate/piece</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.phone}</td>
                  <td>{item.contact}</td>
                  <td>{item.payment_rate_per_piece}</td>
                  <td className="actions">
                    <button className="btn btn-secondary" onClick={() => remove(item.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.length === 0 && <p className="text-center">No polishers added yet</p>}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add Polishing</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Contact Person</label>
                <input type="text" value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Payment Rate per piece</label>
                <input type="number" value={formData.payment_rate_per_piece} onChange={(e) => setFormData({ ...formData, payment_rate_per_piece: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Polishing</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Polishers;