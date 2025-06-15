import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SeriesPage() {
  const [seriesData, setSeriesData] = useState([]);
  const [featuredSeries, setFeaturedSeries] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNum, setPageNum] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  // Fetch categories only once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:5000/categories?action=get_series_categories');
        const data = await res.json();
        setCategories([{ category_id: null, category_name: 'All' }, ...data]);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch series from API
  const fetchSeries = async (page, search, category, append = false) => {
    try {
      const params = new URLSearchParams({ page, limit, search });
      if (category) params.append('category', category);
      const res = await fetch(`http://localhost:5000/series/list?${params.toString()}`);
      const data = await res.json();
      if (append) setSeriesData(prev => [...prev, ...data.series]);
      else setSeriesData(data.series);
      setFeaturedSeries(data.featured);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching series:', error);
    }
  };

  // Effect: trigger fetch on category or search change
  useEffect(() => {
    fetchSeries(1, searchTerm, selectedCategory, false);
  }, [selectedCategory, searchTerm]);

  // Infinite scroll
  useEffect(() => {
    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        const totalPages = Math.ceil(total / limit);
        if (pageNum < totalPages) setPageNum(prev => prev + 1);
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [pageNum, total, limit]);

  useEffect(() => {
    if (pageNum > 1) fetchSeries(pageNum, searchTerm, selectedCategory, true);
  }, [pageNum]);

  const SeriesCard = ({ series }) => (
    <div className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-2">
      <div className="relative overflow-hidden rounded-xl bg-gray-800 shadow-lg">
        {/* Series Cover */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img 
            src={series.cover} 
            alt={series.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Overlay on Hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button 
              onClick={() => navigate(`/series/${series._id}/detail`)}
              className="bg-red-600 hover:bg-red-700 text-white rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300"
            >
              <Play className="w-6 h-6" />
            </button>
          </div>
          
          {/* Rating Badge */}
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-white text-xs font-medium">{series.rating}</span>
          </div>
        </div>
        
        {/* Series Info */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-lg mb-1 line-clamp-1">{series.title}</h3>
          <p className="text-gray-300 text-sm line-clamp-2">{series.plot}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-6 sm:px-6 lg:px-8 border-b border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Series</h1>
              <p className="text-gray-400 text-sm">Discover amazing series</p>
            </div>
          </div>
          {/* Search and Filter */}
          <div className="hidden sm:flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search series..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Categories Chips */}
        <div className="mt-4 flex max-w-7xl mx-auto space-x-2 w-full overflow-x-auto custom-scrollbar">
          {categories.map(category => (
            <button
              key={category.category_id}
              onClick={() => {
                if (selectedCategory !== category.category_id) {
                  setSelectedCategory(category.category_id);
                }
              }}
              className={`px-4 py-2 min-w-fit rounded-full text-sm font-medium transition-colors duration-200 ${selectedCategory === category.category_id ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
              disabled={selectedCategory === category.category_id}
            >
              {category.category_name}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Featured Section */}
          {featuredSeries && (
            <div className="mb-12">
              <div className="relative h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden">
                <img 
                  src={featuredSeries.cover}
                  alt={featuredSeries.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent">
                  <div className="absolute bottom-8 left-8 max-w-lg">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-2">Featured: {featuredSeries.title}</h2>
                    <p className="text-gray-200 mb-4">{featuredSeries.plot}</p>
                    <div className="flex items-center space-x-4">
                      <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2">
                        <Play className="w-5 h-5" />
                        <span>Watch Now</span>
                      </button>
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{featuredSeries.rating}</span>
                        <span>•</span>
                        <span>{featuredSeries.year}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Series Grid */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-6">All Series</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {seriesData.map((series, idx) => (
                <SeriesCard key={idx} series={series} />
              ))}
            </div>
          </div>

          {/* Load More */}
          <div className="text-center">
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200">
              Load More Series
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
