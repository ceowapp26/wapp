'use client';
import { addToFavorites, removeFromFavorites, selectFavorites } from "@/redux/features/apps/music/favoritesSlice";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";

const FavoriteButton = ({ type, id }) => {
    const dispatch = useAppDispatch();
    const favorites = useAppSelector(selectFavorites);

    const isFavorite = favorites[type].find(favoriteId => favoriteId === id);

    const handleFavoriteClick = (e) => {
        e.stopPropagation();

        isFavorite
            ? dispatch(removeFromFavorites({ type, id }))
            : dispatch(addToFavorites({ type, id }));
    };

    return (
        <button
            className="intro-buttons favorite px-3 py-2 flex justify-center items-center"
            onClick={ handleFavoriteClick }
        >
            { isFavorite ? <AiFillHeart className="text-red-500" /> : <AiOutlineHeart className="text-gray-500" /> }
        </button>
    );
};

export default FavoriteButton;
