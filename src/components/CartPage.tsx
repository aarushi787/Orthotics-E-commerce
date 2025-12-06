import React, { useState } from 'react';
import { CartItem } from '../types';
import { ShoppingCartIcon } from './icons';
import api from '../services/api';

import { RAZORPAY_KEY_ID } from '../constants';

interface CartPageProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
}

const CartPage: React.FC<CartPageProps> = ({ cartItems, onUpdateQuantity, onRemoveItem }) => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = +(subtotal * 0.05).toFixed(2); // 5% GST
  const total = +(subtotal + tax).toFixed(2);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const MIN_QTY = 50;
  const INITIAL_QTY = 50;

  if (cartItems.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{minHeight: '50vh'}}>
        <div className="text-center p-10 bg-white rounded-lg shadow-md border border-gray-200 max-w-md mx-auto">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-brand-accent-light mb-6">
            <ShoppingCartIcon className="w-8 h-8 text-brand-accent" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Your cart is empty</h3>
          <p className="text-gray-600 mt-2 mb-8">
            Looks like you haven't added any products to your cart yet.
          </p>
          <a href="#/" className="inline-block bg-brand-blue text-white font-bold py-3 px-8 rounded-lg hover:bg-brand-blue-dark transition-all duration-300 transform hover:scale-105">
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Your Shopping Cart</h1>
            <p className="text-gray-600 mt-2">Review your items and proceed to checkout</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900">Cart Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {cartItems.map(({ product, quantity }) => (
                    <div key={product.id} className="flex gap-4 p-6 hover:bg-gray-50 transition-colors">
                      <a href={`#/product/${product.id}`}>
                        <img
                          src={product.imageUrls && product.imageUrls[0] ? (product.imageUrls[0].startsWith('/') ? product.imageUrls[0] : `/${product.imageUrls[0]}`) : '/images/no-image.png'}
                          alt={product.name}
                          className="w-24 h-24 object-cover rounded-lg border border-gray-200 hover:border-brand-blue transition-colors"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            if (img.dataset.attempt === '1') {
                              img.src = '/images/no-image.png';
                              return;
                            }
                            const s = (product.sku || '').toString().toUpperCase();
                            if (s) {
                              img.dataset.attempt = '1';
                              img.src = `/images/${s}/${s}-1.jpg`;
                              return;
                            }
                            img.src = '/images/no-image.png';
                          }}
                        />
                      </a>
                      <div className="flex-grow min-w-0">
                        <a href={`#/product/${product.id}`} className="block font-bold text-gray-900 hover:text-brand-blue transition-colors truncate">{product.name}</a>
                        <p className="text-sm text-gray-600 mt-1">SKU: {product.sku}</p>
                        <button onClick={() => onRemoveItem(product.id)} className="text-xs text-red-600 hover:text-red-700 font-medium mt-2 hover:underline">
                          Remove Item
                        </button>
                      </div>
                      <div className="flex flex-col items-end gap-2 min-w-max">
                        <p className="font-bold text-gray-900">₹{(product.price * quantity).toFixed(2)}</p>
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
                          <input
                            type="number"
                            value={quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value || '0', 10);
                              onUpdateQuantity(product.id, val);
                            }}
                            min={MIN_QTY}
                            aria-label={`Quantity for ${product.name}`}
                            className="w-20 bg-transparent text-center font-medium text-gray-900 border-none outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </div>
                        <p className="text-xs text-gray-500 text-center">Min: {MIN_QTY}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden sticky top-24">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>GST (5%)</span>
                    <span className="font-medium">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 pb-4 border-b border-gray-200">
                    <span>Shipping</span>
                    <span className="font-bold text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-brand-blue">₹{total.toFixed(2)}</span>
                  </div>

                  {checkoutError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                      {checkoutError}
                    </div>
                  )}

                  <button
                    onClick={async () => {
                      setCheckoutError(null);
                      // Validate min quantities before checkout
                      for (const item of cartItems) {
                        if (item.quantity < MIN_QTY) {
                          setCheckoutError(`Minimum order quantity for "${item.product.name}" is ${MIN_QTY} pieces.`);
                          return;
                        }
                      }

                      try {
                        // Create razorpay order on server
                        const razorpayOrder = await api.createRazorpayOrder(total);

                        // Load Razorpay script if not loaded
                        if (!(window as any).Razorpay) {
                          await new Promise((resolve, reject) => {
                            const script = document.createElement('script');
                            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                            script.onload = resolve;
                            script.onerror = reject;
                            document.body.appendChild(script);
                          });
                        }

                        const options = {
                          key: RAZORPAY_KEY_ID,
                          amount: razorpayOrder.amount, // amount in paise
                          currency: razorpayOrder.currency || 'INR',
                          name: 'Fox Orthotics',
                          description: 'Order Payment',
                          order_id: razorpayOrder.id,
                          handler: async function (response: any) {
                            try {
                              // After successful payment, create order in backend
                              await api.createOrder(
                                cartItems.map(ci => ({ productId: ci.product.id, quantity: ci.quantity, price: ci.product.price })),
                                total,
                                tax,
                                0,
                                'Customer provided at checkout',
                                `razorpay_payment_id:${response.razorpay_payment_id}`
                              );
                              // Redirect to orders or show success
                              window.location.href = '#/orders';
                            } catch (err) {
                              console.error(err);
                              setCheckoutError('Payment succeeded but failed to create order. Please contact support.');
                            }
                          },
                          prefill: {
                            // Optionally prefill user info if available
                          },
                          notes: {},
                          theme: { color: '#0D47A1' }
                        };

                        const rzp = new (window as any).Razorpay(options);
                        rzp.open();

                      } catch (err) {
                        console.error(err);
                        setCheckoutError('Unable to initialize payment. Please try again later.');
                      }
                    }}
                    className="w-full mt-6 bg-brand-blue text-white font-bold py-3 rounded-lg hover:bg-brand-blue-dark transition-colors duration-200"
                  >
                    Proceed to Checkout
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-4">
                    ⓘ Minimum order quantity: {MIN_QTY} pieces per product
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default CartPage;

