import React from 'react';
import { addToFavorites, removeFromFavorites, selectFavorites } from "@/redux/features/apps/book/favoritesSlice";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";

const FavoriteButton = ({ id }) => {
    const dispatch = useAppDispatch();
    const favorites = useAppSelector(selectFavorites);

    const isFavorite = favorites.find(favoriteId => favoriteId === id);

    const handleFavoriteClick = (e) => {
        e.stopPropagation();

        isFavorite
            ? dispatch(removeFromFavorites({ id }))
            : dispatch(addToFavorites({ id }));
    };

    return (
        <button
            className={ isFavorite ? `favorite active` : 'favorite' }
            onClick={ handleFavoriteClick }
        >
            { isFavorite ? <AiFillHeart /> : <AiOutlineHeart /> }
        </button>
    );
};

export default FavoriteButton;
