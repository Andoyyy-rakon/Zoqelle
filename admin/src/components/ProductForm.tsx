import { useState, useEffect, useRef } from 'react';
import { X, Loader2, Upload, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { uploadProductImage, deleteProductImage } from '../lib/storage';
import type { Product } from '../types';

interface ProductFormProps {
  product?: Product | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const CATEGORIES = [
  'birthday',
  'wedding',
  'cupcake',
  'pastry',
  'signature',
  'uncategorized',
];

export default function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const isEditing = !!product;
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const hasInitializedRef = useRef(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'birthday',
    stock: '',
    is_featured: false,
    is_available: true,
  });

  useEffect(() => {
    if (product && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        category: product.category || 'birthday',
        stock: product.stock.toString(),
        is_featured: product.is_featured,
        is_available: product.is_available,
      });
      setImagePreview(product.image_url || null);
    }
  }, [product]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.price || parseFloat(formData.price) < 0) newErrors.price = 'Price must be >= 0';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Stock must be >= 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image_url: '' }));
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image_url: '' }));
    if (product?.image_url) {
      deleteProductImage(product.image_url).catch(console.error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      let imageUrl = product?.image_url || null;

      if (selectedFile) {
        setUploading(true);
        imageUrl = await uploadProductImage(selectedFile);
        setUploading(false);
      }

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        is_featured: formData.is_featured,
        is_available: formData.is_available,
        image_url: imageUrl,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product!.id);

        if (error) throw error;
        toast.success('Product updated successfully');
      } else {
        const { error } = await supabase.from('products').insert(productData);
        if (error) throw error;
        toast.success('Product created successfully');
      }

      onSuccess();
    } catch (err) {
      console.error('Product save error:', err);
      toast.error((err as Error).message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs" role="dialog" aria-modal="true" aria-labelledby="form-title">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-surface-bright rounded-2xl border border-outline-variant shadow-2xl animate-fade-in" style={{ fontFamily: 'var(--font-family-body)' }}>
        
        <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-outline-variant/60 bg-surface-bright/95 backdrop-blur-sm rounded-t-2xl">
          <h2 id="form-title" className="text-xl font-bold text-on-surface" style={{ fontFamily: 'var(--font-family-display)' }}>
            {isEditing ? 'Edit Bakery Product' : 'Add New Cake / Product'}
          </h2>
          <button onClick={onCancel} className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors focus-ring" aria-label="Close form">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          <div>
            <label className="block mb-2 text-xs font-semibold uppercase tracking-wider text-secondary">
              Product Image
            </label>
            <div className="relative">
              <div className="aspect-[4/3] w-full max-w-xs bg-surface-container/50 border-2 border-dashed border-outline-variant rounded-2xl flex items-center justify-center overflow-hidden relative">
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-3 right-3 p-2 bg-red-700 text-on-primary rounded-full hover:bg-red-800 transition-colors shadow-md"
                      aria-label="Remove image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center gap-3 p-6 text-center">
                    <Upload className="h-9 w-9 text-accent-gold" />
                    <span className="text-sm font-medium text-on-surface">
                      Click to upload high-res photo
                    </span>
                    <span className="text-xs text-on-surface-variant">PNG or JPG up to 5MB</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                )}
              </div>
              {errors.image_url && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.image_url}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="name" className="block mb-2 text-xs font-semibold uppercase tracking-wider text-secondary">
              Product Name <span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={submitting}
              className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl text-on-surface placeholder-on-surface-variant/60 focus:outline-none focus:border-accent-gold transition-colors focus-ring text-sm"
              placeholder="e.g., Signature Velveteen Strawberry Cake"
            />
            {errors.name && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block mb-2 text-xs font-semibold uppercase tracking-wider text-secondary">
              Description / Notes
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              disabled={submitting}
              className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl text-on-surface placeholder-on-surface-variant/60 focus:outline-none focus:border-accent-gold transition-colors focus-ring text-sm resize-none"
              placeholder="Flavor profile, custom options, ingredient notes..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="price" className="block mb-2 text-xs font-semibold uppercase tracking-wider text-secondary">
                Price (₱ PHP) <span className="text-red-700">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
                disabled={submitting}
                className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl text-on-surface placeholder-on-surface-variant/60 focus:outline-none focus:border-accent-gold transition-colors focus-ring text-sm"
                placeholder="1250.00"
              />
              {errors.price && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.price}</p>}
            </div>

            <div>
              <label htmlFor="category" className="block mb-2 text-xs font-semibold uppercase tracking-wider text-secondary">
                Collection / Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                disabled={submitting}
                className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-accent-gold transition-colors focus-ring text-sm"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'uncategorized' ? 'Flexible / Uncategorized' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="stock" className="block mb-2 text-xs font-semibold uppercase tracking-wider text-secondary">
              Stock Quantity <span className="text-red-700">*</span>
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              min="0"
              required
              disabled={submitting}
              className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl text-on-surface placeholder-on-surface-variant/60 focus:outline-none focus:border-accent-gold transition-colors focus-ring text-sm"
              placeholder="15"
            />
            {errors.stock && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.stock}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-4 bg-surface border border-outline-variant/80 rounded-xl cursor-pointer hover:border-accent-gold transition-colors">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleInputChange}
                disabled={submitting}
                className="h-4 w-4 text-accent-gold border-outline-variant rounded focus:ring-accent-gold"
              />
              <div>
                <span className="block text-sm font-semibold text-on-surface">
                  Featured Product
                </span>
                <span className="text-xs text-on-surface-variant">Highlight on customer homepage</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 bg-surface border border-outline-variant/80 rounded-xl cursor-pointer hover:border-accent-gold transition-colors">
              <input
                type="checkbox"
                name="is_available"
                checked={formData.is_available}
                onChange={handleInputChange}
                disabled={submitting}
                className="h-4 w-4 text-accent-gold border-outline-variant rounded focus:ring-accent-gold"
              />
              <div>
                <span className="block text-sm font-semibold text-on-surface">
                  Available for Purchase
                </span>
                <span className="text-xs text-on-surface-variant">Display active in shop</span>
              </div>
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-outline-variant/60">
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="flex-1 px-6 py-3 text-on-surface border border-outline-variant/80 rounded-xl font-semibold hover:bg-surface-container transition-colors disabled:opacity-50 text-sm focus-ring"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || uploading}
              className="flex-1 px-6 py-3 text-on-primary rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm focus-ring"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading Photo...
                </span>
              ) : submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving Details...
                </span>
              ) : (
                isEditing ? 'Update Cake Product' : 'Create Product Listing'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}