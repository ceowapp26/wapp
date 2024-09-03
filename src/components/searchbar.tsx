import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from "lucide-react";

const SearchBar = ({
  value,
  handleChange,
  disabled,
}: {
  value: string;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
}) => {
  const { t } = useTranslation();
  return (
    <form className="relative bottom-2 py-2 w-full">
      <label className="relative block">
        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
          <Search className="h-5 w-5 fill-slate-300" />
        </span>
        <input
          disabled={disabled}
          type='text'
          className="placeholder:italic placeholder:text-slate-400 h-10 w-full py-2 pl-9 pr-3 bg-slate-200 focus:bg-white rounded-md shadow-sm focus:outline-none sm:text-sm"
          placeholder={t('search') as string}
          value={value}
          onChange={(e) => {
            handleChange(e);
          }}
        />
      </label>
    </form>
  );
};

export default SearchBar;

