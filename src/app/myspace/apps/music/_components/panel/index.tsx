import React from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Music, Headphones, Radio } from 'lucide-react';
import Image from 'next/image';

export default function Panel() {
  return (
    <Card className="relative top-[10rem] p-6 bg-gradient-to-br from-indigo-100 to-purple-100 shadow-xl rounded-xl overflow-hidden">
      <Grid container spacing={4} className="items-center">
        <Grid item xs={12} md={6} className="relative">
          <div className="relative h-screen overflow-hidden rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
            <Image
              src="/music/images/headphone.jpg"
              fill={true}
              object-fit="contain" 
              alt="Person wearing headphones"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <Headphones className="text-white w-20 h-20 opacity-75" />
            </div>
          </div>
        </Grid>
        <Grid item xs={12} md={6} className="p-6">
          <div className="absolute space-y-6 top-8">
            <Typography variant="h3" className="text-indigo-600 font-bold flex items-center space-x-2">
              <Music className="w-8 h-8" />
              <span>WAPP-MUSIC</span>
            </Typography>
            <Typography variant="h5" className="text-gray-800 font-semibold">
              Listen to music from wapp-music
            </Typography>
            <Typography variant="body1" className="text-gray-600">
              Blow off some steam after long working hours with our curated playlists. 
              Discover new tracks or revisit old favorites.
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button
                variant="contained"
                color="primary"
                href="/myspace/apps/music/home"
                className="bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300 py-3 px-6"
                startIcon={<Radio />}
              >
                Pop Music
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                href="/myspace/apps/music/lofi"
                className="border-purple-500 text-purple-500 hover:bg-purple-50 transition-colors duration-300 py-3 px-6"
                startIcon={<Headphones />}
              >
                Chill Music
              </Button>
            </div>
          </div>
        </Grid>
      </Grid>
    </Card>
  );
}