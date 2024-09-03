import { SWRConfig } from 'swr';
import { Suspense } from 'react';
import React from 'react';
import TabsContainer from '@/components/favorites-page/TabsContainer';
import * as Tabs from '@radix-ui/react-tabs';
import { Loader } from '@/components/ui/loading';

const FavoriteResult = () => {
    return (
        <Tabs.Root
            className='page-container tabs-container'
            defaultValue='tracks'
        >
            <Tabs.List className='tablist'>
                <Tabs.Trigger value='favorites'>My Favorite</Tabs.Trigger>
                <Tabs.Trigger value='reading'>Reading</Tabs.Trigger>
                <Tabs.Trigger value='will-read'>Will Read</Tabs.Trigger>
                <Tabs.Trigger value='read'>Read</Tabs.Trigger>
            </Tabs.List>

            <Suspense fallback={ <Loader /> }>
                <SWRConfig
                    value={{
                        fetcher: async ({ entitiesIds, endpoint }) => {
                            const promises = entitiesIds.map(async (id) => {
                                const res = await fetch(endpoint + '/' + id);
                                
                                return res.json();
                            });
                            
                            return await Promise.all(promises);
                        },
                        suspense: true
                    }}
                >
                    <TabsContainer />
                </SWRConfig>
            </Suspense>
        </Tabs.Root>
    );
};

const swrFetcher = async ({ entitiesIds, endpoint }) => {
    
}

export default FavoriteResult;

