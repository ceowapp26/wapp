'use client';
import { useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import SearchResults from './SearchResults';

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    
    return (
        <div className='relative flex items-center text-[#fafafe] mt-20 p-6'>
            <AiOutlineSearch className="text-xl mr-2"/>
            <input
                className="p-2 w-full border-0 text-slate-700 bg-transparent placeholder-opacity-100 placeholder:text-slate-700 focus:outline-none"
                type="text"
                placeholder='Search for songs, artists...'
                value={ searchQuery }
                onChange={ (e) => setSearchQuery(e.target.value) }
            />
            
            <SearchResults query={ searchQuery }/>
        </div>
    );
};

export default SearchBar;
