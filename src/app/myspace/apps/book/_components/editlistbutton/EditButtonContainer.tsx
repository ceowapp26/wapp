import React from 'react';
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import EditListButton from './EditListButton';

const EditButtonContainer = ({ bookID }) => {
    return (
        <div className="left-[30px]">
            <EditListButton id={bookID} category={'myfavorite'} iconAdd={<AiFillHeart />} iconRemove={<AiOutlineHeart />} />
            <EditListButton id={bookID} category={'readingnow'} iconAdd={<AiFillHeart />} iconRemove={<AiOutlineHeart />} />
            <EditListButton id={bookID} category={'toread'} iconAdd={<AiFillHeart />} iconRemove={<AiOutlineHeart />} />
            <EditListButton id={bookID} category={'haveread'} iconAdd={<AiFillHeart />} iconRemove={<AiOutlineHeart />} />
        </div>
    );
};

export default EditButtonContainer;


