import { useState } from 'react';

interface GenericSearchFilterProps<T> {
  data: T[]; 
  keys: (keyof T)[]; 
  onFiltered: (filteredData: T[]) => void;
  placeholder?: string;
}

export const GenericSearchFilter = <T,>({
  data,
  keys,
  onFiltered,
  placeholder = 'Buscar...',
}: GenericSearchFilterProps<T>) => {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    const filtered = data.filter(item =>
      keys.some(key =>
        String(item[key])
          .toLowerCase()
          .includes(value.toLowerCase())
      )
    );

    onFiltered(filtered);
  };

  return (
    <input
      type="text"
      value={query}
      onChange={handleChange}
      placeholder={placeholder}
      style={{ padding: '8px', width: '100%', maxWidth: '300px' }}
    />
  );
};
