import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Users, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();
    const isLanding = location.pathname === '/';
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className={`fixed w-full z-50 border-b transition-colors ${isLanding ? 'bg-white/80 backdrop-blur-md border-gray-100' : 'bg-white border-gray-200'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center gap-8">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900 tracking-tight">TeamMatch</span>
                        </Link>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center space-x-6">
                            <Link
                                to="/teams"
                                className={`text-sm font-medium transition-colors ${location.pathname.startsWith('/teams') ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                팀 찾기
                            </Link>
                            <Link
                                to="/users"
                                className={`text-sm font-medium transition-colors ${location.pathname.startsWith('/users') ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                팀원 찾기
                            </Link>
                            <Link
                                to="/contests"
                                className={`text-sm font-medium transition-colors ${location.pathname.startsWith('/contests') ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                공모전
                            </Link>
                            <Link
                                to="/chat"
                                className={`text-sm font-medium transition-colors ${location.pathname.startsWith('/chat') ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                메시지
                            </Link>
                        </div>
                    </div>

                    {/* Auth Buttons / User Profile */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center space-x-2 focus:outline-none"
                                >
                                    <img
                                        src={user?.avatar || "https://via.placeholder.com/40"}
                                        alt={user?.name}
                                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                    />
                                    <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.name}</span>
                                </button>

                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 animate-in fade-in zoom-in duration-200">
                                        <div className="px-4 py-2 border-b border-gray-50">
                                            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                        </div>
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            <UserIcon className="w-4 h-4 mr-2" /> 프로필
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" /> 로그아웃
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                                    로그인
                                </Link>
                                <Link
                                    to="/signup"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md"
                                >
                                    회원가입
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
