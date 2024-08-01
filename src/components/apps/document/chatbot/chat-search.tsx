import React, { useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash';
import { useStore } from '@/redux/features/apps/document/store';
import SearchBar from '@/components/searchbar';

const ChatSearch = ({
  filter,
  setFilter,
}: {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [_filter, _setFilter] = useState<string>(filter);
  const generating = useStore((state) => state.generating);

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
      disabled={generating}
    />
  );
};

export default ChatSearch;