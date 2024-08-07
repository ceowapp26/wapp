import React, { useEffect, useState } from 'react';
import { useModelStore } from '@/stores/features/models/store';
import SettingToggle from './setting-toggle';

const AutoAdjustTokenToggle = () => {
  const setAutoAdjustToken = useModelStore((state) => state.setAutoAdjustToken);
  const [isChecked, setIsChecked] = useState<boolean>(
    useModelStore.getState().autoAdjustToken
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