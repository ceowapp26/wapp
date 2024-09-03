import { SWRConfig } from 'swr';
import { Suspense } from 'react';
import React from 'react';
import TabsContainer from '../mylibrarycontainer/TabsContainer';
import * as Tabs from '@radix-ui/react-tabs';
import { Loader }from '@/components/ui/loading';

const EditListResult = () => {
    return (
        <Tabs.Root
            className='page-container tabs-container'
            defaultValue='tracks'
        >
            <Tabs.List className='tablist'>
                <Tabs.Trigger value='favorite'>My Favorite</Tabs.Trigger>
                <Tabs.Trigger value='readingnow'>Reading Now</Tabs.Trigger>
                <Tabs.Trigger value='toread'>To Read</Tabs.Trigger>
                <Tabs.Trigger value='haveread'>Have Read</Tabs.Trigger>
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

export default EditListResult;


