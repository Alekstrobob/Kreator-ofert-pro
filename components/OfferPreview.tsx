
import React from 'react';
import { Calendar, MapPin, Users, Leaf, ShieldCheck, Phone, Mail } from 'lucide-react';
import { OfferData, SelectedService } from '../types';

interface OfferPreviewProps {
  data: OfferData;
  logoUrl: string | null;
}

export const OfferPreview: React.FC<OfferPreviewProps> = ({ data, logoUrl }) => {
  const { event, company, services } = data;

  const activeServices = services.filter(s => !s.isOptional);
  const totalGuests = event.attendees + event.kidsUnder3 + event.kids4to10 + event.kids11to14;

  let grossBruttoTotal = 0;
  let totalChildDiscountBrutto = 0;
  const taxBreakdown: Record<number, { netto: number, tax: number, brutto: number }> = {};

  activeServices.forEach(service => {
    const itemFullBrutto = service.unitPrice * service.quantity;
    grossBruttoTotal += itemFullBrutto;

    let itemDiscount = 0;

    if ((service.category === 'catering' || service.category === 'accommodation') && service.targetGroups && service.targetGroups.length > 0) {
      service.targetGroups.forEach(group => {
        let count = 0;
        let discountMultiplier = 0;

        if (group === 'kidsUnder3') { count = event.kidsUnder3; discountMultiplier = 1.0; }
        else if (group === 'kids4to10') { count = event.kids4to10; discountMultiplier = 0.5; }
        else if (group === 'kids11to14') { count = event.kids11to14; discountMultiplier = 0.25; }

        if (count > 0) {
          itemDiscount += (service.unitPrice * count * discountMultiplier);
        }
      });
    }
    
    totalChildDiscountBrutto += itemDiscount;

    const itemFinalBrutto = itemFullBrutto - itemDiscount;
    const rate = service.taxRate;
    const itemNetto = itemFinalBrutto / (1 + rate);
    const itemTax = itemFinalBrutto - itemNetto;

    if (!taxBreakdown[rate]) taxBreakdown[rate] = { netto: 0, tax: 0, brutto: 0 };
    taxBreakdown[rate].netto += itemNetto;
    taxBreakdown[rate].tax += itemTax;
    taxBreakdown[rate].brutto += itemFinalBrutto;
  });

  const finalBruttoTotal = grossBruttoTotal - totalChildDiscountBrutto;

  // Bezpieczne formatowanie daty DD.MM.YYYY
  const formatDate = (dateString: string) => {
    if (!dateString || !dateString.includes('-')) return dateString || '---';
    // dateString jest zawsze w formacie YYYY-MM-DD z inputa typu date
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
  };

  const renderDateRange = () => {
    const start = formatDate(event.date);
    const end = formatDate(event.endDate);
    if (start === '---') return '---';
    if (end === '---' || start === end) return start;
    return `${start} – ${end}`;
  };

  const getTargetGroupsLabels = (groups: string[]) => {
    if (!groups || groups.length === 0) return null;
    const labels: string[] = [];
    if (groups.includes('adults')) labels.push('Dorośli');
    if (groups.includes('kidsUnder3')) labels.push('Dzieci <3');
    if (groups.includes('kids4to10')) labels.push('Dzieci 4-10');
    if (groups.includes('kids11to14')) labels.push('Dzieci 11-14');
    return labels.join(', ');
  };

  return (
    <div id="offer-document" className="bg-[#fdfaf6] shadow-2xl rounded-sm w-full max-w-[210mm] mx-auto min-h-[297mm] flex flex-col text-[#1b3022] border-[12px] border-[#f5f2ed] relative overflow-hidden">
      <div className="absolute inset-4 border border-[#b08d57]/10 pointer-events-none z-20"></div>

      {event.bannerUrl && (
        <div className="relative w-full h-44 overflow-hidden z-10">
          <img src={event.bannerUrl} alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1b3022]/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-4 left-12 z-20">
             <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-normal tracking-tight text-white italic leading-tight drop-shadow-lg">
                Oferta Uroczystości
             </h1>
          </div>
        </div>
      )}

      <div className="px-12 py-8 flex flex-col flex-grow relative z-10">
        {!event.bannerUrl && (
          <div className="mb-6">
            <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl font-normal tracking-tight text-[#1b3022] italic leading-tight">Oferta Uroczystości</h1>
            <p className="text-[#b08d57] font-medium tracking-[0.3em] text-[9px] uppercase mt-1">Przygotowana z dbałością o każdy detal</p>
          </div>
        )}

        <div className={`flex justify-between items-center ${event.bannerUrl ? 'mb-4' : 'mb-8'}`}>
          <div className="flex flex-col">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-32 h-32 object-contain mix-blend-multiply -ml-2" />
            ) : (
              <div className="mb-2 flex items-center gap-2">
                <Leaf size={24} className="text-[#b08d57]" />
                <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold tracking-widest text-[#1b3022] uppercase">
                  {company.name}
                </h2>
              </div>
            )}
          </div>

          <div className="text-right flex flex-col items-end pt-1">
            <p className="font-bold text-[10px] uppercase tracking-[0.1em] text-[#1b3022]">{company.name}</p>
            <div className="space-y-0.5 mt-1">
              <p className="text-[9px] text-[#1b3022]/70 leading-none">{company.address}</p>
              <p className="text-[9px] text-[#1b3022]/70 leading-none">NIP: {company.nip}</p>
              <p className="text-[10px] text-[#b08d57] font-bold tracking-wider">{company.website}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 mb-8 border-y border-[#b08d57]/20 py-4">
          <div className="col-span-7">
            <h3 className="text-[7px] font-bold text-[#b08d57] uppercase tracking-[0.2em] mb-2">Przygotowano dla:</h3>
            <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-bold text-[#1b3022] mb-0.5">{event.clientName || 'Szanowni Państwo'}</p>
            <p className="text-[#630d0d] font-medium italic text-xs mb-2">{event.title || 'Przyjęcie w Dworku'}</p>
            <div className="flex flex-col gap-1">
              {event.clientPhone && (
                <div className="flex items-center gap-2 text-[9px] text-[#1b3022]/80">
                  <Phone size={9} className="text-[#b08d57]" />
                  <span>{event.clientPhone}</span>
                </div>
              )}
              {event.clientEmail && (
                <div className="flex items-center gap-2 text-[9px] text-[#1b3022]/80">
                  <Mail size={9} className="text-[#b08d57]" />
                  <span>{event.clientEmail}</span>
                </div>
              )}
            </div>
          </div>
          <div className="col-span-5 flex flex-col justify-center space-y-2 border-l border-[#b08d57]/20 pl-6">
             <div className="flex items-center gap-2 text-[11px]">
                <Calendar size={11} className="text-[#b08d57]" />
                <span className="font-medium">{renderDateRange()}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <MapPin size={11} className="text-[#b08d57]" />
                <span className="font-medium italic">{event.location || 'Nasza posiadłość'}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-bold">
                <Users size={11} className="text-[#b08d57]" />
                <span>Łącznie: {totalGuests} osób</span>
              </div>
          </div>
        </div>

        <div className="flex-grow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#1b3022]/10 text-left">
                <th className="py-2 px-4 text-[7px] font-bold uppercase tracking-widest text-[#b08d57]">Specyfikacja usług</th>
                <th className="py-2 px-2 text-[7px] font-bold uppercase tracking-widest text-[#b08d57] text-center">Ilość</th>
                <th className="py-2 px-2 text-[7px] font-bold uppercase tracking-widest text-[#b08d57] text-right">Cena j.</th>
                <th className="py-2 px-4 text-[7px] font-bold uppercase tracking-widest text-[#b08d57] text-right">Wartość</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#b08d57]/5">
              {activeServices.map((service) => (
                <tr key={service.id} className="group">
                  <td className="py-3 px-4">
                    <p className="text-[11px] font-bold text-[#1b3022]">{service.name}</p>
                    {service.description && <p className="text-[9px] text-[#1b3022]/60 mt-0.5 leading-tight">{service.description}</p>}
                    {service.targetGroups && service.targetGroups.length > 0 && (
                      <p className="text-[8px] text-[#b08d57] font-medium mt-1">Dla: {getTargetGroupsLabels(service.targetGroups)}</p>
                    )}
                  </td>
                  <td className="py-3 px-2 text-center text-[10px] text-[#1b3022]/80">{service.quantity} {service.unit}</td>
                  <td className="py-3 px-2 text-right text-[10px] text-[#1b3022]/80">{service.unitPrice.toLocaleString()} PLN</td>
                  <td className="py-3 px-4 text-right text-[10px] font-bold text-[#1b3022]">
                    {(service.quantity * service.unitPrice).toLocaleString()} PLN
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 pt-6 border-t-2 border-[#1b3022]">
           <div className="flex justify-between items-start">
             <div className="w-1/2">
                <div className="bg-white p-4 rounded-lg border border-[#b08d57]/10">
                   <h4 className="text-[8px] font-bold uppercase tracking-wider text-[#b08d57] mb-2 flex items-center gap-2">
                     <ShieldCheck size={10} /> Podsumowanie stawek VAT
                   </h4>
                   <div className="space-y-1">
                      {Object.entries(taxBreakdown).map(([rate, vals]) => (
                        <div key={rate} className="flex justify-between text-[9px]">
                          <span className="text-[#1b3022]/60">Stawka {(parseFloat(rate)*100).toFixed(0)}%:</span>
                          <span className="font-medium text-[#1b3022]">{vals.brutto.toLocaleString()} PLN Brutto</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
             <div className="w-1/3 flex flex-col items-end">
                <p className="text-[9px] font-bold text-[#b08d57] uppercase tracking-[0.2em] mb-1">Razem do zapłaty</p>
                <p className="text-3xl font-bold text-[#1b3022] leading-none mb-1">{finalBruttoTotal.toLocaleString()} PLN</p>
                <p className="text-[9px] text-[#1b3022]/50 italic">Cena zawiera podatek VAT. Oferta ważna przez 14 dni.</p>
             </div>
           </div>
        </div>

        <div className="mt-12 text-center">
           <p className="text-[9px] text-[#b08d57] italic">Dziękujemy za zaufanie. Zrobimy wszystko, aby Państwa uroczystość była wyjątkowa.</p>
           <div className="flex justify-center gap-8 mt-4">
              <div className="w-24 h-px bg-[#b08d57]/20"></div>
              <div className="w-24 h-px bg-[#b08d57]/20"></div>
           </div>
        </div>
      </div>
    </div>
  );
};
