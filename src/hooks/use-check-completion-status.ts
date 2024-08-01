"use client";

import React, { useState, useCallback } from "react";

export const useCheckCompletionStatus = () => {
  const [status, setStatus] = useState<string>('');

  const parseResponse = useCallback((responseText: string) => {
    if (responseText.includes('Input Error')) {
      setStatus('input_error');
    } else if (responseText.includes('Schema Error')) {
      setStatus('schema_error');
    } else {
      setStatus('ok');
    }
  }, []);

  return { status, parseResponse };
};
