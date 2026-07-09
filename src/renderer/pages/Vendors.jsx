import React, { useState } from 'react';
import { useIPC } from '../hooks/useIPC';

const Vendors = () => {
  const { data: vendors, loading, refresh, create, remove } = useIPC('vendors');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', contact: '', phone: '', email: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await create(formData);
      setFormData({ name: '', contact: '', phone: '', email: '' });
      setShowModal(false);
    } catch (error) {
      alert('Failed to save vendor. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Vendors</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Vendor</button>
      </div>

      <div className="card">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search vendors..."
            onChange={(e) => {
              const term = e.target.value.toLowerCase();
              // Filter logic would go here
            }}
          />
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td>{vendor.name}</td>
                  <td>{vendor.phone}</td>
                  <td>{vendor.contact}</td>
                  <td>{vendor.email}</td>
                  <td className="actions">
                    <button className="btn btn-secondary" onClick={() => remove(vendor.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {vendors.length === 0 && <p className="text-center">No vendors added yet</p>}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add Vendor</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Contact Person</label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendors;