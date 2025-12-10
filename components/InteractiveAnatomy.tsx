
import React, { useState } from 'react';
import { Info, X, Activity } from 'lucide-react';

interface PartInfo {
  id: string;
  name: string;
  description: string;
  function: string;
  commonIssues: string[];
}

const ANATOMY_DATA: Record<string, PartInfo> = {
  uterus: {
    id: 'uterus',
    name: 'Uterus (Womb)',
    description: 'A hollow, pear-shaped organ where a fetus develops during pregnancy.',
    function: 'Nurtures the fertilized ovum that develops into the fetus and holds it till the baby is mature enough for birth.',
    commonIssues: ['Fibroids', 'Endometriosis', 'Polyps']
  },
  ovary_left: {
    id: 'ovary_left',
    name: 'Left Ovary',
    description: 'One of a pair of female glands in which the eggs form and the female hormones estrogen and progesterone are made.',
    function: 'Produces eggs (ova) and reproductive hormones.',
    commonIssues: ['Cysts', 'PCOS', 'Ovarian Cancer']
  },
  ovary_right: {
    id: 'ovary_right',
    name: 'Right Ovary',
    description: 'One of a pair of female glands in which the eggs form and the female hormones estrogen and progesterone are made.',
    function: 'Produces eggs (ova) and reproductive hormones.',
    commonIssues: ['Cysts', 'PCOS', 'Ovarian Cancer']
  },
  fallopian_left: {
    id: 'fallopian_left',
    name: 'Left Fallopian Tube',
    description: 'Tubes that stretch from the uterus to the ovaries, and are part of the female reproductive system.',
    function: 'Transports the egg from the ovary to the uterus (the womb). Fertilization usually happens here.',
    commonIssues: ['Blockage', 'Ectopic Pregnancy', 'Infection']
  },
  fallopian_right: {
    id: 'fallopian_right',
    name: 'Right Fallopian Tube',
    description: 'Tubes that stretch from the uterus to the ovaries, and are part of the female reproductive system.',
    function: 'Transports the egg from the ovary to the uterus (the womb). Fertilization usually happens here.',
    commonIssues: ['Blockage', 'Ectopic Pregnancy', 'Infection']
  },
  cervix: {
    id: 'cervix',
    name: 'Cervix',
    description: 'The lower, narrow end of the uterus that forms a canal between the uterus and vagina.',
    function: 'Allows flow of menstrual blood from the uterus into the vagina, and directs the sperms into the uterus during intercourse.',
    commonIssues: ['Cervicitis', 'Polyps', 'Dysplasia']
  },
  vagina: {
    id: 'vagina',
    name: 'Vagina',
    description: 'An elastic, muscular canal with a soft, flexible lining that provides lubrication and sensation.',
    function: 'Connects the uterus to the outside world. The birth canal.',
    commonIssues: ['Yeast Infections', 'Vaginosis', 'Dryness']
  }
};

const InteractiveAnatomy: React.FC = () => {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  const handlePartClick = (partId: string) => {
    setSelectedPart(partId === selectedPart ? null : partId);
  };

  const getPathClass = (partId: string) => {
    const baseClass = "cursor-pointer transition-all duration-300 stroke-2";
    if (selectedPart === partId) {
      return `${baseClass} fill-rose-400 stroke-rose-600 filter drop-shadow-md opacity-100 scale-105 origin-center`;
    }
    return `${baseClass} fill-rose-100 dark:fill-slate-800 stroke-rose-300 dark:stroke-slate-600 hover:fill-rose-200 dark:hover:fill-slate-700`;
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
      
      {/* Diagram Container */}
      <div className="flex-1 relative min-h-[350px] flex items-center justify-center bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-4">
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <span className="bg-white/80 dark:bg-slate-900/80 backdrop-blur text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <Info size={14} className="text-rose-500" />
                Tap on organs to explore
            </span>
        </div>

        <svg viewBox="0 0 400 300" className="w-full h-full max-w-lg select-none">
            <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Connecting Lines (Behind) */}
            <path d="M155 120 Q 100 40 60 115" stroke="currentColor" strokeWidth="8" className="text-rose-200 dark:text-slate-700 fill-none" />
            <path d="M245 120 Q 300 40 340 115" stroke="currentColor" strokeWidth="8" className="text-rose-200 dark:text-slate-700 fill-none" />

            {/* Fallopian Left (Interaction Area) */}
            <path 
                d="M155 120 Q 100 40 60 115" 
                className={`${getPathClass('fallopian_left')} stroke-linecap-round`}
                strokeWidth="12"
                fill="none"
                onClick={() => handlePartClick('fallopian_left')}
            />
            
            {/* Fallopian Right (Interaction Area) */}
            <path 
                d="M245 120 Q 300 40 340 115" 
                className={`${getPathClass('fallopian_right')} stroke-linecap-round`}
                strokeWidth="12"
                fill="none"
                onClick={() => handlePartClick('fallopian_right')}
            />

            {/* Ovary Left */}
            <ellipse 
                cx="60" cy="120" rx="22" ry="16" 
                className={getPathClass('ovary_left')}
                onClick={() => handlePartClick('ovary_left')}
            />

            {/* Ovary Right */}
            <ellipse 
                cx="340" cy="120" rx="22" ry="16" 
                className={getPathClass('ovary_right')}
                onClick={() => handlePartClick('ovary_right')}
            />

            {/* Vagina */}
            <path 
                d="M180 220 L 180 270 Q 200 280 220 270 L 220 220 Z" 
                className={getPathClass('vagina')}
                onClick={() => handlePartClick('vagina')}
            />

            {/* Cervix */}
            <path 
                d="M170 190 L 230 190 L 220 220 L 180 220 Z" 
                className={getPathClass('cervix')}
                onClick={() => handlePartClick('cervix')}
            />

            {/* Uterus (Main Body) */}
            <path 
                d="M150 120 Q 200 20 250 120 L 230 190 L 170 190 Z" 
                className={getPathClass('uterus')}
                onClick={() => handlePartClick('uterus')}
            />

            {/* Labels */}
            {selectedPart && (
               <text x="200" y="295" textAnchor="middle" className="text-xs font-bold fill-slate-400 dark:fill-slate-500 uppercase tracking-widest">
                  Frontal View
               </text>
            )}
        </svg>
      </div>

      {/* Info Panel */}
      <div className={`xl:w-80 w-full transition-all duration-500 flex-shrink-0 ${selectedPart ? 'opacity-100 translate-x-0' : 'xl:opacity-50 xl:grayscale'}`}>
         {selectedPart && ANATOMY_DATA[selectedPart] ? (
             <div className="h-full flex flex-col animate-slide-in-right">
                 <div className="flex justify-between items-start mb-4">
                     <div>
                        <h3 className="text-2xl font-bold text-rose-500 dark:text-rose-400 leading-tight">{ANATOMY_DATA[selectedPart].name}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Anatomy Guide</p>
                     </div>
                     <button onClick={() => setSelectedPart(null)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                         <X size={20} className="text-slate-400" />
                     </button>
                 </div>
                 
                 <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                     <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl border border-rose-100 dark:border-rose-900/50">
                         <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-2">Description</h4>
                         <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                             {ANATOMY_DATA[selectedPart].description}
                         </p>
                     </div>

                     <div>
                         <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-2 flex items-center gap-2">
                             <span className="w-2 h-2 bg-indigo-500 rounded-full"></span> Primary Function
                         </h4>
                         <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-4 border-l-2 border-indigo-100 dark:border-slate-800">
                             {ANATOMY_DATA[selectedPart].function}
                         </p>
                     </div>

                     <div>
                         <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-2 flex items-center gap-2">
                             <span className="w-2 h-2 bg-amber-500 rounded-full"></span> Common Issues
                         </h4>
                         <div className="flex flex-wrap gap-2">
                             {ANATOMY_DATA[selectedPart].commonIssues.map(issue => (
                                 <span key={issue} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs rounded-lg font-medium border border-slate-200 dark:border-slate-700">
                                     {issue}
                                 </span>
                             ))}
                         </div>
                     </div>
                 </div>
             </div>
         ) : (
             <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/30 dark:bg-slate-900/30">
                 <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 mb-4 shadow-sm">
                     <Activity size={32} />
                 </div>
                 <h3 className="font-bold text-slate-500 dark:text-slate-400 mb-2">Explore Your Body</h3>
                 <p className="text-sm text-slate-400 dark:text-slate-500">Tap or click any part of the diagram to view detailed health information.</p>
             </div>
         )}
      </div>

    </div>
  );
};

export default InteractiveAnatomy;
