import { memo } from 'react';
import BookmarkWidget from './BookmarkWidget';
import BookmarkListWidget from './BookmarkListWidget';
import TodoWidget from './TodoWidget';
import NoteWidget from './NoteWidget';
import ClockWidget from './ClockWidget';
import WeatherWidget from './WeatherWidget';
import RSSWidget from './RSSWidget';
import { WIDGET_TYPES } from '../../utils/constants';

function WidgetRenderer({ widget, onUpdate }) {
  const renderWidget = () => {
    switch (widget.type) {
      case WIDGET_TYPES.BOOKMARK:
        return <BookmarkWidget data={widget.data} />;
      case WIDGET_TYPES.BOOKMARK_LIST:
        return <BookmarkListWidget data={widget.data} onUpdate={(data) => onUpdate(widget.id, data)} />;
      case WIDGET_TYPES.TODO:
        return <TodoWidget data={widget.data} onUpdate={(data) => onUpdate(widget.id, data)} />;
      case WIDGET_TYPES.NOTE:
        return <NoteWidget data={widget.data} onUpdate={(data) => onUpdate(widget.id, data)} />;
      case WIDGET_TYPES.CLOCK:
        return <ClockWidget data={widget.data} />;
      case WIDGET_TYPES.WEATHER:
        return <WeatherWidget data={widget.data} />;
      case WIDGET_TYPES.RSS:
        return <RSSWidget data={widget.data} />;
      default:
        return <div className="text-gray-500">Unbekannter Widget-Typ</div>;
    }
  };

  return renderWidget();
}

export default memo(WidgetRenderer);
