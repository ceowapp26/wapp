import React from 'react';
import { useDocumentStore } from '@/stores/features/apps/document/store';
import SettingsMenu from './settings-menu';
import CollapseOptions from './collapse-options';

const MenuOptions = () => {
  const hideMenuOptions = useDocumentStore((state) => state.hideMenuOptions);
  return (
    <>
      <CollapseOptions />
      <div
        className={`${
          hideMenuOptions ? 'max-h-0' : 'max-h-full'
        } overflow-hidden transition-all`}
      >
        <SettingsMenu />
      </div>
    </>
  );
};

export default MenuOptions;