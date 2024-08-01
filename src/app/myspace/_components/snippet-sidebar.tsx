import React, { useState, useEffect, useRef } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useStore } from '@/redux/features/apps/document/store';
import { SnippetInterface } from '@/types/snippet';
import SnippetSearch from './snippet-search';
import SnippetItem from './snippet-item';

export const SnippetSidebar: React.FC = () => {
  const currentSnippetIndex = useStore((state) => state.currentSnippetIndex);
  const snippets = useStore((state) => state.snippets);

  const [snippetItems, setSnippetItems] = useState<SnippetInterface[]>([]);
  const [filterSnippets, setFilterSnippets] = useState<string>('');

  const snippetsRef = useRef<SnippetInterface[]>(snippets || []);
  const filterSnippetsRef = useRef<string>(filterSnippets);

  const updateSnippets = () => {
    const _snippetsArr: SnippetInterface[] = [];
    const _snippets = useStore.getState().snippets;
    if (!_snippets) return;
    _snippets.forEach((snippet, index) => {
      const _filterLowerCase = filterSnippetsRef.current.toLowerCase();
      const _snippetName = snippet.snippetName.toLowerCase();
      if (!_snippetName.includes(_filterLowerCase)) return;
      _snippetsArr.push({
        snippetId: snippet.snippetId,
        cloudSnippetId: snippet.cloudSnippetId,
        snippetName: snippet.snippetName,
        content: snippet.content,
        expanded: snippet.expanded,
        color: snippet.color,
        order: snippet.order,
        isArchived: snippet.isArchived,
        index: index,
      });
    });
    setSnippetItems(_snippetsArr);
  };

  useEffect(() => {
    updateSnippets();
    const unsubscribe = useStore.subscribe((state) => {
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
      <Box sx={{ height: '100vh', padding: '12px 16px', marginTop: '40px', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
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
