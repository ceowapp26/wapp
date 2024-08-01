'use client';
import useSWR from 'swr';
import SearchResultItem from './SearchResultItem';

const SearchResults = ({ query }) => {
    const { data: resultsObj = {}, error, isLoading } = useSWR(query, async () => {
        const response = await fetch(`/api/search?q=${ query }`);
        return await response.json();
    });

    return (
        <>
        {
            query &&
            <div className='absolute z-[9999] top-full w-full p-4 rounded-lg backdrop-blur bg-[rgba(6,14,75,0.2)] shadow-lg border-b border-gray-400'>
                { isLoading && <strong>Loading...</strong>}

                { error && <strong>Something went wrong...</strong>}

                {
                    Object.keys(resultsObj).map(type => {
                        return (
                            <div className="p-2" key={ type }>
                                <strong className="block mb-2 capitalize">{ type + 's' }</strong>

                                <ul className="flex flex-col gap-2">
                                    {
                                        !resultsObj[type].length ?
                                            <span>Item not found. Please try a different search term.</span>
                                        :
                                            resultsObj[type].map(result =>
                                                <SearchResultItem
                                                    key={ result.id }
                                                    type={ type }
                                                    result={ result }
                                                />
                                            )
                                    }
                                </ul>
                            </div>
                        );
                    })
                }
            </div>
        }
        </>
    );
};

export default SearchResults;
