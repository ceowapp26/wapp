"use client"
import React from 'react';
import FeatureContainer from '../_components/featurecontainer';
import LofiTrackContainer from '../_components/lofitrackcontainer';
import Banner from '../_components/banner';
import { useMyspaceContext } from '@/context/myspace-context-provider';

export default function MusicLofiPage() {
  const { leftSidebarWidth } = useMyspaceContext();
  return (
    <div className='grid grid-cols-1' style={{ marginLeft: `${leftSidebarWidth}px` }}>
      <Banner />
      <FeatureContainer />
      <LofiTrackContainer />
    </div>
  )
}
