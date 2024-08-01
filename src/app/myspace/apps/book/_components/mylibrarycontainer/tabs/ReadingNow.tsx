"use client";
import useSWR from 'swr';
import BookContainer from '../BookContainer';

const ReadingNowTabContent = ({readingnows}) => {
    if (!readingnows) {
        return <div>Loading...</div>;
    }

    const { data, error } = useSWR({ entitiesIds: readingnows, endpoint: "https://www.googleapis.com/books/v1/volumes"});

    if (error) {
        console.error('Error fetching my favorite data:', error);
        return <div>Error fetching data</div>;
    }

    return (
        <section className="relative flex flex-col flex-grow">
            <div className="flex flex-wrap items-center justify-center px-8 py-4 w-full">
                {data && data.map((readingnowItem) => {
                    return (
                        <BookContainer key={readingnowItem.bookID} bookID={readingnowItem.bookID} volumeInfo={readingnowItem.volumeInfo} />
                    );
                })}
            </div>
        </section>
    );
};

export default ReadingNowTabContent;



