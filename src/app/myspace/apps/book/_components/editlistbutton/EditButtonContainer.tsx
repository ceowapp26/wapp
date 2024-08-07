import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart, FaBook, FaRegBookmark, FaCheck } from "react-icons/fa";
import EditListButton from './EditListButton';

const EditButtonContainer = ({ bookID }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex space-x-2"
        >
            <EditListButton id={bookID} category={'myfavorite'} iconAdd={<FaHeart />} iconRemove={<FaRegHeart />} />
            <EditListButton id={bookID} category={'readingnow'} iconAdd={<FaBook />} iconRemove={<FaBook />} />
            <EditListButton id={bookID} category={'toread'} iconAdd={<FaRegBookmark />} iconRemove={<FaRegBookmark />} />
            <EditListButton id={bookID} category={'haveread'} iconAdd={<FaCheck />} iconRemove={<FaCheck />} />
        </motion.div>
    );
};

export default EditButtonContainer;