import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDocumentStore } from '@/stores/features/apps/document/store';
import SettingsToggle from './settings-toggle';

const InlineLatexToggle = () => {
  const { t } = useTranslation();

  const setInlineLatex = useDocumentStore((state) => state.setInlineLatex);

  const [isChecked, setIsChecked] = useState<boolean>(
    useDocumentStore.getState().inlineLatex
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