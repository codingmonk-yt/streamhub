import React from 'react';
import { Tv, Film, Monitor } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
    const navigate = useNavigate();
  const streamingOptions = [
    {
      id: 'live-tv',
      title: 'Live TV',
      description: 'Watch live channels and broadcasts',
      icon: Tv,
      gradient: 'from-red-500 to-pink-600',
      hoverGradient: 'from-red-600 to-pink-700'
    },
    {
      id: 'movies',
      title: 'Movies',
      description: 'Explore thousands of movies',
      icon: Film,
      gradient: 'from-blue-500 to-purple-600',
      hoverGradient: 'from-blue-600 to-purple-700'
    },
    {
      id: 'series',
      title: 'Series',
      description: 'Binge-watch your favorite shows',
      icon: Monitor,
      gradient: 'from-green-500 to-teal-600',
      hoverGradient: 'from-green-600 to-teal-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            StreamHub
          </h1>
          <p className="text-gray-400 text-center mt-2 text-sm sm:text-base">
            Your ultimate streaming destination
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
              What would you like to watch?
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
              Choose from our extensive collection of live TV channels, blockbuster movies, and binge-worthy series
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {streamingOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <div
                  key={option.id}
                  onClick={() => navigate(`${option.id}`)}
                  className="group relative overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                >
                  {/* Card Background with Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} group-hover:bg-gradient-to-br group-hover:${option.hoverGradient} transition-all duration-300`} />
                  
                  {/* Card Content */}
                  <div className="relative p-8 sm:p-10 text-center h-64 sm:h-72 flex flex-col justify-center items-center">
                    {/* Icon */}
                    <div className="mb-6 transform transition-transform duration-300 group-hover:scale-110">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-2xl sm:text-3xl font-bold mb-3 text-white">
                      {option.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-white/90 text-sm sm:text-base font-medium">
                      {option.description}
                    </p>

                    {/* Hover Effect Arrow */}
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Subtle Border Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-white/20 transition-colors duration-300" />
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
