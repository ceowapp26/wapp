import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '@/redux/features/apps/document/store';
import SettingsToggle from './settings-toggle';

const InlineLatexToggle = () => {
  const { t } = useTranslation();

  const setInlineLatex = useStore((state) => state.setInlineLatex);

  const [isChecked, setIsChecked] = useState<boolean>(
    useStore.getState().inlineLatex
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