import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';

export default function PlayerPage() {
  const { id } = useParams();
  const [link, setLink] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const res = await fetch(`http://localhost:5000/movies/${id}/link`);
        const data = await res.json();
        setLink(data.link);
      } catch (error) {
        console.error('Error fetching playback link:', error);
      }
    };
    fetchLink();
  }, [id]);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <button
        onClick={() => navigate(-1)}
        className="text-white p-4"
      >
        Back
      </button>
      <div className="flex-grow h-[calc(100vh-64px)] relative">
        {link ? (
          <ReactPlayer url={link} controls playing width="100%" height="100%" />
        ) : (
          <p className="text-white text-center mt-10">Loading...</p>
        )}
      </div>
    </div>
  );
}
