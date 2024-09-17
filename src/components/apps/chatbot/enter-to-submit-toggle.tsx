import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePortalStore } from '@/stores/features/apps/portal/store';
import SettingsToggle from './settings-toggle';

const EnterToSubmitToggle = () => {
  const { t } = useTranslation();
  const setEnterToSubmit = usePortalStore((state) => state.setEnterToSubmit);
  const [isChecked, setIsChecked] = useState<boolean>(
    usePortalStore.getState().enterToSubmit
  );
  useEffect(() => {
    setEnterToSubmit(isChecked);
  }, [isChecked]);

  return (
    <SettingsToggle
      label={t('enterToSubmit') as string}
      isChecked={isChecked}
      setIsChecked={setIsChecked}
    />
  );
};

export default EnterToSubmitToggle;