import React, { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import { ArrowLeft, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "./utils/config";

export default function LiveTVPage() {
  const [liveTVStreams, setLiveTVStreams] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [limit] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  // Fetch live TV streams from API
  const fetchLiveTVStreams = async (page, search, category, append = false) => {
    try {
      const params = new URLSearchParams({ page, limit, search });
      if (category) params.append("category", category);
      const res = await fetch(`${API_URL}/live-tv/list?${params.toString()}`);
      const data = await res.json();
      if (append) setLiveTVStreams((prev) => [...prev, ...data.liveTVStreams]);
      else setLiveTVStreams(data.liveTVStreams);
      setFeatured(data.featured);
      setTotal(data.total);
    } catch (error) {
      console.error("Error fetching live TV streams:", error);
    }
  };

  // Debounced search handler
  const debouncedFetch = useCallback(
    debounce((val) => {
      setPageNum(1);
      fetchLiveTVStreams(1, val, null, false);
    }, 500),
    []
  );

  // Effect: trigger fetch on searchTerm change
  useEffect(() => {
    debouncedFetch(searchTerm);
    return () => debouncedFetch.cancel();
  }, [searchTerm]);

  // Effect: fetch on page change
  useEffect(() => {
    fetchLiveTVStreams(pageNum, searchTerm, selectedCategory, pageNum !== 1);
  }, [pageNum, selectedCategory]);

  // Infinite scroll
  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100
      ) {
        const totalPages = Math.ceil(total / limit);
        if (pageNum < totalPages) setPageNum((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [pageNum, total, limit]);

  // Fetch categories only once when component renders
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${API_URL}/categories?action=get_live_categories`
        );
        const data = await res.json();
        setCategories([{ category_id: null, category_name: "All" }, ...data]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const LiveTVCard = ({ stream }) => (
    <div className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-2">
      <div className="relative overflow-hidden rounded-xl bg-gray-800 shadow-lg">
        {/* Stream Icon */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={stream.stream_icon}
            alt={stream.name}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
          />
          {/* Overlay on Hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              onClick={() => navigate(`/live-tv/${stream.stream_id}/${stream.name}`)}
              className="bg-red-600 hover:bg-red-700 text-white rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300"
            >
              <Play className="w-6 h-6" />
            </button>
          </div>
        </div>
        {/* Stream Info */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-lg mb-1 line-clamp-1">
            {stream.name}
          </h3>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 px-4 py-6 sm:px-6 lg:px-8 border-b border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/")}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Live TV</h1>
              <p className="text-gray-400 text-sm">Watch live TV channels</p>
            </div>
          </div>
          {/* Search and Filter */}
          <div className="hidden sm:flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search live TV..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Categories Chips */}
        <div className="mt-4 flex max-w-7xl mx-auto space-x-2 w-full overflow-x-auto custom-scrollbar">
          {categories.map((category) => (
            <button
              key={category.category_id}
              onClick={() => {
                if (selectedCategory !== category.category_id) {
                  setSelectedCategory(category.category_id);
                }
              }}
              className={`px-4 py-2 rounded-full min-w-fit text-sm font-medium transition-colors duration-200 ${
                selectedCategory === category.category_id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
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
          {/* Featured Stream */}
          {/* {featured && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-6">Featured</h3>
              <LiveTVCard stream={featured} />
            </div>
          )} */}

          {/* Live TV Grid */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-6">All Channels</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {liveTVStreams.map((stream, idx) => (
                <LiveTVCard key={idx} stream={stream} />
              ))}
            </div>
          </div>

          {/* Load More (infinite scroll auto loads) */}
          <div className="text-center">
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200">
              Load More Channels
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
