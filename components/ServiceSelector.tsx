
import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Layers, PenLine, Type, X, ToggleLeft, ToggleRight, Percent, Banknote, Users } from 'lucide-react';
import { Service, SelectedService } from '../types';
import { Button } from './ui/Button';

interface ServiceSelectorProps {
  availableServices: Service[];
  selectedServices: SelectedService[];
  onAdd: (service: Service) => void;
  onAddCustom: (name: string, price: number, unit: string, taxRate: number) => void;
  onUpdateAvailablePrice: (id: string, price: number) => void;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onUpdatePrice: (id: string, price: number) => void;
  onUpdateDescription: (id: string, description: string) => void;
  onUpdateTaxRate: (id: string, taxRate: number) => void;
  onUpdateTargetGroups: (id: string, groups: ('adults' | 'kidsUnder3' | 'kids4to10' | 'kids11to14')[]) => void;
  onToggleOptional?: (id: string) => void;
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  availableServices,
  selectedServices,
  onAdd,
  onAddCustom,
  onUpdateAvailablePrice,
  onRemove,
  onUpdateQuantity,
  onUpdatePrice,
  onUpdateDescription,
  onUpdateTaxRate,
  onUpdateTargetGroups,
  onToggleOptional,
}) => {
  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState<number | ''>('');
  const [customUnit, setCustomUnit] = useState('usługa');
  const [customTax, setCustomTax] = useState(0.23);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);

  const handleAddCustom = () => {
    if (customName && customPrice !== '') {
      onAddCustom(customName, Number(customPrice), customUnit, customTax);
      setCustomName('');
      setCustomPrice('');
      setCustomUnit('usługa');
      setCustomTax(0.23);
    }
  };

  const toggleGroup = (itemId: string, currentGroups: ('adults' | 'kidsUnder3' | 'kids4to10' | 'kids11to14')[], group: 'adults' | 'kidsUnder3' | 'kids4to10' | 'kids11to14') => {
    if (currentGroups.includes(group)) {
      onUpdateTargetGroups(itemId, currentGroups.filter(g => g !== group));
    } else {
      onUpdateTargetGroups(itemId, [...currentGroups, group]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Catalog */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">
          <Layers size={14} /> Wybierz z Katalogu (Ceny Brutto)
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {availableServices.map((service) => {
            const isSelected = selectedServices.find((s) => s.id === service.id);
            const displayPrice = service.unitPrice ?? 0;
            
            return (
              <div 
                key={service.id}
                className={`p-3 border rounded-xl flex flex-col justify-between transition-all ${
                  isSelected ? 'border-indigo-500 bg-indigo-50/30' : 'hover:border-indigo-300 bg-white shadow-sm'
                }`}
              >
                <div className="flex-1 mb-2">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-slate-800 text-xs">{service.name}</p>
                    <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase">VAT {(service.taxRate * 100).toFixed(0)}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                  <div className="flex items-center gap-1">
                    {editingPriceId === service.id ? (
                      <input
                        type="number"
                        autoFocus
                        defaultValue={displayPrice}
                        onBlur={(e) => {
                          onUpdateAvailablePrice(service.id, parseFloat(e.target.value) || 0);
                          setEditingPriceId(null);
                        }}
                        className="w-16 px-1 py-0.5 text-xs font-bold border rounded outline-none"
                      />
                    ) : (
                      <span className="text-xs font-bold text-indigo-600 cursor-pointer" onClick={() => setEditingPriceId(service.id)}>
                        {displayPrice.toLocaleString()} PLN
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400">/ {service.unit}</span>
                  </div>
                  <Button 
                    onClick={() => onAdd(service)} 
                    variant={isSelected ? 'danger' : 'primary'} 
                    size="sm"
                    className="h-7 px-3 text-[10px]"
                  >
                    {isSelected ? <><X size={12} /> Zrezygnuj</> : <><Plus size={12} /> Dodaj</>}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual Entry */}
      <div className="bg-[#fdfaf6] p-4 rounded-2xl border border-dashed border-[#b08d57]/30">
        <div className="flex items-center gap-2 text-xs font-bold text-[#b08d57] uppercase tracking-widest mb-3">
          <PenLine size={14} /> Nowa Usługa Niestandardowa
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Nazwa</label>
            <input type="text" placeholder="Nazwa" value={customName} onChange={(e) => setCustomName(e.target.value)} className="w-full px-3 py-2 text-xs border rounded-lg" />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Cena Brutto</label>
            <input type="number" placeholder="Cena Brutto" value={customPrice} onChange={(e) => setCustomPrice(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full px-3 py-2 text-xs border rounded-lg" />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">VAT</label>
            <select value={customTax} onChange={(e) => setCustomTax(parseFloat(e.target.value))} className="w-full px-3 py-2 text-xs border rounded-lg bg-white">
              <option value={0.23}>23% (Standard)</option>
              <option value={0.08}>8% (Gastronomia/Nocleg)</option>
              <option value={0.05}>5%</option>
              <option value={0}>0% / zw.</option>
            </select>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Jedn.</label>
              <input type="text" placeholder="Jedn." value={customUnit} onChange={(e) => setCustomUnit(e.target.value)} className="w-full px-3 py-2 text-xs border rounded-lg" />
            </div>
            <Button onClick={handleAddCustom} disabled={!customName || customPrice === ''} className="h-9 px-4 shrink-0 bg-[#b08d57] text-white text-xs self-end">Dodaj</Button>
          </div>
        </div>
      </div>

      {/* Selected Items */}
      {selectedServices.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Zawartość Oferty</h3>
          <div className="space-y-3">
            {selectedServices.map((item) => {
              const itemTargetGroups = item.targetGroups || [];
              
              return (
                <div key={item.id} className={`bg-white border rounded-xl p-4 shadow-sm transition-opacity ${item.isOptional ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                      {item.isOptional && <span className="text-[8px] bg-[#b08d57] text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">Opcjonalna</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onToggleOptional?.(item.id)}
                        className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${item.isOptional ? 'text-[#b08d57]' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        {item.isOptional ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                      </button>
                      <Button onClick={() => onRemove(item.id)} variant="danger" className="p-1.5 h-8 w-8 bg-transparent border-none text-red-400 hover:text-red-600"><Trash2 size={16} /></Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Destination Groups Selectors */}
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                       <label className="flex items-center gap-1 text-[9px] uppercase font-bold text-slate-400 mb-2">
                         <Users size={10} /> Przeznaczenie (Synchronizacja z gośćmi)
                       </label>
                       <div className="flex flex-wrap gap-2">
                         <button 
                            onClick={() => toggleGroup(item.id, itemTargetGroups, 'adults')}
                            className={`px-2 py-1 rounded text-[10px] font-medium transition-colors border ${itemTargetGroups.includes('adults') ? 'bg-[#1b3022] text-white border-[#1b3022]' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                         >
                           Dorośli
                         </button>
                         <button 
                            onClick={() => toggleGroup(item.id, itemTargetGroups, 'kidsUnder3')}
                            className={`px-2 py-1 rounded text-[10px] font-medium transition-colors border ${itemTargetGroups.includes('kidsUnder3') ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                         >
                           Dzieci &lt; 3
                         </button>
                         <button 
                            onClick={() => toggleGroup(item.id, itemTargetGroups, 'kids4to10')}
                            className={`px-2 py-1 rounded text-[10px] font-medium transition-colors border ${itemTargetGroups.includes('kids4to10') ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                         >
                           Dzieci 4-10
                         </button>
                         <button 
                            onClick={() => toggleGroup(item.id, itemTargetGroups, 'kids11to14')}
                            className={`px-2 py-1 rounded text-[10px] font-medium transition-colors border ${itemTargetGroups.includes('kids11to14') ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                         >
                           Dzieci 11-14
                         </button>
                       </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Type size={14} className="text-slate-400" />
                      <textarea 
                        value={item.description}
                        onChange={(e) => onUpdateDescription(item.id, e.target.value)}
                        placeholder="Opis usługi..."
                        className="flex-1 text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-300 outline-none resize-none"
                        rows={1}
                      />
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 gap-4">
                      <div className="flex flex-wrap items-center gap-4">
                        {/* Quantity Selector */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] uppercase font-bold text-slate-400">Ilość</label>
                          <div className="flex items-center border rounded-lg bg-slate-50 h-8">
                            <button onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))} className="px-2 hover:bg-slate-200 h-full transition-colors"><ChevronDown size={14} /></button>
                            <input type="number" value={item.quantity} onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value) || 1)} className="w-10 text-center bg-transparent text-xs font-bold" />
                            <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="px-2 hover:bg-slate-200 h-full transition-colors"><ChevronUp size={14} /></button>
                          </div>
                        </div>

                        {/* Price Unit Editor */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] uppercase font-bold text-slate-400">Cena j. Brutto</label>
                          <div className="flex items-center gap-2 bg-slate-50 border rounded-lg h-8 px-2">
                            <Banknote size={14} className="text-slate-400" />
                            <input 
                              type="number" 
                              value={item.unitPrice} 
                              onChange={(e) => onUpdatePrice(item.id, parseFloat(e.target.value) || 0)} 
                              className="w-20 bg-transparent text-xs font-bold outline-none" 
                            />
                            <span className="text-[10px] text-slate-400">PLN</span>
                          </div>
                        </div>
                        
                        {/* Tax Rate Selector */}
                        <div className="flex flex-col gap-1">
                           <label className="text-[9px] uppercase font-bold text-slate-400">Stawka VAT</label>
                           <div className="flex items-center gap-2 bg-slate-100 px-2 h-8 rounded-lg border border-slate-200">
                             <Percent size={12} className="text-slate-400" />
                             <select 
                              value={item.taxRate} 
                              onChange={(e) => onUpdateTaxRate(item.id, parseFloat(e.target.value))}
                              className="bg-transparent text-[10px] font-bold outline-none"
                             >
                               <option value={0.23}>23%</option>
                               <option value={0.08}>8%</option>
                               <option value={0.05}>5%</option>
                               <option value={0}>0%</option>
                             </select>
                           </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className={`text-xs font-bold ${item.isOptional ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                          {(item.quantity * item.unitPrice).toLocaleString()} PLN Brutto
                        </p>
                        {item.isOptional && <p className="text-[9px] text-[#b08d57] font-bold">NIE WLICZONO</p>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
