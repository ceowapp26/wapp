const TabContentContainer = ({ entities, children }) => {
    const isEmpty = !entities.length;

    return (
        <div className="text-center">
            {isEmpty ? (
                <div>
                    <h2>It seems like this list is empty.</h2>
                    <h2 className="text-transparent bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text">
                        Start exploring and discovering new music today! Enjoy the journey!
                    </h2>
                </div>
            ) : (
                <>{children}</>
            )}
        </div>
    );
};

export default TabContentContainer;
