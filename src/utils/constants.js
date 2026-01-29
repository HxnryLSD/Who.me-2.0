export const WIDGET_TYPES = {
  BOOKMARK: 'bookmark',
  BOOKMARK_LIST: 'bookmark-list',
  TODO: 'todo',
  NOTE: 'note',
  WEATHER: 'weather',
  CLOCK: 'clock',
  RSS: 'rss'
};

export const DEFAULT_TABS = [
  {
    id: 'tab-1',
    name: 'Arbeit',
    widgets: [],
    layouts: { lg: [] }
  },
  {
    id: 'tab-2',
    name: 'Privat',
    widgets: [],
    layouts: { lg: [] }
  },
  {
    id: 'tab-3',
    name: 'Recherche',
    widgets: [],
    layouts: { lg: [] }
  }
];

export const DEFAULT_WIDGET_SIZES = {
  [WIDGET_TYPES.BOOKMARK]: { w: 2, h: 1, minW: 1, minH: 1 },
  [WIDGET_TYPES.BOOKMARK_LIST]: { w: 3, h: 3, minW: 2, minH: 2 },
  [WIDGET_TYPES.TODO]: { w: 3, h: 4, minW: 2, minH: 3 },
  [WIDGET_TYPES.NOTE]: { w: 3, h: 3, minW: 2, minH: 2 },
  [WIDGET_TYPES.WEATHER]: { w: 2, h: 2, minW: 2, minH: 2 },
  [WIDGET_TYPES.CLOCK]: { w: 2, h: 1, minW: 2, minH: 1 },
  [WIDGET_TYPES.RSS]: { w: 4, h: 4, minW: 3, minH: 3 }
};

export const GRID_COLS = 10;
export const GRID_ROW_HEIGHT = 80;
