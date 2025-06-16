import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Hls from "hls.js";
import { ArrowLeft } from "lucide-react";
import { API_URL } from "./utils/config";

export default function LiveTVPlayer() {
  const { stream_id, stream_name } = useParams();
  const [playbackLink, setPlaybackLink] = useState(null);
  const navigate = useNavigate();
  const videoRef = useRef();

  useEffect(() => {
    const fetchPlaybackLink = async () => {
      try {
        const res = await fetch(
          `${API_URL}/live-tv/link?stream_id=${stream_id}`
        );
        const data = await res.json();
        setPlaybackLink(data.link);
      } catch (error) {
        console.error("Error fetching playback link:", error);
      }
    };

    fetchPlaybackLink();
  }, [stream_id]);

  useEffect(() => {
    if (playbackLink) {
      const video = videoRef.current;
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(playbackLink);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = playbackLink;
      }
    }
  }, [playbackLink]);

  if (!playbackLink) {
    return <p className="text-white text-center mt-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="px-4 py-6 sm:px-6 lg:px-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/live-tv")}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold">{stream_name}</h1>
        </div>
      </header>

      {/* Player */}
      <main className="h-[calc(100vh-96px)] w-full relative">
        <video
          ref={videoRef}
          controls
          autoPlay
          width="100%"
          height="100%"
          className="max-h-full"
        />
      </main>
    </div>
  );
}
