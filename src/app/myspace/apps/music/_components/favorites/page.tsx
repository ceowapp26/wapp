import { SWRConfig } from 'swr';
import { fetchProxyMultipleEntities } from '@/utils/fetchers';
import TabsContainer from '@/components/favorites-page/TabsContainer';
import * as Tabs from '@radix-ui/react-tabs';
import { Suspense } from 'react';
import { Loader } from '@components/ui/loading';

const FavoritesPage = () => {
    return (
        <Tabs.Root className='flex flex-col gap-8 page-container'>
            <Tabs.List className='flex justify-between tablist mb-2vh'>
                <Tabs.Trigger value='tracks' className='text-light font-normal text-base px-4 py-4'>
                    Tracks
                </Tabs.Trigger>
                <Tabs.Trigger value='albums' className='text-light font-normal text-base px-4 py-4'>
                    Albums
                </Tabs.Trigger>
                <Tabs.Trigger value='radio' className='text-light font-normal text-base px-4 py-4'>
                    Radio
                </Tabs.Trigger>
                <Tabs.Trigger value='artists' className='text-light font-normal text-base px-4 py-4'>
                    Artists
                </Tabs.Trigger>
                <Tabs.Trigger value='playlists' className='text-light font-normal text-base px-4 py-4'>
                    Playlists
                </Tabs.Trigger>
            </Tabs.List>

            <Suspense fallback={<Loader />}>
                <SWRConfig
                    value={{
                        fetcher: async ({ entitiesIds, endpoint }) => {
                            const promises = entitiesIds.map(async (id) => {
                                const res = await fetch(endpoint + '/' + id);
                                return res.json();
                            });
                            return await Promise.all(promises);
                        },
                        suspense: true,
                    }}
                >
                    <TabsContainer />
                </SWRConfig>
            </Suspense>
        </Tabs.Root>
    );
};

export default FavoritesPage;
