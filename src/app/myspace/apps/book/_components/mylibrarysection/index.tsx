"use client";
import React from 'react';
import { SWRConfig } from 'swr';
import TabsContainer from '../mylibrarycontainer/TabsContainer';
import * as Tabs from '@radix-ui/react-tabs';
import { Suspense } from 'react';
import { Loader } from '@/components/loading';
import { useMyspaceContext } from '@/context/myspace-context-provider';
import SearchView from '../searchbar/SearchView';

const MyLibrarySection = () => {
    const { leftSidebarWidth, isAppbarCollapsed } = useMyspaceContext();
    return (
        <div className={`relative flex h-full overflow-y-auto ${isAppbarCollapsed ? 'mt-28' : 'mt-56'}`}>
            <article style={{ marginLeft: `${leftSidebarWidth}px`, width: `calc(100% - ${leftSidebarWidth}px)` }}>
                <SearchView />
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
            </article>
        </div>
    );
};

const swrFetcher = async ({ entitiesIds, endpoint }) => {
    
}

export default MyLibrarySection;
