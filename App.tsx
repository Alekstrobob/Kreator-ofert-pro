
import React, { useState, useCallback, useRef } from 'react';
import { Download, LayoutGrid, Upload as UploadIcon, FileSpreadsheet, Import as ImportIcon } from 'lucide-react';
import { EventForm } from './components/EventForm';
import { ServiceSelector } from './components/ServiceSelector';
import { OfferPreview } from './components/OfferPreview';
import { EventData, SelectedService, Service, CompanyData, OfferData } from './types';
import { AVAILABLE_SERVICES as INITIAL_SERVICES } from './constants';
import { generatePDF } from './services/pdfService';
import { Button } from './components/ui/Button';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [eventData, setEventData] = useState<EventData>({
    title: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    date: '',
    endDate: '',
    location: '',
    attendees: 50,
    kidsUnder3: 0,
    kids4to10: 0,
    kids11to14: 0,
    budget: 0,
    notes: '',
    bannerUrl: null,
  });

  const [companyData, setCompanyData] = useState<CompanyData>({
    name: 'Dwór Staropolski',
    address: 'ul. Parkowa 12, 00-001 Wieś Mała',
    nip: '123-456-78-90',
    website: 'www.dwor-staropolski.pl'
  });

  const [availableServices, setAvailableServices] = useState<Service[]>(INITIAL_SERVICES);
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [isGenerating, setIsGenerating] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);
  const [isGeneratingBanner, setIsGeneratingBanner] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEventChange = useCallback((newData: Partial<EventData>) => {
    setEventData(prev => ({ ...prev, ...newData }));
  }, []);

  const handleCompanyChange = useCallback((newData: Partial<CompanyData>) => {
    setCompanyData(prev => ({ ...prev, ...newData }));
  }, []);

  const addService = useCallback((service: Service) => {
    setSelectedServices(prev => {
      if (prev.find(s => s.id === service.id)) {
        return prev.filter(s => s.id !== service.id);
      }
      return [...prev, { ...service, quantity: 1, isOptional: false, targetGroups: ['adults'] }];
    });
  }, []);

  const handleAddCustomService = useCallback((name: string, price: number, unit: string, taxRate: number) => {
    const customService: SelectedService = {
      id: `custom-${Date.now()}`,
      name,
      unitPrice: price,
      taxRate,
      unit,
      category: 'logistics',
      description: 'Opis nowej usługi...',
      quantity: 1,
      isOptional: false,
      targetGroups: ['adults']
    };
    setSelectedServices(prev => [...prev, customService]);
  }, []);

  const updateAvailableServicePrice = useCallback((id: string, newPrice: number) => {
    setAvailableServices(prev => prev.map(s => s.id === id ? { ...s, unitPrice: newPrice } : s));
  }, []);

  const removeService = useCallback((id: string) => {
    setSelectedServices(prev => prev.filter(s => s.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setSelectedServices(prev => prev.map(s => s.id === id ? { ...s, quantity } : s));
  }, []);

  const updateSelectedPrice = useCallback((id: string, unitPrice: number) => {
    setSelectedServices(prev => prev.map(s => s.id === id ? { ...s, unitPrice } : s));
  }, []);

  const updateServiceDescription = useCallback((id: string, description: string) => {
    setSelectedServices(prev => prev.map(s => s.id === id ? { ...s, description } : s));
  }, []);

  const updateServiceTaxRate = useCallback((id: string, taxRate: number) => {
    setSelectedServices(prev => prev.map(s => s.id === id ? { ...s, taxRate } : s));
  }, []);

  const updateServiceTargetGroups = useCallback((id: string, groups: ('adults' | 'kidsUnder3' | 'kids4to10' | 'kids11to14')[]) => {
    setSelectedServices(prev => prev.map(s => {
      if (s.id !== id) return s;
      
      let newQty = 0;
      groups.forEach(g => {
        if (g === 'adults') newQty += eventData.attendees;
        if (g === 'kidsUnder3') newQty += eventData.kidsUnder3;
        if (g === 'kids4to10') newQty += eventData.kids4to10;
        if (g === 'kids11to14') newQty += eventData.kids11to14;
      });

      return { ...s, targetGroups: groups, quantity: groups.length > 0 ? newQty : s.quantity };
    }));
  }, [eventData]);

  const toggleOptional = useCallback((id: string) => {
    setSelectedServices(prev => prev.map(s => s.id === id ? { ...s, isOptional: !s.isOptional } : s));
  }, []);

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    await generatePDF('offer-document', `Oferta_${eventData.title.replace(/\s+/g, '_') || 'Event'}.pdf`);
    setIsGenerating(false);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => handleEventChange({ bannerUrl: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const downloadCSVTemplate = () => {
    const headers = "Nazwa;Kategoria (catering/venue/entertainment/accommodation);Cena Brutto;VAT (np. 0.08);Jednostka;Opis;Ilosc;Grupy (dorosli/dzieci3/dzieci4-10/dzieci11-14)\n";
    const example1 = "Catering Weselny;catering;180;0.08;os.;Wykwintne menu 5-daniowe;1;dorosli,dzieci4-10,dzieci11-14\n";
    const example2 = "Nocleg (Pokój Standard);accommodation;150;0.08;os./doba;Cena za dobę za osobę. Zakwaterowanie w pokoju 2-os.;1;dorosli\n";
    
    // Add UTF-8 BOM for Excel
    const blob = new Blob(["\uFEFF" + headers + example1 + example2], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "szablon_oferty_pro.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      
      if (file.name.endsWith('.json')) {
        try {
          const imported: OfferData = JSON.parse(content);
          if (imported.event) setEventData(imported.event);
          if (imported.company) setCompanyData(imported.company);
          if (imported.services) setSelectedServices(imported.services);
          alert("Pomyślnie zaimportowano plik JSON.");
        } catch (err) {
          alert("Błąd podczas odczytu pliku JSON.");
        }
      } else if (file.name.endsWith('.csv')) {
        const lines = content.split('\n');
        const newServices: SelectedService[] = [];
        const validCategories = ['catering', 'venue', 'entertainment', 'logistics', 'staff', 'accommodation'];
        
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line || line.startsWith('Nazwa')) continue;
          
          const parts = line.includes(';') ? line.split(';') : line.split(',');
          if (parts.length >= 4) {
            const rawCat = parts[1]?.toLowerCase().trim();
            const category = validCategories.includes(rawCat) ? rawCat : 'catering';
            
            // Handle VAT formats: 0.23, 23, 23%
            let taxRate = parseFloat(parts[3]?.replace('%', '')) || 0.23;
            if (taxRate > 1) taxRate = taxRate / 100;

            // Handle Groups
            const rawGroups = parts[7]?.toLowerCase() || 'dorosli';
            const targetGroups: any[] = [];
            if (rawGroups.includes('dorosli')) targetGroups.push('adults');
            if (rawGroups.includes('dzieci3')) targetGroups.push('kidsUnder3');
            if (rawGroups.includes('dzieci4-10')) targetGroups.push('kids4to10');
            if (rawGroups.includes('dzieci11-14')) targetGroups.push('kids11to14');
            
            // If empty groups but looks like a per-person service, default to adults
            if (targetGroups.length === 0 && (category === 'catering' || category === 'accommodation')) {
                targetGroups.push('adults');
            }

            newServices.push({
              id: `import-${Date.now()}-${i}`,
              name: parts[0]?.trim() || 'Bez nazwy',
              category: category as any,
              unitPrice: parseFloat(parts[2]?.replace(',', '.')) || 0,
              taxRate: taxRate,
              unit: parts[4]?.trim() || 'usługa',
              description: parts[5]?.trim() || '',
              quantity: parseInt(parts[6]) || 1,
              isOptional: false,
              targetGroups: targetGroups
            });
          }
        }
        
        if (newServices.length > 0) {
          setSelectedServices(prev => [...prev, ...newServices]);
          alert(`Zaimportowano ${newServices.length} usług. Pamiętaj, aby zweryfikować ilości i grupy docelowe.`);
        } else {
          alert("Nie znaleziono poprawnych danych w pliku CSV. Sprawdź czy używasz średników lub przecinków.");
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const generateAILogo = async () => {
    setIsGeneratingLogo(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Elegant, minimalist line art logo for a countryside manor called "${companyData.name}". Botanical motif, earthy tones, cream background.`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
      });
      
      const candidate = response.candidates?.[0];
      if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            setLogoUrl(`data:image/png;base64,${part.inlineData.data}`);
            break;
          }
        }
      }
    } catch (error) {
      console.error("AI Error:", error);
      alert("Błąd AI podczas generowania logo.");
    } finally {
      setIsGeneratingLogo(false);
    }
  };

  const generateAIBanner = async () => {
    setIsGeneratingBanner(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Cinematic, wide-angle professional photograph of an elegant garden party at a classic polish manor house. Sunset golden hour lighting, blurred background of white roses and fine dining tables. High-end lifestyle photography, luxurious atmosphere. No people.`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio: "16:9" } }
      });
      
      const candidate = response.candidates?.[0];
      if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            handleEventChange({ bannerUrl: `data:image/png;base64,${part.inlineData.data}` });
            break;
          }
        }
      }
    } catch (error) {
      console.error("AI Error:", error);
      alert("Błąd AI podczas generowania baneru.");
    } finally {
      setIsGeneratingBanner(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="sticky top-0 z-50 bg-white border-b shadow-sm h-16 flex items-center px-6 justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-[#1b3022] p-2 rounded-lg text-white">
            <LayoutGrid size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#1b3022]">
            EventOffer Pro <span className="text-[#b08d57] font-normal text-sm ml-2">v2.5</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'editor' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'
              }`}
            >
              Konfiguracja
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'preview' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'
              }`}
            >
              Podgląd
            </button>
          </div>
          
          <Button 
            onClick={handleDownloadPDF} 
            disabled={isGenerating || selectedServices.length === 0}
            className="hidden md:flex bg-[#1b3022] hover:bg-[#2a4533]"
          >
            <Download size={18} /> {isGenerating ? '...' : 'Eksportuj PDF'}
          </Button>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className={`lg:col-span-7 space-y-8 ${activeTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
          <div className="bg-[#f5f2ed] rounded-2xl border border-[#b08d57]/20 p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg text-[#b08d57]">
                <ImportIcon size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1b3022] uppercase tracking-wider">Narzędzia i Import</h4>
                <p className="text-[10px] text-[#1b3022]/60 italic">Wgraj listę usług lub pełny projekt oferty</p>
              </div>
            </div>
            <div className="flex gap-2">
              <input type="file" ref={fileInputRef} onChange={handleImportFile} accept=".csv,.json" className="hidden" />
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="text-[10px] h-8 bg-white border-[#b08d57]/30 text-[#b08d57]">
                <UploadIcon size={12} /> Importuj dane
              </Button>
              <Button variant="outline" size="sm" onClick={downloadCSVTemplate} className="text-[10px] h-8 bg-white border-[#b08d57]/30 text-[#b08d57]">
                <FileSpreadsheet size={12} /> Pobierz wzór CSV
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <EventForm 
              data={eventData} 
              company={companyData}
              onEventChange={handleEventChange}
              onCompanyChange={handleCompanyChange}
              logoUrl={logoUrl}
              onLogoUpload={handleLogoUpload}
              onGenerateAILogo={generateAILogo}
              isGeneratingLogo={isGeneratingLogo}
              onBannerUpload={handleBannerUpload}
              onGenerateAIBanner={generateAIBanner}
              isGeneratingBanner={isGeneratingBanner}
            />
          </div>

          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <div className="flex flex-wrap justify-between items-center mb-6 border-b pb-4 gap-4">
               <h2 className="text-xl font-semibold text-slate-800">Katalog Usług</h2>
            </div>
            <ServiceSelector 
              availableServices={availableServices}
              selectedServices={selectedServices}
              onAdd={addService}
              onAddCustom={handleAddCustomService}
              onUpdateAvailablePrice={updateAvailableServicePrice}
              onRemove={removeService}
              onUpdateQuantity={updateQuantity}
              onUpdatePrice={updateSelectedPrice}
              onUpdateDescription={updateServiceDescription}
              onUpdateTaxRate={updateServiceTaxRate}
              onUpdateTargetGroups={updateServiceTargetGroups}
              onToggleOptional={toggleOptional}
            />
          </div>
        </div>

        <div className={`lg:col-span-5 flex flex-col items-center ${activeTab === 'editor' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="sticky top-24 w-full">
            <div className="overflow-auto max-h-[calc(100vh-140px)] custom-scrollbar rounded-lg shadow-inner bg-slate-200/50 p-4 lg:p-8 flex justify-center">
              <OfferPreview 
                data={{ event: eventData, company: companyData, services: selectedServices }} 
                logoUrl={logoUrl}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
