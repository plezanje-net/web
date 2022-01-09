import { Registry } from '../types/registry';
import { AscentType } from '../types/ascent-type';

export enum PublishOptionsEnum {
  public = 'public',
  club = 'club',
  log = 'log',
  private = 'private',
}

export const ASCENT_TYPES: AscentType[] = [
  {
    value: 'onsight',
    label: 'Na pogled',
    color: 'green',
    topRope: false,
    tick: true,
  },
  {
    value: 'flash',
    label: 'Flash',
    color: 'green',
    topRope: false,
    tick: true,
  },
  {
    value: 'redpoint',
    label: 'Z rdečo piko',
    color: 'green',
    topRope: false,
    tick: true,
  },
  {
    value: 'repeat',
    label: 'Ponovitev',
    color: 'green',
    topRope: false,
    tick: true,
  },
  {
    value: 'allfree',
    label: 'Vse prosto',
    color: 'yellow',
    topRope: false,
    tick: false,
  },
  {
    value: 'aid',
    label: 'Tehnično plezanje',
    color: 'yellow',
    topRope: false,
    tick: false,
  },
  {
    value: 'attempt',
    label: 'Neuspel poskus',
    color: 'yellow',
    topRope: false,
    tick: false,
  },
  {
    value: 't_onsight',
    label: 'Na pogled',
    color: 'green',
    topRope: true,
    tick: false,
  },
  {
    value: 't_flash',
    label: 'Flash',
    color: 'green',
    topRope: true,
    tick: false,
  },
  {
    value: 't_redpoint',
    label: 'Z rdečo piko',
    color: 'green',
    topRope: true,
    tick: false,
  },
  {
    value: 't_repeat',
    label: 'Ponovitev',
    color: 'green',
    topRope: true,
    tick: false,
  },
  {
    value: 't_allfree',
    label: 'Vse prosto',
    color: 'yellow',
    topRope: true,
    tick: false,
  },
  {
    value: 't_aid',
    label: 'Tehnično plezanje',
    color: 'yellow',
    topRope: true,
    tick: false,
  },
  {
    value: 't_attempt',
    label: 'Neuspel poskus',
    color: 'yellow',
    topRope: true,
    tick: false,
  },
];

export const PUBLISH_OPTIONS: Registry[] = [
  { value: PublishOptionsEnum.public, label: 'Objavi povsod' },
  { value: PublishOptionsEnum.club, label: 'Samo za prijatelje' },
  { value: PublishOptionsEnum.log, label: 'Javno na mojem profilu' },
  { value: PublishOptionsEnum.private, label: 'Samo zame' },
];

export const ACTIVITY_TYPES: Registry[] = [
  { value: 'crag', label: 'Dan v plezališču' },
  { value: 'climbingGym', label: 'Plezalni center' },
  { value: 'trainingGym', label: 'Telovadnica' },
  { value: 'peak', label: 'Osvojen vrh' },
  { value: 'iceFall', label: 'Slap' },
  { value: 'other', label: 'Ostalo' },
];
