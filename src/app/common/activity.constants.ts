import { Registry } from '../types/registry';
import { AscentType } from '../types/ascent-type';

export const ASCENT_TYPES: AscentType[] = [
  { value: 'onsight', label: 'Na pogled', color: 'green', topRope: false  },
  { value: 'flash', label: 'Flash', color: 'green', topRope: false  },
  { value: 'redpoint', label: 'Z rdečo piko', color: 'green', topRope: false  },
  { value: 'repeat', label: 'Ponovitev', color: 'green', topRope: false  },
  { value: 'allfree', label: 'Vse prosto', color: 'yellow', topRope: false  },
  { value: 'aid', label: 'Tehnično plezanje', color: 'yellow', topRope: false  },
  { value: 'attempt', label: 'Neuspel poskus', color: 'yellow', topRope: false  },
  { value: 't_onsight', label: 'Na pogled', color: 'green', topRope: true },
  { value: 't_flash', label: 'Flash', color: 'green', topRope: true },
  { value: 't_redpoint', label: 'Z rdečo piko', color: 'green', topRope: true },
  { value: 't_repeat', label: 'Ponovitev', color: 'green', topRope: true },
  { value: 't_allfree', label: 'Vse prosto', color: 'yellow', topRope: true },
  { value: 't_aid', label: 'Tehnično plezanje', color: 'yellow', topRope: true },
  { value: 't_attempt', label: 'Neuspel poskus', color: 'yellow', topRope: true },
];

export const PUBLISH_OPTIONS: Registry[] = [
  { value: 'public', label: 'Objavi povsod' },
  { value: 'club', label: 'Samo za prijatelje' },
  { value: 'log', label: 'Javno na mojem profilu' },
  { value: 'private', label: 'Samo zame' },
];

export const ACTIVITY_TYPES: Registry[] = [
  { value: 'crag', label: 'Dan v plezališču' },
  { value: 'climbingGym', label: 'Plezalni center' },
  { value: 'trainingGym', label: 'Telovadnica' },
  { value: 'peak', label: 'Osvojen vrh' },
  { value: 'iceFall', label: 'Slap' },
  { value: 'other', label: 'Ostalo' },
];
