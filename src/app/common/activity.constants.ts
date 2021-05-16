import { Registry } from '../types/registry';

export const ASCENT_TYPES: Registry[] = [
  { value: 'onsight', label: 'Na pogled', color: 'green' },
  { value: 'flash', label: 'Flash', color: 'green' },
  { value: 'redpoint', label: 'Z rdečo piko', color: 'green' },
  { value: 'repeat', label: 'Ponovitev', color: 'green' },
  { value: 'allfree', label: 'Vse prosto', color: 'yellow' },
  { value: 'aid', label: 'Tehnično plezanje', color: 'yellow' },
  { value: 'attempt', label: 'Neuspel poskus', color: 'yellow' },
];

export const PUBLISH_OPTIONS: any[] = [
  { value: 'public', label: 'Objavi povsod' },
  { value: 'club', label: 'Samo za prijatelje' },
  { value: 'log', label: 'Javno na mojem profilu' },
  { value: 'private', label: 'Samo zame' },
];

export const ACTIVITY_TYPES: any[] = [
  { value: 'crag', label: 'Dan v plezališču' },
  { value: 'climbingGym', label: 'Plezalni center' },
  { value: 'trainingGym', label: 'Telovadnica' },
  { value: 'peak', label: 'Osvojen vrh' },
  { value: 'iceFall', label: 'Slap' },
  { value: 'other', label: 'Ostalo' },
];
