import { useState, memo } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { generateId } from '../../utils/helpers';

function TodoWidget({ data = {}, onUpdate }) {
  const [todos, setTodos] = useState(data?.todos || []);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      const updated = [...todos, { id: generateId(), text: newTodo, completed: false }];
      setTodos(updated);
      onUpdate({ ...data, todos: updated });
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    const updated = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updated);
    onUpdate({ ...data, todos: updated });
  };

  const removeTodo = (id) => {
    const updated = todos.filter(todo => todo.id !== id);
    setTodos(updated);
    onUpdate({ ...data, todos: updated });
  };

  return (
    <div className="space-y-3">
      <div className="flex space-x-2">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Neue Aufgabe..."
          className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
        />
        <button
          onClick={addTodo}
          className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg group"
          >
            <button
              onClick={() => toggleTodo(todo.id)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                todo.completed
                  ? 'bg-primary-600 border-primary-600'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              {todo.completed && <Check className="w-3 h-3 text-white" />}
            </button>
            <span
              className={`flex-1 text-sm ${
                todo.completed
                  ? 'line-through text-gray-400 dark:text-gray-500'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {todo.text}
            </span>
            <button
              onClick={() => removeTodo(todo.id)}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
            >
              <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
            </button>
          </div>
        ))}
      </div>

      {todos.length === 0 && (
        <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-8">
          Keine Aufgaben vorhanden
        </p>
      )}
    </div>
  );
}

export default memo(TodoWidget);
