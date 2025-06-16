import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

export default function TestLiveHLS() {
  const videoRef = useRef();

  useEffect(() => {
    const video = videoRef.current;
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource('http://otp7.xyz/live/251639938/938256758/241318.m3u8');
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = 'http://otp7.xyz/live/251639938/938256758/241318.m3u8';
    }
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <video ref={videoRef} controls autoPlay width="100%" height="100%" />
    </div>
  );
}
