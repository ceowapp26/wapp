import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePortalStore } from '@/stores/features/apps/portal/store';
import SettingsToggle from './settings-toggle';

const AdvancedModeToggle = () => {
  const { t } = useTranslation();
  const setAdvancedMode = usePortalStore((state) => state.setAdvancedMode);

  const [isChecked, setIsChecked] = useState<boolean>(
    usePortalStore.getState().advancedMode
  );

  useEffect(() => {
    setAdvancedMode(isChecked);
  }, [isChecked]);

  return (
    <SettingsToggle
      label={t('advancedMode') as string}
      isChecked={isChecked}
      setIsChecked={setIsChecked}
    />
  );
};

export default AdvancedModeToggle;