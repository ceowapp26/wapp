import React from 'react';
import { Button } from '@mui/material';
import { updateFilter } from '@/utils/searchEvent';
import { useMyspaceContext } from "@/context/myspace-context-provider";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; 

const categoryIcons = {
    'Adult': '👩‍💼',
    'Anthologies': '📚',
    'Art': '🎨',
    'Audiobooks': '🎧',
    'Biographies': '📖',
    'Body': '🏃‍♀️',
    'Business': '💼',
    'Children': '👶',
    'Comics': '💬',
    'Contemporary': '🏙️',
    'Cooking': '🍳',
    'Crime': '🔍',
    'Engineering': '🔧',
    'Entertainment': '🎭',
    'Fantasy': '🧙',
    'Fiction': '📕',
    'Food': '🍔',
    'General': '🌐',
    'Health': '💊',
    'History': '📜',
    'Horror': '👻',
    'Investing': '💰',
    'Literary': '📝',
    'Literature': '📚',
    'Manga': '📖',
    'Media-help': '📺',
    'Memoirs': '📖',
    'Mind': '🧠',
    'Mystery': '🕵️‍♂️',
    'Nonfiction': '📘',
    'Religion': '⛪',
    'Romance': '💖',
    'Science': '🔬',
    'Self': '🧘',
    'Spirituality': '🕉️',
    'Sports': '🏀',
    'Superheroes': '🦸‍♂️',
    'Technology': '💻',
    'Thrillers': '🎢',
    'Travel': '✈️',
    'Women': '🚺',
    'Young': '👶'
};

const colorOptions = ['primary', 'secondary', 'error', 'info', 'success'];

const CategorySearch = ({ onClick, category }) => {
    const { viewPort } = useMyspaceContext();
    const randomColorIndex = Math.floor(Math.random() * colorOptions.length);
    const randomColor = colorOptions[randomColorIndex];

    return (
        <div className="my-4 py-2">
            <Button
                variant="contained"
                color={randomColor}
                className={`text-white w-[180px] rounded-lg hover:bg-opacity-90`}
                startIcon={<span role="img" aria-label={category}>{categoryIcons[category]}</span>}
                endIcon={<ArrowForwardIcon />} 
                onClick={() => {
                    updateFilter(this, viewPort, category, 'subject');
                    onClick();
                }}
            >
                {category}
            </Button>
        </div>
    );
};

export default CategorySearch;
