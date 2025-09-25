import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Search, Menu, Video, ChevronDown, User, LogOut, Settings } from "lucide-react"; 
import { useAuth } from "../context/AuthContext";

export default function Navbar({ onToggle }) {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth(); 
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hasChannel, setHasChannel] = useState(false); 

   useEffect(() => {
    const urlQuery = searchParams.get("query") || "";
    if (query !== urlQuery) {
      setQuery(urlQuery);
    }
  }, [searchParams, query]);

  useEffect(() => {
    if (user && user.channelId) {
      setHasChannel(true);
    } else if (user) {
      const fetchUserData = async () => {
        try {
          const response = await api.get("/auth/me", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          const data = response.data;
          if (data.success && data.user && data.user.channelId) {
            updateUser({ channelId: data.user.channelId });
            setHasChannel(true);
          } else {
            setHasChannel(false);
          }
        } catch (error) {
          if (error.response?.status === 404) {
            setHasChannel(false);
          } else {
            console.error("Error fetching user data:", error);
          }
        }
      };
      fetchUserData();
    }
  }, [user, updateUser]);


  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (newQuery) {
      setSearchParams({ query: newQuery });
    } else {
      setSearchParams({});
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/?query=${encodeURIComponent(query)}`);
    else navigate("/");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setDropdownOpen(false);
  };

  const handleProfileClick = () => {
    if (user?.channelId) {
      navigate(`/channel/${user.channelId}`);
    } else {
      navigate("/channel/create");
    }
    setDropdownOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center bg-neutral-100 justify-between px-5 py-2">
      {/* Left: Hamburger + Logo */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggle}
          aria-label="Toggle Sidebar"
          className="p-1 rounded hover:bg-gray-100"
        >
          <Menu size={28} />
        </button>
        <Link to="/" className="flex ml-5 items-center gap-2">
          <svg
            viewBox="0 0 576 512"
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-6 text-red-600"
            fill="currentColor"
          >
            <path d="M549.7 124.1c-6.3-23.7-24.9-42.4-48.6-48.7C456.2 64 288 64 288 64s-168.2 0-213.1 11.4c-23.7 6.3-42.3 25-48.6 48.7C15 168.1 15 256 15 256s0 87.9 11.3 131.9c6.3 23.7 24.9 42.4 48.6 48.7C119.8 448 288 448 288 448s168.2 0 213.1-11.4c23.7-6.3 42.3-25 48.6-48.7C561 343.9 561 256 561 256s0-87.9-11.3-131.9zM232 338V174l142 82-142 82z" />
          </svg>
          <span className="text-lg font-bold">YouTube</span>
        </Link>
      </div>

      {/* Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex-1 max-w-md mx-4 relative"
      >
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search"
          className="w-full border rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
        />
        <button
          type="submit"
          className="absolute right-1 top-1 bottom-1 px-3 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
        >
          <Search size={18} />
        </button>
      </form>

     <div className="flex items-center gap-1">
  {user ? (
    <>
      {hasChannel ? (
        <button
  onClick={() => navigate("/upload")}
  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-1 rounded-full shadow-md transition"
>
  <Video size={20} />
  <span>Upload</span>
</button>

      ) : (
        <button
          onClick={() => navigate("/channel/create")}
          className="bg-blue-600 text-white px-3 py-1 rounded-full font-medium  hover:bg-blue-700 text-sm"
        >
          Create Channel
        </button>
      )}

      {/* Avatar + Dropdown */}
      <div className="relative ml-2">
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center gap-1"
        >
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="User Avatar"
              className="w-10.5 h-10.5 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm">
              {user.username?.charAt(0).toUpperCase()}
            </div>
          )}
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white z-50">
            <div className="flex items-center p-4 border-b border-gray-200">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full mr-3"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                  <User size={24} />
                </div>
              )}
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  {user.name}
                </div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
            </div>

            <div className="py-1" role="menu" aria-orientation="vertical">
              <button
                onClick={handleProfileClick}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <User size={18} className="mr-3" />
                My Channel
              </button>
              {/* Disabled links */}
              <Link
                to="#"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 opacity-50 cursor-not-allowed"
              >
                YouTube Studio
              </Link>
              <Link
                to="#"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 opacity-50 cursor-not-allowed"
              >
                Purchases and Membership
              </Link>
              <Link
                to="#"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 opacity-50 cursor-not-allowed"
              >
                Language
              </Link>
              <Link
                to="#"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 opacity-50 cursor-not-allowed"
              >
                Location
              </Link>
              <Link
                to="#"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 opacity-50 cursor-not-allowed"
              >
                <Settings size={18} className="mr-3" />
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <LogOut size={18} className="mr-3" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  ) : (
    <button
      onClick={() => navigate("/login")}
      className="bg-red-600 text-white px-3 py-0.5 font-medium rounded-2xl hover:bg-red-800"
    >
      Sign In
    </button>
  )}
</div>
    </header>
  );
}