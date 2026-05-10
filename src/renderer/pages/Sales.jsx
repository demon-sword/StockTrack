import React, { useState, useEffect } from 'react';
import { useIPC } from '../hooks/useIPC';

const Sales = () => {
  const { data, loading, create, remove } = useIPC('sales');
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [quickMode, setQuickMode] = useState(true);
  const [formData, setFormData] = useState({
    invoice_number: '',
    customer_id: '',
    customer_name: '',
    sale_date: new Date().toISOString().split('T')[0],
    pieces_sold: '',
    rate_per_piece: '',
    total_amount: '',
    notes: ''
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const customersData = await window.electronAPI.customers.getAll();
    setCustomers(customersData || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await create(formData);
    setFormData({
      invoice_number: '',
      customer_id: '',
      customer_name: '',
      sale_date: new Date().toISOString().split('T')[0],
      pieces_sold: '',
      rate_per_piece: '',
      total_amount: '',
      notes: ''
    });
    setShowModal(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Sales</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={() => { setQuickMode(true); setShowModal(true); }}>Quick Sale</button>
          <button className="btn btn-primary" onClick={() => { setQuickMode(false); setShowModal(true); }}>+ Add Sale</button>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Pieces Sold</th>
                <th>Rate/Piece</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.invoice_number}</td>
                  <td>{item.customer_name || 'Walk-in'}</td>
                  <td>{item.sale_date}</td>
                  <td>{item.pieces_sold}</td>
                  <td>{item.rate_per_piece}</td>
                  <td>{item.total_amount}</td>
                  <td className="actions">
                    <button className="btn btn-secondary" onClick={() => remove(item.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.length === 0 && <p className="text-center">No sales recorded yet</p>}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{quickMode ? 'Quick Sale' : 'Add Sale'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              {quickMode ? (
                <>
                  <div className="form-group">
                    <label>Customer Name</label>
                    <input type="text" placeholder="Walk-in customer" value={formData.customer_name} onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })} />
                  </div>
                </>
              ) : (
                <div className="form-group">
                  <label>Customer *</label>
                  <select value={formData.customer_id} onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}>
                    <option value="">Walk-in Customer</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              )}
              <div className="form-group">
                <label>Invoice Number *</label>
                <input type="text" value={formData.invoice_number} onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })} required />
              </div>
              <div className="grid grid-3">
                <div className="form-group">
                  <label>Pieces Sold *</label>
                  <input type="number" value={formData.pieces_sold} onChange={(e) => setFormData({ ...formData, pieces_sold: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Rate per Piece</label>
                  <input type="number" step="0.01" value={formData.rate_per_piece} onChange={(e) => setFormData({ ...formData, rate_per_piece: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Total Amount</label>
                  <input type="number" step="0.01" value={formData.total_amount} onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Sale Date *</label>
                <input type="date" value={formData.sale_date} onChange={(e) => setFormData({ ...formData, sale_date: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows="3" />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Record Sale</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;