"use client"

import React from 'react';
import { List, ListItem, ListItemText, Typography, Rating, Paper } from '@mui/material';

const reviews = [
  { id: 1, product: 'Product 1', customer: 'John Doe', rating: 4, comment: 'Great product!' },
  { id: 2, product: 'Product 2', customer: 'Jane Smith', rating: 5, comment: 'Excellent quality.' },
  // Add more review data here
];

const ReviewsPage = () => {
  return (
    <React.Fragment>
      <Typography variant="h4" gutterBottom>
        Customer Reviews
      </Typography>
      <List>
        {reviews.map((review) => (
          <Paper key={review.id} className="mb-4 p-4">
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={review.product}
                secondary={
                  <React.Fragment>
                    <Typography component="span" variant="body2" color="text.primary">
                      {review.customer}
                    </Typography>
                    <Rating value={review.rating} readOnly />
                    <Typography variant="body2">{review.comment}</Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
          </Paper>
        ))}
      </List>
    </React.Fragment>
  );
};

export default ReviewsPage;