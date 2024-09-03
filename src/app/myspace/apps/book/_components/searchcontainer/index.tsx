"use client";
import React, { useEffect, useRef, useState } from 'react';
import { debounce } from '@/utils/searchEvent';
import Utils from '@/utils/bookUtils';
import BookResult from '../bookresult';
import { Loader } from '@/components/loading';

const SearchContainer = ({ searchInput }) => {
    const [booksHTML, setBooksHTML] = useState(null);
    const [utils, setUtils] = useState(null);
    const ref = useRef(null);

    const drawListBook = async () => {
        try {
            if (searchInput !== "") {
                ref.current.style.display = "flex";
                setBooksHTML(<div className='prompt'>ツ Searching...</div>);
                const data = await utils.getBooks(`${searchInput}&maxResults=6`);
                if (data.error) {
                    setBooksHTML(<div className='prompt'>ツ Limit exceeded! Try after some time</div>);
                } else if (data.totalItems === 0) {
                    setBooksHTML(<div className='prompt'>ツ No results, try a different term!</div>);
                } else if (data.totalItems === undefined) {
                    setBooksHTML(<div className='prompt'>ツ Network problem!</div>);
                } else {
                    const newBooksHTML = data.items.map(({ id, volumeInfo }) => (
                        <BookResult key={id} bookId={id} bookLink={volumeInfo.previewLink} volumeInfo={volumeInfo} />
                    ));
                    setBooksHTML(newBooksHTML);
                }
            } else {
                ref.current.style.display = "none";
            }
        } catch (error) {
            console.error('Error in drawListBook:', error);
        }
    };

    useEffect(() => {
        const utilsInstance = new Utils();
        setUtils(utilsInstance);
        return () => {
            setUtils(null);
        };
    }, []);

    useEffect(() => {
        if (utils && ref) {
         debounce(drawListBook, 1000);
        }
    }, [searchInput, utils]);

    return (
        <>
            <div ref={ref} className="flex flex-wrap items-center justify-center px-8 py-4 w-full hidden">
                {booksHTML}
            </div>
            {booksHTML === null && <div className='prompt'><Loader /></div>}
        </>
    );
};

export default SearchContainer;
