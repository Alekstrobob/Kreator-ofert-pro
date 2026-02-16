
import { Service } from './types';

export const AVAILABLE_SERVICES: Service[] = [
  { id: '1', name: 'Catering Premium (Lunch)', category: 'catering', unitPrice: 130, taxRate: 0.08, unit: 'os.', description: 'Pełny lunch z 3 dań, napoje zimne i gorące.' },
  { id: '2', name: 'Przerwa kawowa Standard', category: 'catering', unitPrice: 50, taxRate: 0.08, unit: 'os.', description: 'Kawa, herbata, wybór ciastek, owoce.' },
  { id: '9', name: 'Śniadanie bufetowe', category: 'catering', unitPrice: 60, taxRate: 0.08, unit: 'os.', description: 'Bogaty wybór dań na ciepło i zimno, soki, kawa, herbata.' },
  { id: '10', name: 'Obiad Serwowany', category: 'catering', unitPrice: 95, taxRate: 0.08, unit: 'os.', description: 'Zupa, danie główne, deser oraz woda z cytryną.' },
  { id: '11', name: 'Kolacja Uroczysta', category: 'catering', unitPrice: 120, taxRate: 0.08, unit: 'os.', description: 'Bufet ciepły i zimny, wykwintne desery, napoje.' },
  { id: '12', name: 'Nocleg (Pokój Standard)', category: 'accommodation', unitPrice: 150, taxRate: 0.08, unit: 'os./doba', description: 'Cena za dobę za osobę. Zakwaterowanie w komfortowym pokoju 2-osobowym z łazienką.' },
  { id: '13', name: 'Nocleg (Apartament Premium)', category: 'accommodation', unitPrice: 250, taxRate: 0.08, unit: 'os./doba', description: 'Cena za dobę za osobę. Zakwaterowanie w przestronnym apartamencie z tarasem.' },
  { id: '3', name: 'Wynajem Sali Balowej', category: 'venue', unitPrice: 6000, taxRate: 0.23, unit: 'dzień', description: 'Nagłośnienie, oświetlenie bazowe, projektor.' },
  { id: '4', name: 'DJ & Konferansjer', category: 'entertainment', unitPrice: 4200, taxRate: 0.23, unit: 'usługa', description: 'Oprawa muzyczna i prowadzenie przez 8h.' },
  { id: '5', name: 'Fotograf Eventowy', category: 'entertainment', unitPrice: 2000, taxRate: 0.23, unit: 'usługa', description: 'Relacja foto, min. 150 obrobionych zdjęć.' },
  { id: '6', name: 'Transport Autokarowy', category: 'logistics', unitPrice: 1300, taxRate: 0.08, unit: 'kurs', description: 'Transport osób (stawka 8% na przewóz osób).' },
  { id: '7', name: 'Obsługa Kelnerska', category: 'staff', unitPrice: 400, taxRate: 0.23, unit: 'os./zmiana', description: 'Praca przez 8 godzin.' },
  { id: '8', name: 'Dekoracje Kwiatowe', category: 'venue', unitPrice: 3000, taxRate: 0.23, unit: 'pakiet', description: 'Dekoracja stołów i wejścia.' },
];

export const TAX_RATE = 0.23; // Default fallback tax rate
