import React from 'react';
import { addToLists, removeFromLists, selectLibraryBooks } from "@/redux/features/apps/book/libraryBooksSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";

const EditListButton = ({ id, category, iconAdd, iconRemove }) => {
    const dispatch = useAppDispatch();
    const books = useAppSelector(selectLibraryBooks);

    const isInList = books[category].find(bookId => bookId === id);

    const handleClick = (e) => {
        e.stopPropagation();

        isInList
            ? dispatch(removeFromLists({ category, id }))
            : dispatch(addToLists({ category, id }));
    };

    return (
        <button
            className={isInList ? `${category} active` : category}
            onClick={handleClick}
        >
            {isInList ? iconAdd : iconRemove}
        </button>
    );
};

export default EditListButton;
