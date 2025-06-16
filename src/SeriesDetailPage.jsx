import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play } from 'lucide-react';
import { API_URL } from './utils/config';

export default function SeriesDetailPage() {
  const { id } = useParams();
  const [seriesDetail, setSeriesDetail] = useState(null);
  const navigate = useNavigate();

  // Fetch series details
  useEffect(() => {
    const fetchSeriesDetail = async () => {
      try {
        const res = await fetch(`${API_URL}/series/detail?id=${id}`);
        const data = await res.json();
        setSeriesDetail(data);
        console.log('Series details fetched:', data);
      } catch (error) {
        console.error('Error fetching series details:', error);
      }
    };
    fetchSeriesDetail();
  }, [id]);

  if (!seriesDetail) {
    return <p className="text-black text-center mt-10">Loading...</p>;
  }

  const { info, seasons } = seriesDetail;

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
            <h1 className="text-2xl sm:text-3xl font-bold">{info.title}</h1>
            <p className="text-gray-400 text-sm">{info.year}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Series Info */}
          <div className="mb-8">
            <img 
              src={info.cover} 
              alt={info.title} 
              className="w-full h-96 rounded-lg object-contain mb-4"
            />
            <p className="text-gray-300 mb-4">{info.plot}</p>
            <div className="text-gray-400 text-sm">
              <p><strong>Cast:</strong> {info.cast || 'N/A'}</p>
              <p><strong>Director:</strong> {info.director || 'N/A'}</p>
              <p><strong>Genre:</strong> {info.genre || 'N/A'}</p>
              <p><strong>Rating:</strong> {info.rating || 'N/A'}</p>
            </div>
          </div>

          {/* Seasons and Episodes */}
          <div>
            {Object.entries(seriesDetail.episodes).map(([seasonNumber, episodes]) => (
              <div key={seasonNumber} className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Season {seasonNumber}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {episodes.map(episode => (
                    <div key={episode.id} className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-2">
                      <div className="relative overflow-hidden rounded-xl bg-gray-800 shadow-lg">
                        <div className="p-4">
                            {/* {console.log('Episode:', episode)} */}
                          {/* <img src={episode.info.movie_image} alt={episode.title} className="w-full h-48 rounded-lg object-cover mb-4" /> */}
                          <h3 className="text-white font-semibold text-lg mb-1 line-clamp-1">{episode.title}</h3>
                          <p className="text-gray-300 text-sm mb-2">Duration: {episode.info.duration || 'N/A'}</p>
                          <button 
                            onClick={() => navigate(`/episode-player/${episode.id}/${episode.container_extension}/${encodeURIComponent(episode.title)}/${episode.episode_num}/${episode.season}`)}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-full px-4 py-2"
                          >
                            <Play className="w-5 h-5 inline-block mr-2" />
                            Play Episode
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
