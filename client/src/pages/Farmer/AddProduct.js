import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { api, endpoints } from '../../utils/api';
import toast from 'react-hot-toast';
import BackButton from '../../components/common/BackButton';

const AddProduct = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: 'crops',
    unit: 'kg',
    location: '',
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const onChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const submit = async () => {
    try {
      setLoading(true);

      // Validations de base
      if (!form.name.trim() || form.name.trim().length < 3) {
        toast.error(t('addProduct.toastName'));
        return;
      }

      if (!form.description.trim() || form.description.trim().length < 10) {
        toast.error(t('addProduct.toastDesc'));
        return;
      }

      if (!(parseFloat(form.price) > 0)) {
        toast.error(t('addProduct.toastPrice'));
        return;
      }

      if (!(parseInt(form.stock) >= 0)) {
        toast.error(t('addProduct.toastStock'));
        return;
      }

      if (!form.location.trim() || form.location.trim().length < 3) {
        toast.error(t('addProduct.toastLocation'));
        return;
      }

      const payload = {
        ...form,
        images: form.images || []
      };

      const res = await api.post(endpoints.products.create, payload);

      if (res.data.success) {
        toast.success(t('addProduct.toastSuccess'));
        navigate('/farmer/my-products');
      }
    } catch (e) {
      toast.error(e.response?.data?.message || t('addProduct.toastFail'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t('addProduct.title')}</h1>
          <BackButton />
        </div>

        <div className="bg-white p-6 rounded shadow space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('addProduct.nameLabel')}</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={form.name}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder={t('addProduct.namePh')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('addProduct.descLabel')}</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={4}
              value={form.description}
              onChange={(e) => onChange('description', e.target.value)}
              placeholder={t('addProduct.descPh')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('addProduct.priceLabel')}</label>
              <input
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={form.price}
                onChange={(e) => onChange('price', e.target.value)}
                placeholder={t('addProduct.pricePh')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('addProduct.stockLabel')}</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={form.stock}
                onChange={(e) => onChange('stock', e.target.value)}
                placeholder={t('addProduct.stockPh')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('addProduct.unitLabel')}</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={form.unit}
                onChange={(e) => onChange('unit', e.target.value)}
              >
                <option value="kg">{t('addProduct.unit.kg')}</option>
                <option value="g">{t('addProduct.unit.g')}</option>
                <option value="l">{t('addProduct.unit.l')}</option>
                <option value="ml">{t('addProduct.unit.ml')}</option>
                <option value="piece">{t('addProduct.unit.piece')}</option>
                <option value="box">{t('addProduct.unit.box')}</option>
                <option value="bottle">{t('addProduct.unit.bottle')}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('addProduct.categoryLabel')}</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={form.category}
                onChange={(e) => onChange('category', e.target.value)}
              >
                <option value="crops">{t('addProduct.category.crops')}</option>
                <option value="livestock">{t('addProduct.category.livestock')}</option>
                <option value="dairy">{t('addProduct.category.dairy')}</option>
                <option value="honey">{t('addProduct.category.honey')}</option>
                <option value="fruits">{t('addProduct.category.fruits')}</option>
                <option value="vegetables">{t('addProduct.category.vegetables')}</option>
                <option value="grains">{t('addProduct.category.grains')}</option>
                <option value="other">{t('addProduct.category.other')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('addProduct.locationLabel')}</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={form.location}
                onChange={(e) => onChange('location', e.target.value)}
                placeholder={t('addProduct.locationPh')}
              />
            </div>
          </div>

          {/* Section Images */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('addProduct.imagesLabel')}</label>
            <div className="flex gap-2 items-center">
              <input
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('addProduct.imagesPh')}
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <button
                type="button"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                title={t('addProduct.addImage')}
                onClick={() => {
                  const url = (imageUrl || '').trim();
                  if (!url) return;
                  setForm(prev => ({ ...prev, images: [...(prev.images || []), url] }));
                  setImageUrl('');
                }}
              >
                {t('addProduct.addImage')}
              </button>
            </div>

            {(form.images || []).length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                {form.images.map((url, idx) => (
                  <div key={`${url}-${idx}`} className="relative border rounded-lg overflow-hidden">
                    <img
                      src={url}
                      alt={`image-${idx}`}
                      className="w-full h-24 object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-product.png';
                      }}
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded"
                      title={t('addProduct.removeImage')}
                      onClick={() => setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4">
            <button
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              onClick={submit}
              disabled={loading}
            >
              {loading ? t('addProduct.submitting') : t('addProduct.submit')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
