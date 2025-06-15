import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import StreamingPage from "./StreamingPage";
import PlayerPage from "./PlayerPage";
import SeriesPage from "./SeriesPage";
import SeriesDetailPage from "./SeriesDetailPage";
import EpisodePlayerPage from "./EpisodePlayerPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movies" element={<StreamingPage />} />
        <Route path="/series" element={<SeriesPage />} />
        <Route path="/series/:id/detail" element={<SeriesDetailPage />} />
        <Route path="/play/:id" element={<PlayerPage />} />
        <Route path="/episode-player/:episodeId/:containerExtension/:title/:episodeNum/:season" element={<EpisodePlayerPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
