import { useState, memo } from 'react';
import { useDebounce } from '../../hooks/useDebounce';

function NoteWidget({ data = {}, onUpdate }) {
  const [content, setContent] = useState(data?.content || '');

  const debouncedUpdate = useDebounce((value) => {
    onUpdate({ ...data, content: value });
  }, 500);

  const handleChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    debouncedUpdate(newContent);
  };

  return (
    <textarea
      value={content}
      onChange={handleChange}
      placeholder="Notizen hier eingeben..."
      className="w-full h-full resize-none bg-yellow-50 dark:bg-gray-800 border-none outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 text-sm p-0"
      style={{ fontFamily: 'inherit' }}
    />
  );
}

export default memo(NoteWidget);
