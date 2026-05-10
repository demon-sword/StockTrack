import React, { useState } from 'react';
import { useIPC } from '../hooks/useIPC';

const MaterialTypes = () => {
  const { data, loading, create, remove } = useIPC('materialTypes');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', default_conversion_rate: '10' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await create(formData);
    setFormData({ name: '', default_conversion_rate: '10' });
    setShowModal(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Material Types</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Material Type</button>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Default Conversion Rate (kg to pieces)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.default_conversion_rate}</td>
                  <td className="actions">
                    <button className="btn btn-secondary" onClick={() => remove(item.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.length === 0 && <p className="text-center">No material types added yet</p>}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add Material Type</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Default Conversion Rate (1kg = ? pieces)</label>
                <input type="number" value={formData.default_conversion_rate} onChange={(e) => setFormData({ ...formData, default_conversion_rate: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Material Type</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialTypes;