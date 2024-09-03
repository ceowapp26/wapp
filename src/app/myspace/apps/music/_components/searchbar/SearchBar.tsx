'use client';
import { useState, useEffect, useRef } from 'react';
import { AiOutlineSearch, AiOutlineClose } from 'react-icons/ai';
import SearchResults from './SearchResults';

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setIsFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleFocus = () => setIsFocused(true);
    const handleClear = () => {
        setSearchQuery('');
        inputRef.current.focus();
    };

    return (
        <div className="relative max-w-3xl mx-auto mt-36 px-4 py-4">
            <div 
                className={`relative flex items-center rounded-full transition-all duration-300 ${
                    isFocused 
                        ? 'bg-white dark:bg-gray-800 shadow-lg' 
                        : 'bg-gray-100 dark:bg-gray-700'
                }`}
                ref={inputRef}
            >
                <AiOutlineSearch className={`text-2xl ml-4 ${
                    isFocused ? 'text-blue-500' : 'text-gray-400 dark:text-gray-300'
                }`}/>
                <input
                    className="p-4 w-full bg-transparent text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
                    type="text"
                    placeholder='Search for songs, artists...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={handleFocus}
                />
                {searchQuery && (
                    <button
                        onClick={handleClear}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
                    >
                        <AiOutlineClose className="text-xl" />
                    </button>
                )}
            </div>
            
            {isFocused && searchQuery && (
                <SearchResults query={searchQuery} />
            )}
        </div>
    );
};

export default SearchBar;