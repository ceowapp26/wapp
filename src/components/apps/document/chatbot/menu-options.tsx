import React from 'react';
import { useStore } from '@/redux/features/apps/document/store';
import SettingsMenu from './settings-menu';
import CollapseOptions from './collapse-options';

const MenuOptions = () => {
  const hideMenuOptions = useStore((state) => state.hideMenuOptions);
  const countTotalTokens = useStore((state) => state.countTotalTokens);
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