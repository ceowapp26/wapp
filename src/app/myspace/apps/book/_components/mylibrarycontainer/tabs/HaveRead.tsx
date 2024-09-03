"use client";
import useSWR from 'swr';
import BookContainer from '../BookContainer';

const HaveReadTabContent = ({ havereads }) => {
    if (!havereads) {
        return <div>Loading...</div>;
    }

    const { data, error } = useSWR({ entitiesIds: havereads, endpoint: "https://www.googleapis.com/books/v1/volumes"});

    if (error) {
        console.error('Error fetching my favorite data:', error);
        return <div>Error fetching data</div>;
    }

    return (
        <section className="relative flex flex-col flex-grow">
            <div className="flex flex-wrap items-center justify-center px-8 py-4 w-full">
                {data && data.map((havereadItem) => {
                    return (
                        <BookContainer key={havereadItem.bookID} bookID={havereadItem.bookID} volumeInfo={havereadItem.volumeInfo} />
                    );
                })}
            </div>
        </section>
    );
};

export default HaveReadTabContent;
