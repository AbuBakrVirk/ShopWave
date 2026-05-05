/**
 * AdminProducts.jsx - Product management (CRUD)
 */

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, Save, AlertTriangle } from 'lucide-react';
import axios from '../../lib/axios';
import toast from 'react-hot-toast';

const EMPTY_FORM = {
  name: '', category: '', price: '', originalPrice: '', image: '',
  description: '', brand: '', stock: '', tags: '', featured: false,
};

const CATEGORIES = ['Electronics', 'Fashion', 'Computers', 'Home & Kitchen', 'Gaming', 'Sports', 'Furniture'];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products?limit=100');
      setProducts(res.data.products);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      description: product.description,
      brand: product.brand,
      stock: product.stock,
      tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
      featured: product.featured || false,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      };

      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct.id}`, payload);
        toast.success('Product updated!');
      } else {
        await axios.post('/api/products', payload);
        toast.success('Product created!');
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`);
      toast.success('Product deleted');
      setDeleteConfirm(null);
      fetchProducts();
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{products.length} total products</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm outline-none focus:border-orange-400"
        />
      </div>

      {/* Products table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  <th className="text-left px-4 py-3">Product</th>
                  <th className="text-left px-4 py-3">Category</th>
                  <th className="text-left px-4 py-3">Price</th>
                  <th className="text-left px-4 py-3">Stock</th>
                  <th className="text-left px-4 py-3">Rating</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {filtered.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                          onError={(e) => e.target.src = 'https://placehold.co/40x40/f97316/white?text=IMG'}
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{product.category}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">${product.price}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        product.stock === 0 ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
                        product.stock < 10 ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400' :
                        'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                      }`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">⭐ {product.rating}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="p-8 text-center text-gray-400">No products found</div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'name', label: 'Product Name *', placeholder: 'iPhone 15 Pro', span: 2 },
                  { name: 'brand', label: 'Brand *', placeholder: 'Apple' },
                  { name: 'category', label: 'Category *', type: 'select' },
                  { name: 'price', label: 'Price *', placeholder: '999.99', type: 'number' },
                  { name: 'originalPrice', label: 'Original Price', placeholder: '1199.99', type: 'number' },
                  { name: 'stock', label: 'Stock *', placeholder: '50', type: 'number' },
                  { name: 'image', label: 'Image URL *', placeholder: 'https://...', span: 2 },
                  { name: 'tags', label: 'Tags (comma separated)', placeholder: 'phone, apple, 5g', span: 2 },
                ].map(field => (
                  <div key={field.name} className={field.span === 2 ? 'sm:col-span-2' : ''}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{field.label}</label>
                    {field.type === 'select' ? (
                      <select
                        name={field.name}
                        value={form[field.name]}
                        onChange={(e) => setForm(prev => ({ ...prev, [field.name]: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm outline-none focus:border-orange-400"
                      >
                        <option value="">Select category</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    ) : (
                      <input
                        type={field.type || 'text'}
                        name={field.name}
                        value={form[field.name]}
                        onChange={(e) => setForm(prev => ({ ...prev, [field.name]: e.target.value }))}
                        placeholder={field.placeholder}
                        step={field.type === 'number' ? '0.01' : undefined}
                        className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm outline-none focus:border-orange-400"
                      />
                    )}
                  </div>
                ))}

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Product description..."
                    rows={3}
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm outline-none focus:border-orange-400 resize-none"
                  />
                </div>

                {/* Featured toggle */}
                <div className="sm:col-span-2 flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={form.featured}
                    onChange={(e) => setForm(prev => ({ ...prev, featured: e.target.checked }))}
                    className="w-4 h-4 accent-orange-500"
                  />
                  <label htmlFor="featured" className="text-sm text-gray-700 dark:text-gray-300">Mark as Featured Product</label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-colors disabled:opacity-60"
                >
                  {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Delete Product</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
