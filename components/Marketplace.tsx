
import React, { useState } from 'react';
import { PRODUCTS } from '../constants';
import { ShoppingCart, Star, Plus, Check, ArrowLeft, Trash2, CreditCard, ShoppingBag, Loader2, CheckCircle } from 'lucide-react';
import { Product, ViewState } from '../types';

interface MarketplaceProps {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  setView: (view: ViewState) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ cart, addToCart, removeFromCart, clearCart, setView }) => {
  const [showCart, setShowCart] = useState(false);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const handlePlaceOrder = () => {
      setProcessingOrder(true);
      // Simulate API call
      setTimeout(() => {
          setProcessingOrder(false);
          setOrderComplete(true);
          clearCart();
      }, 2000);
  };

  const resetShop = () => {
      setOrderComplete(false);
      setShowCart(false);
      setSelectedCategory('All');
  };

  const filteredProducts = PRODUCTS.filter(product => {
      if (selectedCategory === 'All') return true;
      return product.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  // ORDER SUCCESS VIEW
  if (orderComplete) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in space-y-6">
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 animate-scale-bounce">
                  <CheckCircle size={48} />
              </div>
              <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Order Placed Successfully!</h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-2">Thank you for shopping with LunaCare Wellness.</p>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Order #LUNA-{Math.floor(Math.random() * 10000)}</p>
              </div>
              <button 
                  onClick={resetShop}
                  className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold px-8 py-3 rounded-xl hover:scale-105 transition-transform shadow-lg"
              >
                  Continue Shopping
              </button>
          </div>
      );
  }

  // CART VIEW
  if (showCart) {
      return (
          <div className="space-y-6 pb-20 animate-fade-in">
               <div className="flex items-center gap-4 mb-6">
                  <button 
                      onClick={() => setShowCart(false)} 
                      className="p-2 bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                      <ArrowLeft size={20} />
                  </button>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Your Cart</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-4">
                      {cart.length === 0 ? (
                          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 border-dashed">
                              <ShoppingBag size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                              <p className="text-slate-500 dark:text-slate-400 font-medium">Your cart is empty.</p>
                              <button onClick={() => setShowCart(false)} className="text-rose-500 font-bold text-sm mt-2 hover:underline">Start Shopping</button>
                          </div>
                      ) : (
                          cart.map((item, index) => (
                              <div key={`${item.id}-${index}`} className="flex gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm animate-fade-in">
                                  <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden flex-shrink-0">
                                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex-1 flex flex-col justify-between">
                                      <div>
                                          <h4 className="font-bold text-slate-800 dark:text-white text-sm">{item.name}</h4>
                                          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase mt-1">{item.category}</p>
                                      </div>
                                      <div className="flex justify-between items-center">
                                          <span className="font-bold text-rose-600 dark:text-rose-400">${item.price.toFixed(2)}</span>
                                          <button 
                                              onClick={() => removeFromCart(item.id)}
                                              className="text-slate-400 hover:text-red-500 p-1 rounded-md transition-colors"
                                          >
                                              <Trash2 size={16} />
                                          </button>
                                      </div>
                                  </div>
                              </div>
                          ))
                      )}
                  </div>

                  {cart.length > 0 && (
                      <div className="md:col-span-1">
                          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm sticky top-24">
                              <h3 className="font-bold text-slate-800 dark:text-white mb-4">Order Summary</h3>
                              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 pb-4 border-b border-slate-100 dark:border-slate-800">
                                  <div className="flex justify-between">
                                      <span>Subtotal ({cart.length} items)</span>
                                      <span>${cartTotal.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                      <span>Shipping</span>
                                      <span className="text-green-500 font-medium">Free</span>
                                  </div>
                                  <div className="flex justify-between">
                                      <span>Taxes</span>
                                      <span>${(cartTotal * 0.08).toFixed(2)}</span>
                                  </div>
                              </div>
                              <div className="flex justify-between items-center py-4 font-bold text-lg text-slate-800 dark:text-white">
                                  <span>Total</span>
                                  <span>${(cartTotal * 1.08).toFixed(2)}</span>
                              </div>
                              
                              <button 
                                  onClick={handlePlaceOrder}
                                  disabled={processingOrder}
                                  className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                              >
                                  {processingOrder ? (
                                      <Loader2 className="animate-spin" size={20} />
                                  ) : (
                                      <>Place Order <CreditCard size={18} /></>
                                  )}
                              </button>
                          </div>
                      </div>
                  )}
              </div>
          </div>
      );
  }

  // SHOP VIEW (DEFAULT)
  return (
    <div className="space-y-6 pb-20 animate-fade-in">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                 <button 
                    onClick={() => setView('dashboard')} 
                    className="p-2 bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Wellness Shop</h2>
            </div>
            
            <button 
                onClick={() => setShowCart(true)}
                className="relative bg-white dark:bg-slate-900 p-2.5 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
            >
                <ShoppingCart size={24} className="text-slate-700 dark:text-slate-200 group-hover:text-rose-500 transition-colors" />
                {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce-slow border-2 border-white dark:border-slate-950">
                        {cart.length}
                    </span>
                )}
            </button>
        </div>

        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {['All', 'Hygiene', 'Fertility', 'Pregnancy', 'Wellness'].map((cat) => (
                <button 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                        selectedCategory === cat 
                        ? 'bg-rose-500 text-white shadow-md shadow-rose-200 dark:shadow-rose-900/40' 
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-10 text-slate-400 dark:text-slate-500 italic">
                    No products found in this category.
                </div>
            ) : (
                filteredProducts.map(product => {
                    const isInCart = cart.some(item => item.id === product.id);
                    return (
                        <div key={product.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                            <div className="relative h-40 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-2 py-1 rounded-md flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm">
                                    <Star size={10} className="text-amber-400 fill-amber-400" />
                                    {product.rating}
                                </div>
                            </div>
                            <div className="p-4">
                                <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider mb-1">{product.category}</p>
                                <h3 className="font-bold text-slate-800 dark:text-white text-sm leading-tight mb-3 line-clamp-2 h-10">{product.name}</h3>
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-rose-600 dark:text-rose-400">${product.price.toFixed(2)}</span>
                                    <button 
                                        onClick={() => addToCart(product)}
                                        disabled={isInCart}
                                        className={`p-2 rounded-lg transition-colors ${
                                            isInCart 
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 cursor-default' 
                                            : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200'
                                        }`}
                                    >
                                        {isInCart ? <Check size={16} /> : <Plus size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    </div>
  );
};

export default Marketplace;
