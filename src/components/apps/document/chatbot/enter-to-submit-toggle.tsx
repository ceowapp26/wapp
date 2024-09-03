import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDocumentStore } from '@/stores/features/apps/document/store';
import SettingsToggle from './settings-toggle';

const EnterToSubmitToggle = () => {
  const { t } = useTranslation();
  const setEnterToSubmit = useDocumentStore((state) => state.setEnterToSubmit);
  const [isChecked, setIsChecked] = useState<boolean>(
    useDocumentStore.getState().enterToSubmit
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