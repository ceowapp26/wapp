"use client"
import React, { useState, useEffect } from 'react';
import { Spinner } from "@/components/spinner";
import dynamic from 'next/dynamic';

const EmailGenerator = dynamic(() => import('../_components/email-generator'), {
  ssr: false,
});

const EmailPage = () => {
  return (
    <React.Fragment>
      <EmailGenerator/ >
    </React.Fragment>
  );
};

export default EmailPage;
