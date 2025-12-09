import React from 'react';
import { ARTICLES } from '../constants';
import { PlayCircle, Clock } from 'lucide-react';

const LearnHub: React.FC = () => {
  return (
    <div className="space-y-6 pb-20 animate-fade-in">
       <h2 className="text-2xl font-bold text-slate-800">Learn Hub</h2>

       {/* Featured Video */}
       <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-900 group cursor-pointer shadow-md">
           <img src="https://picsum.photos/800/450?random=50" alt="Featured" className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
           <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 to-transparent">
               <span className="bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded w-fit mb-2">WEBINAR</span>
               <h3 className="text-white font-bold text-xl">Managing Endometriosis: Expert Panel</h3>
               <div className="flex items-center gap-2 text-slate-300 text-sm mt-1">
                   <Clock size={14} /> 45 min
               </div>
           </div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-sm p-4 rounded-full text-white group-hover:scale-110 transition-transform">
               <PlayCircle size={40} fill="white" className="text-transparent" />
           </div>
       </div>

       {/* Article List */}
       <div>
           <h3 className="font-bold text-slate-800 mb-4">Latest Articles</h3>
           <div className="space-y-4">
               {ARTICLES.map(article => (
                   <div key={article.id} className="flex gap-4 bg-white p-3 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                       <img src={article.image} alt={article.title} className="w-24 h-24 rounded-lg object-cover flex-shrink-0" />
                       <div className="flex flex-col justify-between py-1">
                           <span className="text-xs font-bold text-rose-500 uppercase tracking-wide">{article.category}</span>
                           <h4 className="font-bold text-slate-800 text-sm leading-snug">{article.title}</h4>
                           <span className="text-xs text-slate-400 flex items-center gap-1">
                               <Clock size={12} /> {article.readTime} read
                           </span>
                       </div>
                   </div>
               ))}
           </div>
       </div>
    </div>
  );
};

export default LearnHub;