import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '@/redux/features/apps/document/store';
import SettingsToggle from './settings-toggle';

const AdvancedModeToggle = () => {
  const { t } = useTranslation();

  const setAdvancedMode = useStore((state) => state.setAdvancedMode);

  const [isChecked, setIsChecked] = useState<boolean>(
    useStore.getState().advancedMode
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