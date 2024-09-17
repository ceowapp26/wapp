import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePortalStore } from '@/stores/features/apps/portal/store';
import SettingsToggle from './settings-toggle';

const AutoTitleToggle = () => {
  const { t } = useTranslation();
  const setAutoTitle = usePortalStore((state) => state.setAutoTitle);
  const [isChecked, setIsChecked] = useState<boolean>(
    usePortalStore.getState().autoTitle
  );

  useEffect(() => {
    setAutoTitle(isChecked);
  }, [isChecked]);

  return (
    <SettingsToggle
      label={t('autoTitle') as string}
      isChecked={isChecked}
      setIsChecked={setIsChecked}
    />
  );
};

export default AutoTitleToggle;