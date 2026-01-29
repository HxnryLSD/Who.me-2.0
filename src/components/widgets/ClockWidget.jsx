import { useState, useEffect, memo } from 'react';
import { Clock as ClockIcon } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

function ClockWidget({ data = {} }) {
  const [time, setTime] = useState(new Date());
  const timezone = data?.timezone || 'Europe/Berlin';

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <ClockIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {timezone.split('/')[1]}
          </span>
        </div>
        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {format(time, 'HH:mm:ss')}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {format(time, 'EEEE, d. MMMM yyyy', { locale: de })}
        </div>
      </div>
    </div>
  );
}

export default memo(ClockWidget);
