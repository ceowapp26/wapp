
"use client";
import SearchBar from '../searchbar/SearchBar';
import SearchContainer from '../searchcontainer';
import { selectSearchs } from '@/redux/features/apps/book/searchsSlice';
import { useAppSelector } from '@/hooks/hooks';

const SearchView = () => {
    const searchTerm = useAppSelector(selectSearchs);
    return (
        <section id="search-container" className="relative flex flex-col flex-grow">
            <SearchBar />
            <SearchContainer searchInput={searchTerm} />
        </section>

    );
};

export default SearchView;


