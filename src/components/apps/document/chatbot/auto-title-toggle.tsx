import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDocumentStore } from '@/stores/features/apps/document/store';
import SettingsToggle from './settings-toggle';

const AutoTitleToggle = () => {
  const { t } = useTranslation();
  const setAutoTitle = useDocumentStore((state) => state.setAutoTitle);
  const [isChecked, setIsChecked] = useState<boolean>(
    useDocumentStore.getState().autoTitle
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