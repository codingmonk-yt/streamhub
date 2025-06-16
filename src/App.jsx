import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import StreamingPage from "./StreamingPage";
import PlayerPage from "./PlayerPage";
import SeriesPage from "./SeriesPage";
import SeriesDetailPage from "./SeriesDetailPage";
import EpisodePlayerPage from "./EpisodePlayerPage";
import TestLive from "./testLive";
import LiveTVPage from "./LiveTVPage";
import LiveTVPlayer from "./LiveTVPlayer";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/live" element={<TestLive />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/movies" element={<StreamingPage />} />
        <Route path="/series" element={<SeriesPage />} />
        <Route path="/series/:id/detail" element={<SeriesDetailPage />} />
        <Route path="/play/:id" element={<PlayerPage />} />
        <Route path="/episode-player/:episodeId/:containerExtension/:title/:episodeNum/:season" element={<EpisodePlayerPage />} />
        <Route path="/live-tv" element={<LiveTVPage />} />
        <Route path="/live-tv/:stream_id/:stream_name" element={<LiveTVPlayer />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
