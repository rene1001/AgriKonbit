import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { FiX, FiTrash2 } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const CartSidebar = () => {
  const { t } = useTranslation();
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, getTotalPrice } = useCart();

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'pointer-events-none'}`}>
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`absolute right-0 top-0 h-full w-full sm:w-[400px] bg-white shadow-xl transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">{t('cart.title')}</h3>
          <button
            className="p-2 rounded hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
            aria-label="Close cart"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 h-[calc(100%-160px)] overflow-y-auto">
          {items.length === 0 ? (
            <div className="text-center text-gray-500 py-10">{t('cart.empty')}</div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex items-start space-x-3">
                  <div className="w-16 h-16 bg-gray-200 rounded" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{item.name || item.title}</h4>
                        <p className="text-sm text-gray-500">${(Number(item.price_usd ?? item.price ?? 0) || 0).toFixed(2)}</p>
                      </div>
                      <button
                        className="p-2 text-gray-500 hover:text-red-600"
                        onClick={() => removeItem(item.id)}
                        aria-label="Remove item"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center mt-2 space-x-2">
                      <button
                        className="px-2 py-1 border rounded"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 border rounded bg-gray-50">
                        {item.quantity}
                      </span>
                      <button
                        className="px-2 py-1 border rounded"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-600">{t('cart.subtotal')}</span>
            <span className="font-semibold">${Number(getTotalPrice('usd')).toFixed(2)}</span>
          </div>
          <Link
            to="/checkout"
            className={`btn btn-primary w-full ${items.length === 0 ? 'pointer-events-none opacity-60' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            {t('cart.checkout')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
