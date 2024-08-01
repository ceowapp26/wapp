'use client';
import useSWR, { SWRConfig } from 'swr'
import TabsContainer from '../../_components/favorites-page/TabsContainer';
import * as Tabs from '@radix-ui/react-tabs';
import { Suspense } from 'react';
import { Loader } from '@/components/loading';

const fetcher = async ({ entitiesIds, endpoint }) => {
    const promises = entitiesIds.map(async (id) => {
        const res = await fetch(endpoint + '/' + id);
        return res.json();
    });
    return await Promise.all(promises);
};

const FavoritesPage = () => {
    return (
        <Tabs.Root
            className='min-h-screen'
            defaultValue='tracks'
        >
            <Tabs.List className='tablist'>
                <Tabs.Trigger value='tracks'>Tracks</Tabs.Trigger>
                <Tabs.Trigger value='albums'>Albums</Tabs.Trigger>
                <Tabs.Trigger value='radio'>Radio</Tabs.Trigger>
                <Tabs.Trigger value='artists'>Artists</Tabs.Trigger>
                <Tabs.Trigger value='playlists'>Playlists</Tabs.Trigger>
            </Tabs.List>

            <Suspense fallback={<Loader />}>
                <SWRConfig
                    value={{
                        fetcher,
                        suspense: true
                    }}
                >
                    <TabsContainer />
                </SWRConfig>
            </Suspense>
        </Tabs.Root>
    );
};

export default FavoritesPage;
