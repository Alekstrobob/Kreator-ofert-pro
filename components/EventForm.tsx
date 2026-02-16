
import React from 'react';
import { EventData, CompanyData } from '../types';
import { Button } from './ui/Button';
import { Image as ImageIcon, Sparkles, Upload, Building2, MapPin, Users2, Baby, Layout } from 'lucide-react';

interface EventFormProps {
  data: EventData;
  company: CompanyData;
  onEventChange: (data: Partial<EventData>) => void;
  onCompanyChange: (data: Partial<CompanyData>) => void;
  logoUrl: string | null;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGenerateAILogo: () => void;
  isGeneratingLogo: boolean;
  onBannerUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGenerateAIBanner: () => void;
  isGeneratingBanner: boolean;
}

export const EventForm: React.FC<EventFormProps> = ({ 
  data, 
  company,
  onEventChange, 
  onCompanyChange,
  logoUrl, 
  onLogoUpload, 
  onGenerateAILogo, 
  isGeneratingLogo,
  onBannerUpload,
  onGenerateAIBanner,
  isGeneratingBanner
}) => {
  const handleEventField = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    onEventChange({ [name]: type === 'number' ? parseFloat(value) || 0 : value });
  };

  const handleCompanyField = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onCompanyChange({ [name]: value });
  };

  const logoInputRef = React.useRef<HTMLInputElement>(null);
  const bannerInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-8">
      {/* Visual Identity Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-[#1b3022] flex items-center gap-2 border-b pb-2">
          <Layout size={20} /> Identyfikacja Wizualna Oferty
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Logo Upload */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-3 tracking-widest">Logo Firmy</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shrink-0">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <ImageIcon className="text-slate-300" size={24} />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <input type="file" ref={logoInputRef} onChange={onLogoUpload} accept="image/*" className="hidden" />
                <Button variant="outline" size="sm" onClick={() => logoInputRef.current?.click()} className="text-[10px] h-8">
                  <Upload size={12} /> Wgraj Logo
                </Button>
                <Button variant="primary" size="sm" onClick={onGenerateAILogo} disabled={isGeneratingLogo} className="text-[10px] h-8 bg-[#1b3022]">
                  <Sparkles size={12} /> {isGeneratingLogo ? 'Generuję...' : 'Logo AI'}
                </Button>
              </div>
            </div>
          </div>

          {/* Banner Upload */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-3 tracking-widest">Zdjęcie Główne (Baner)</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shrink-0">
                {data.bannerUrl ? (
                  <img src={data.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="text-slate-300" size={24} />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <input type="file" ref={bannerInputRef} onChange={onBannerUpload} accept="image/*" className="hidden" />
                <Button variant="outline" size="sm" onClick={() => bannerInputRef.current?.click()} className="text-[10px] h-8">
                  <Upload size={12} /> Wgraj Zdjęcie
                </Button>
                <Button variant="primary" size="sm" onClick={onGenerateAIBanner} disabled={isGeneratingBanner} className="text-[10px] h-8 bg-[#b08d57]">
                  <Sparkles size={12} /> {isGeneratingBanner ? 'Generuję...' : 'Baner AI'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-[#1b3022] flex items-center gap-2 border-b pb-2">
          <Building2 size={20} /> Dane Sprzedawcy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Nazwa Firmy</label>
            <input type="text" name="name" value={company.name} onChange={handleCompanyField} className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#b08d57]/50 outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Adres</label>
            <input type="text" name="address" value={company.address} onChange={handleCompanyField} className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#b08d57]/50 outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">NIP</label>
            <input type="text" name="nip" value={company.nip} onChange={handleCompanyField} className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#b08d57]/50 outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Strona WWW</label>
            <input type="text" name="website" value={company.website} onChange={handleCompanyField} className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#b08d57]/50 outline-none" />
          </div>
        </div>
      </section>

      {/* Guest Structure Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-[#1b3022] flex items-center gap-2 border-b pb-2">
          <Users2 size={20} /> Struktura Gości i Zniżki
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border">
          <div>
            <label className="block text-[10px] font-bold text-[#1b3022] uppercase mb-1 flex items-center gap-1">
               Dorośli
            </label>
            <input type="number" name="attendees" value={data.attendees} onChange={handleEventField} className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#b08d57]/50 outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-indigo-600 uppercase mb-1 flex items-center gap-1">
               Dzieci &lt; 3 (0%)
            </label>
            <input type="number" name="kidsUnder3" value={data.kidsUnder3} onChange={handleEventField} className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#b08d57]/50 outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-indigo-600 uppercase mb-1 flex items-center gap-1">
               Dzieci 4-10 (50%)
            </label>
            <input type="number" name="kids4to10" value={data.kids4to10} onChange={handleEventField} className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#b08d57]/50 outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-indigo-600 uppercase mb-1 flex items-center gap-1">
               Dzieci 11-14 (25%)
            </label>
            <input type="number" name="kids11to14" value={data.kids11to14} onChange={handleEventField} className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#b08d57]/50 outline-none" />
          </div>
        </div>
        <p className="text-[10px] text-slate-500 italic">Zniżki dla dzieci zostaną automatycznie naliczone dla usług z kategorii wyżywienie oraz nocleg.</p>
      </section>

      {/* Event Details Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-[#1b3022] flex items-center gap-2 border-b pb-2">
          <MapPin size={20} /> Szczegóły Wydarzenia
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Tytuł Uroczystości</label>
            <input type="text" name="title" value={data.title} onChange={handleEventField} placeholder="np. Wesele Jana i Anny" className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Nazwisko / Klient</label>
            <input type="text" name="clientName" value={data.clientName} onChange={handleEventField} placeholder="np. Jan Kowalski" className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Lokalizacja</label>
            <input type="text" name="location" value={data.location} onChange={handleEventField} placeholder="np. Sala Kryształowa" className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Telefon Klienta</label>
            <input type="text" name="clientPhone" value={data.clientPhone} onChange={handleEventField} placeholder="np. +48 123 456 789" className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">E-mail Klienta</label>
            <input type="email" name="clientEmail" value={data.clientEmail} onChange={handleEventField} placeholder="np. klient@example.com" className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Data rozpoczęcia</label>
              <input type="date" name="date" value={data.date} onChange={handleEventField} className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Data końcowa</label>
              <input type="date" name="endDate" value={data.endDate} onChange={handleEventField} className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Notatki & Życzenia Specjalne</label>
          <textarea name="notes" value={data.notes} onChange={handleEventField} rows={3} placeholder="Wpisz tutaj szczegóły dotyczące menu, dekoracji lub innych ustaleń..." className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
      </section>
    </div>
  );
};
