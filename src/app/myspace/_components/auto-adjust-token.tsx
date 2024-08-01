import React, { useEffect, useState } from 'react';
import { useStore } from '@/redux/features/apps/document/store';
import SettingToggle from './setting-toggle';

const AutoAdjustTokenToggle = () => {
  const setAutoAdjustToken = useStore((state) => state.setAutoAdjustToken);
  const [isChecked, setIsChecked] = useState<boolean>(
    useStore.getState().autoAdjustToken
  );

  useEffect(() => {
    setAutoAdjustToken(isChecked);
  }, [isChecked, setAutoAdjustToken]);

  return (
    <SettingToggle
      label="Auto Adjustment"
      isChecked={isChecked}
      setIsChecked={setIsChecked}
    />
  );
};

export default AutoAdjustTokenToggle;