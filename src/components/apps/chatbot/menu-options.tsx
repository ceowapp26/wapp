import React from 'react';
import { usePortalStore } from '@/stores/features/apps/portal/store';
import SettingsMenu from './settings-menu';
import CollapseOptions from './collapse-options';

const MenuOptions = () => {
  const hideMenuOptions = usePortalStore((state) => state.hideMenuOptions);
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