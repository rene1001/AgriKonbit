import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Cart = () => {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCart();

  return (
    <div className="py-10 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

        {items.length === 0 ? (
          <div className="bg-white p-6 rounded-lg border text-gray-600">
            Your cart is empty. <Link to="/marketplace" className="text-primary-600">Continue shopping</Link>.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-lg border flex items-start gap-4">
                  <div className="w-24 h-24 bg-gray-200 rounded" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{item.name || item.title}</h3>
                        <div className="text-sm text-gray-500">${(Number(item.price_usd ?? item.price ?? 0)).toFixed(2)}</div>
                      </div>
                      <button className="text-red-600" onClick={() => removeItem(item.id)}>Remove</button>
                    </div>
                    <div className="flex items-center mt-2 gap-2">
                      <button className="px-2 py-1 border rounded" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span className="px-3 py-1 border rounded bg-gray-50">{item.quantity}</span>
                      <button className="px-2 py-1 border rounded" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span className="font-semibold">${getTotalPrice('usd').toFixed(2)}</span>
                </div>
                <Link to="/checkout" className="btn btn-primary w-full mt-3">Proceed to Checkout</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
