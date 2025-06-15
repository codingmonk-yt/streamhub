import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import { ArrowLeft } from "lucide-react";

export default function EpisodePlayerPage() {
  const { episodeId, containerExtension, title, episodeNum, season } =
    useParams();
  const [playbackLink, setPlaybackLink] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaybackLink = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/series/episode/link?episode_id=${episodeId}&container_extension=${containerExtension}`
        );
        const data = await res.json();
        setPlaybackLink(data.link);
      } catch (error) {
        console.error("Error fetching playback link:", error);
      }
    };

    fetchPlaybackLink();
  }, [episodeId, containerExtension]);

  if (!playbackLink) {
    return <p className="text-white text-center mt-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="px-4 py-6 sm:px-6 lg:px-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
            <p className="text-gray-400 text-sm">
              Season {season} - Episode {episodeNum}
            </p>
          </div>
        </div>
      </header>

      {/* Player */}
      <main className="h-[calc(100vh-96px)] w-full relative">
        <div className="h-full">
          <ReactPlayer url={playbackLink} playing controls width="100%" height="100%" />
        </div>
      </main>
    </div>
  );
}
