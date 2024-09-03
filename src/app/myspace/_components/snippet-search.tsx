import React, { useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash';
import SearchBar from '@/components/searchbar';

const SnippetSearch = ({
  filter,
  setFilter,
}: {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [_filter, _setFilter] = useState<string>(filter);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    _setFilter(e.target.value);
  };

  const debouncedUpdateFilter = useRef(
    debounce((f) => {
      setFilter(f);
    }, 500)
  ).current;

  useEffect(() => {
    debouncedUpdateFilter(_filter);
  }, [_filter]);

  return (
    <SearchBar
      value={_filter}
      handleChange={handleChange}
    />
  );
};

export default SnippetSearch;