import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import './Admin.css';

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Tech');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [offer, setOffer] = useState('');
  const [statusMsg, setStatusMsg] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw error;
      if (data) setProducts(data);
    } catch (err) {
      console.log('Supabase table might not exist yet:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase.from('orders').select('*');
      if (error) throw error;
      if (data) setOrders(data);
    } catch (err) {
      console.log('Orders table check:', err.message);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setStatusMsg(null);

    const newProduct = {
      title,
      subtitle,
      price: parseFloat(price),
      category,
      image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      description,
      offer: offer ? `${offer}% OFF` : null
    };

    try {
      const { data, error } = await supabase.from('products').insert([newProduct]).select();
      if (error) throw error;
      
      setStatusMsg({ type: 'success', text: 'Product added to Supabase database successfully!' });
      if (data) setProducts([...products, ...data]);

      // Reset form
      setTitle('');
      setSubtitle('');
      setPrice('');
      setImage('');
      setDescription('');
      setOffer('');
    } catch (err) {
      // Local fallback state if table isn't created in Supabase SQL editor yet
      setProducts([...products, { ...newProduct, id: Date.now().toString() }]);
      setStatusMsg({ 
        type: 'warning', 
        text: 'Added to local session! (Note: Create the "products" table in Supabase SQL editor to persist permanently).' 
      });
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await supabase.from('products').delete().eq('id', id);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="admin-page container">
      <div className="admin-header flex justify-between items-center mb-8">
        <div>
          <h1>ADMIN DASHBOARD</h1>
          <p className="subtitle">Manage products, offers, and client orders.</p>
        </div>
        <div className="admin-tabs flex gap-4">
          <button 
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            PRODUCTS & OFFERS
          </button>
          <button 
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            ORDERS
          </button>
        </div>
      </div>

      {activeTab === 'products' ? (
        <div className="admin-content flex gap-8">
          {/* Add Product Form */}
          <div className="add-product-card">
            <h3>ADD NEW PRODUCT</h3>
            
            {statusMsg && (
              <div className={`status-box ${statusMsg.type}`}>
                {statusMsg.text}
              </div>
            )}

            <form onSubmit={handleAddProduct} className="flex-col gap-4 mt-4">
              <div className="form-group flex-col">
                <label>PRODUCT TITLE</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. OBSIDIAN CHRONO" />
              </div>

              <div className="form-group flex-col">
                <label>SUBTITLE / SHORT SPEC</label>
                <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="e.g. Titanium & Sapphire" />
              </div>

              <div className="flex gap-4">
                <div className="form-group flex-col flex-1">
                  <label>PRICE ($)</label>
                  <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="12500" />
                </div>
                <div className="form-group flex-col flex-1">
                  <label>OFFER / DISCOUNT (%)</label>
                  <input type="number" value={offer} onChange={(e) => setOffer(e.target.value)} placeholder="15" />
                </div>
              </div>

              <div className="form-group flex-col">
                <label>CATEGORY</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Watches">TIMEPIECES</option>
                  <option value="Audio">ACOUSTICS</option>
                  <option value="Tech">TECHNOLOGY</option>
                </select>
              </div>

              <div className="form-group flex-col">
                <label>IMAGE URL</label>
                <input type="url" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://images.unsplash.com/..." />
              </div>

              <div className="form-group flex-col">
                <label>DESCRIPTION</label>
                <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Product luxury details..."></textarea>
              </div>

              <button type="submit" className="btn-primary mt-2">PUBLISH PRODUCT</button>
            </form>
          </div>

          {/* Product Inventory List */}
          <div className="inventory-list flex-1">
            <h3>ACTIVE INVENTORY ({products.length})</h3>
            
            <div className="inventory-grid flex-col gap-4 mt-4">
              {products.length === 0 ? (
                <p className="text-muted">No custom products added yet.</p>
              ) : (
                products.map(p => (
                  <div key={p.id} className="inventory-item flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <img src={p.image} alt={p.title} className="thumb" />
                      <div className="flex-col">
                        <span className="item-name">{p.title}</span>
                        <span className="item-category text-muted">{p.category} | ${p.price}</span>
                        {p.offer && <span className="offer-tag">{p.offer}</span>}
                      </div>
                    </div>
                    <button onClick={() => handleDeleteProduct(p.id)} className="delete-btn">DELETE</button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Orders Tab */
        <div className="orders-tab">
          <h3>RECEIVED CLIENT ORDERS</h3>
          <div className="orders-list mt-4 flex-col gap-4">
            {orders.length === 0 ? (
              <div className="p-8 text-center border border-border">
                <p className="text-muted">No orders placed yet. Orders placed by clients will sync here automatically.</p>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="order-card p-4 flex justify-between items-center">
                  <div>
                    <h4>ORDER #{order.id.slice(0, 8)}</h4>
                    <p className="text-muted text-sm">Client: {order.client_email || 'Guest'}</p>
                    <p className="text-muted text-sm">Total: ${order.total}</p>
                  </div>
                  <span className="status-badge">{order.status || 'PROCESSING'}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
