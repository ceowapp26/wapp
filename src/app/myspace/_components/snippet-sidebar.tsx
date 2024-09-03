"use client"
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useDocumentStore } from '@/stores/features/apps/document/store';
import { SnippetInterface } from '@/types/snippet';
import SnippetSearch from './snippet-search';
import SnippetItem from './snippet-item';

export const SnippetSidebar: React.FC = () => {
  const currentSnippetIndex = useDocumentStore((state) => state.currentSnippetIndex);
  const snippets = useDocumentStore((state) => state.snippets);
  const [filterSnippets, setFilterSnippets] = useState<string>('');
  const snippetsRef = useRef<SnippetInterface[]>(snippets || []);
  const filterSnippetsRef = useRef<string>(filterSnippets);

  const updateSnippets = useCallback(() => {
    if (!snippets) return [];
    const _filterLowerCase = filterSnippetsRef.current.toLowerCase();
    return snippets.filter(snippet => 
      snippet.snippetName.toLowerCase().includes(_filterLowerCase)
    ).map((snippet, index) => ({
      ...snippet,
      index,
    }));
  }, [snippets]);

  const snippetItems = useMemo(() => updateSnippets(), [updateSnippets, filterSnippets]);

  useEffect(() => {
    updateSnippets();
    const unsubscribe = useDocumentStore.subscribe((state) => {
      if (state.snippets && state.snippets !== snippetsRef.current) {
        updateSnippets();
        snippetsRef.current = state.snippets;
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    filterSnippetsRef.current = filterSnippets;
    updateSnippets();
  }, [filterSnippets]);

  useEffect(() => {
    updateSnippets();
  }, [snippets]);

  return (
    <React.Fragment>
      <Box sx={{ height: '100vh', padding: '12px 16px', marginTop: '64px', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <SnippetSearch filter={filterSnippets} setFilter={setFilterSnippets} />
        <div className='flex flex-col gap-2 text-gray-100 text-sm'>
          {snippetItems.length === 0 ? (
            <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
              No items found.
            </p>
          ) : (
            <React.Fragment>
              {snippetItems.map(({ snippetId, cloudSnippetId, snippetName, content, index }) => (
                <SnippetItem snippetId={snippetId} cloudSnippetId={cloudSnippetId} content={content} snippetName={snippetName} snippetIndex={index} key={`${cloudSnippetId}-${snippetId}`} />
              ))}
            </React.Fragment>
          )}
        </div>
        <div className='w-full h-10' />
      </Box>
    </React.Fragment>
  );
};

export default SnippetSidebar;

