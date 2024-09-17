import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePortalStore } from '@/stores/features/apps/portal/store';
import SettingsToggle from './settings-toggle';

const InlineLatexToggle = () => {
  const { t } = useTranslation();

  const setInlineLatex = usePortalStore((state) => state.setInlineLatex);

  const [isChecked, setIsChecked] = useState<boolean>(
    usePortalStore.getState().inlineLatex
  );

  useEffect(() => {
    setInlineLatex(isChecked);
  }, [isChecked]);

  return (
    <SettingsToggle
      label={t('inlineLatex') as string}
      isChecked={isChecked}
      setIsChecked={setIsChecked}
    />
  );
};

export default InlineLatexToggle;