import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { api, endpoints } from '../utils/api';
import { useCart } from '../contexts/CartContext';
import ImageWithFallback from '../components/common/ImageWithFallback';
import { parseImagesArray, resolveImageUrl } from '../utils/images';

const ProductDetail = () => {
  const { id } = useParams();
  const { addItem } = useCart();

  const { data, isLoading, isError } = useQuery(['product', id], async () => {
    const res = await api.get(endpoints.products.detail(id));
    return res.data.data;
  });

  if (isLoading) return <div className="max-w-7xl mx-auto p-6">Loading product...</div>;
  if (isError || !data) return <div className="max-w-7xl mx-auto p-6 text-red-600">Failed to load product.</div>;

  const product = data;
  const images = parseImagesArray(product.images);
  const mainImage = resolveImageUrl(images[0]);

  return (
    <div className="py-10 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="h-80 bg-gray-200 rounded-lg overflow-hidden">
            <ImageWithFallback
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-gray-600 mt-2">{product.description}</p>
          <div className="text-2xl font-bold mt-4">${Number(product.price_usd).toFixed(2)}</div>
          <div className="text-sm text-gray-500 mt-1">{product.stock} in stock</div>

          <div className="flex gap-3 mt-6">
            <button className="btn btn-primary" onClick={() => addItem(product, 1)}>Add to cart</button>
            {product.nft_id && (
              <Link className="btn btn-outline" to={`/traceability/${product.nft_id}`}>View Traceability</Link>
            )}
          </div>

          <div className="mt-6 text-sm text-gray-600">
            <div>Origin: {product.origin_country}{product.origin_region ? `, ${product.origin_region}` : ''}</div>
            {product.harvest_date && <div>Harvest date: {product.harvest_date}</div>}
            {product.organic_certified && <div>Certified Organic: {product.certification_number || 'Yes'}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
