import { BREAKPOINT } from '@angular/flex-layout';

const CUSTOM_BREAKPOINTS = [
  {
    alias: 'xs',
    mediaQuery: 'screen and (min-width: 0px) and (max-width: 599.98px)',
    overlapping: false,
    priority: 1000,
    suffix: 'Xs',
  },
  {
    alias: 'sm',
    mediaQuery: 'screen and (min-width: 600px) and (max-width: 904.98px)',
    overlapping: false,
    priority: 900,
    suffix: 'Sm',
  },
  {
    alias: 'md',
    mediaQuery: 'screen and (min-width: 905px) and (max-width: 1239.98px)',
    overlapping: false,
    priority: 800,
    suffix: 'Md',
  },
  {
    alias: 'lg',
    mediaQuery: 'screen and (min-width: 1240px) and (max-width: 1439.98px)',
    overlapping: false,
    priority: 700,
    suffix: 'Lg',
  },
  {
    alias: 'xl',
    mediaQuery: 'screen and (min-width: 1440px)',
    overlapping: false,
    priority: 600,
    suffix: 'Xl',
  },
  {
    alias: 'lt-sm',
    overlapping: true,
    mediaQuery: 'screen and (max-width: 599.98px)',
    priority: 950,
    suffix: 'LtSm',
  },
  {
    alias: 'lt-md',
    overlapping: true,
    mediaQuery: 'screen and (max-width: 904.98px)',
    priority: 850,
    suffix: 'LtMd',
  },
  {
    alias: 'lt-lg',
    overlapping: true,
    mediaQuery: 'screen and (max-width: 1239.98px)',
    priority: 750,
    suffix: 'LtLg',
  },
  {
    alias: 'lt-xl',
    overlapping: true,
    priority: 650,
    mediaQuery: 'screen and (max-width: 1439.98px)',
    suffix: 'LtXl',
  },

  {
    alias: 'gt-xs',
    overlapping: true,
    mediaQuery: 'screen and (min-width: 600px)',
    priority: -950,
    suffix: 'GtXs',
  },
  {
    alias: 'gt-sm',
    overlapping: true,
    mediaQuery: 'screen and (min-width: 905px)',
    priority: -850,
    suffix: 'GtSm',
  },
  {
    alias: 'gt-md',
    overlapping: true,
    mediaQuery: 'screen and (min-width: 1240px)',
    priority: -750,
    suffix: 'GtMd',
  },
  {
    alias: 'gt-lg',
    overlapping: true,
    mediaQuery: 'screen and (min-width: 1240px)',
    priority: -650,
    suffix: 'GtLg',
  },
];

export const CustomBreakpointsProvider = {
  provide: BREAKPOINT,
  useValue: CUSTOM_BREAKPOINTS,
  multi: true,
};
