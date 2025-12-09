import React from 'react';
import { PRODUCTS } from '../constants';
import { ShoppingCart, Star, Plus, Check } from 'lucide-react';
import { Product } from '../types';

interface MarketplaceProps {
  cart: Product[];
  addToCart: (product: Product) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ cart, addToCart }) => {
  return (
    <div className="space-y-6 pb-20 animate-fade-in">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">Wellness Shop</h2>
            <button className="relative bg-white p-2.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors">
                <ShoppingCart size={24} className="text-slate-700" />
                {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce-slow">
                        {cart.length}
                    </span>
                )}
            </button>
        </div>

        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {['All', 'Hygiene', 'Fertility', 'Pregnancy', 'Vitamins'].map((cat, i) => (
                <button key={cat} className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${i === 0 ? 'bg-rose-500 text-white shadow-md shadow-rose-200' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                    {cat}
                </button>
            ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PRODUCTS.map(product => {
                const isInCart = cart.some(item => item.id === product.id);
                return (
                    <div key={product.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                        <div className="relative h-40 bg-slate-100 overflow-hidden">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md flex items-center gap-1 text-xs font-bold text-slate-700 shadow-sm">
                                <Star size={10} className="text-amber-400 fill-amber-400" />
                                {product.rating}
                            </div>
                        </div>
                        <div className="p-4">
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">{product.category}</p>
                            <h3 className="font-bold text-slate-800 text-sm leading-tight mb-3 line-clamp-2 h-10">{product.name}</h3>
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-rose-600">${product.price.toFixed(2)}</span>
                                <button 
                                    onClick={() => addToCart(product)}
                                    disabled={isInCart}
                                    className={`p-2 rounded-lg transition-colors ${
                                        isInCart 
                                        ? 'bg-green-100 text-green-600 cursor-default' 
                                        : 'bg-slate-900 text-white hover:bg-slate-800'
                                    }`}
                                >
                                    {isInCart ? <Check size={16} /> : <Plus size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
};

export default Marketplace;