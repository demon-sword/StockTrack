import React, { useState, useEffect } from 'react';
import { useIPC } from '../hooks/useIPC';

const RawMaterial = () => {
  const { data, loading, create, remove } = useIPC('rawMaterialInward');
  const [vendors, setVendors] = useState([]);
  const [materialTypes, setMaterialTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    batch_number: '',
    vendor_id: '',
    material_type_id: '',
    weight_kg: '',
    rate_per_kg: '',
    total_amount: '',
    purchase_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    loadMasterData();
  }, []);

  const loadMasterData = async () => {
    const [vendorsData, typesData] = await Promise.all([
      window.electronAPI.vendors.getAll(),
      window.electronAPI.materialTypes.getAll()
    ]);
    setVendors(vendorsData || []);
    setMaterialTypes(typesData || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await create(formData);
    setFormData({
      batch_number: '',
      vendor_id: '',
      material_type_id: '',
      weight_kg: '',
      rate_per_kg: '',
      total_amount: '',
      purchase_date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setShowModal(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Raw Material Inward</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Inward Entry</button>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Batch #</th>
                <th>Vendor</th>
                <th>Material</th>
                <th>Weight (kg)</th>
                <th>Rate/kg</th>
                <th>Total</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.batch_number}</td>
                  <td>{item.vendor_name}</td>
                  <td>{item.material_name}</td>
                  <td>{item.weight_kg}</td>
                  <td>{item.rate_per_kg}</td>
                  <td>{item.total_amount}</td>
                  <td>{item.purchase_date}</td>
                  <td className="actions">
                    <button className="btn btn-secondary" onClick={() => remove(item.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.length === 0 && <p className="text-center">No raw material entries yet</p>}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add Raw Material Inward</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Batch Number *</label>
                <input type="text" value={formData.batch_number} onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Vendor *</label>
                <select value={formData.vendor_id} onChange={(e) => setFormData({ ...formData, vendor_id: e.target.value })} required>
                  <option value="">Select Vendor</option>
                  {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Material Type *</label>
                <select value={formData.material_type_id} onChange={(e) => setFormData({ ...formData, material_type_id: e.target.value })} required>
                  <option value="">Select Material Type</option>
                  {materialTypes.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div className="grid grid-3">
                <div className="form-group">
                  <label>Weight (kg) *</label>
                  <input type="number" step="0.01" value={formData.weight_kg} onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Rate per kg</label>
                  <input type="number" step="0.01" value={formData.rate_per_kg} onChange={(e) => setFormData({ ...formData, rate_per_kg: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Total Amount</label>
                  <input type="number" step="0.01" value={formData.total_amount} onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Purchase Date *</label>
                <input type="date" value={formData.purchase_date} onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows="3" />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RawMaterial;