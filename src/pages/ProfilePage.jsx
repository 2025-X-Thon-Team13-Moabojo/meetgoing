import React, { useState, useEffect } from 'react';
import { User, MapPin, Briefcase, Code, Clock, Save, X, GraduationCap, Award, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
    const { user, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('basic'); // basic, skills, achievements

    // Initialize state with user data or defaults
    const [profile, setProfile] = useState({
        name: '',
        role: '',
        region: '',
        techStack: [],
        interests: [],
        availableTime: '',
        bio: '',
        school: '',
        awards: []
    });

    // Update local state when user context changes
    useEffect(() => {
        if (user) {
            setProfile({
                name: user.name || '',
                role: user.role || '',
                region: user.region || '',
                techStack: user.techStack || ['React', 'Node.js', 'TypeScript'],
                interests: user.interests || ['Hackathons', 'Open Source', 'AI'],
                availableTime: user.availableTime || 'Weekends, Evenings',
                bio: user.bio || '',
                school: user.school || '',
                awards: user.awards || []
            });
        }
    }, [user]);

    const handleSave = () => {
        updateProfile(profile);
        setIsEditing(false);
    };

    const handleCancel = () => {
        // Reset to original user data
        if (user) {
            setProfile({
                name: user.name || '',
                role: user.role || '',
                region: user.region || '',
                techStack: user.techStack || ['React', 'Node.js', 'TypeScript'],
                interests: user.interests || ['Hackathons', 'Open Source', 'AI'],
                availableTime: user.availableTime || 'Weekends, Evenings',
                bio: user.bio || '',
                school: user.school || '',
                awards: user.awards || []
            });
        }
        setIsEditing(false);
    };

    const handleAddItem = (field, value) => {
        if (!value.trim()) return;
        setProfile(prev => ({
            ...prev,
            [field]: [...prev[field], value]
        }));
    };

    const handleRemoveItem = (field, index) => {
        setProfile(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const [inputs, setInputs] = useState({
        techStack: '',
        interests: '',
        awards: ''
    });

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                    <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                    <div className="px-8 pb-8">
                        <div className="relative flex justify-between items-end -mt-12 mb-6">
                            <div className="flex items-end">
                                <img
                                    src={user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg object-cover"
                                />
                                <div className="ml-6 mb-2">
                                    <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                                    <p className="text-gray-600">{profile.role}</p>
                                </div>
                            </div>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        {isEditing ? (
                            <div className="animate-in fade-in duration-200">
                                {/* Tabs */}
                                <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
                                    {['basic', 'skills', 'achievements'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => {
                                                setActiveTab(tab);
                                            }}
                                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === tab
                                                ? 'bg-white text-indigo-600 shadow-sm'
                                                : 'text-gray-500 hover:text-gray-700'
                                                } capitalize`}
                                        >
                                            {tab === 'basic' ? 'Basic Info' : tab === 'skills' ? 'Skills & Interests' : 'Achievements'}
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-6">
                                    {activeTab === 'basic' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                                <textarea
                                                    value={profile.bio}
                                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                                    rows={3}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                    placeholder="Tell us about yourself..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={profile.name}
                                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                                <input
                                                    type="text"
                                                    value={profile.role}
                                                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">School / University</label>
                                                <input
                                                    type="text"
                                                    value={profile.school}
                                                    onChange={(e) => setProfile({ ...profile, school: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                    placeholder="e.g. Korea University"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                                                <input
                                                    type="text"
                                                    value={profile.region}
                                                    onChange={(e) => setProfile({ ...profile, region: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Available Time</label>
                                                <input
                                                    type="text"
                                                    value={profile.availableTime}
                                                    onChange={(e) => setProfile({ ...profile, availableTime: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'skills' && (
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Tech Stack</label>
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {profile.techStack.map((tech, index) => (
                                                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                                            {tech}
                                                            <button
                                                                onClick={() => handleRemoveItem('techStack', index)}
                                                                className="ml-2 text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Add a technology (e.g. React)"
                                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                        value={inputs.techStack}
                                                        onChange={(e) => setInputs({ ...inputs, techStack: e.target.value })}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                                                                e.preventDefault();
                                                                handleAddItem('techStack', inputs.techStack);
                                                                setInputs(prev => ({ ...prev, techStack: '' }));
                                                            }
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            handleAddItem('techStack', inputs.techStack);
                                                            setInputs(prev => ({ ...prev, techStack: '' }));
                                                        }}
                                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {profile.interests.map((interest, index) => (
                                                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                            {interest}
                                                            <button
                                                                onClick={() => handleRemoveItem('interests', index)}
                                                                className="ml-2 text-green-600 hover:text-green-900"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Add an interest (e.g. AI)"
                                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                        value={inputs.interests}
                                                        onChange={(e) => setInputs({ ...inputs, interests: e.target.value })}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                                                                e.preventDefault();
                                                                handleAddItem('interests', inputs.interests);
                                                                setInputs(prev => ({ ...prev, interests: '' }));
                                                            }
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            handleAddItem('interests', inputs.interests);
                                                            setInputs(prev => ({ ...prev, interests: '' }));
                                                        }}
                                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'achievements' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Awards & Certifications</label>
                                            <div className="space-y-3 mb-4">
                                                {profile.awards.map((award, index) => (
                                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                        <div className="flex items-center">
                                                            <Award className="w-5 h-5 text-yellow-500 mr-3" />
                                                            <span className="text-gray-900">{award}</span>
                                                        </div>
                                                        <button
                                                            onClick={() => handleRemoveItem('awards', index)}
                                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Add an award or certification"
                                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                    value={inputs.awards}
                                                    onChange={(e) => setInputs({ ...inputs, awards: e.target.value })}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                                                            e.preventDefault();
                                                            handleAddItem('awards', inputs.awards);
                                                            setInputs(prev => ({ ...prev, awards: '' }));
                                                        }
                                                    }}
                                                />
                                                <button
                                                    onClick={() => {
                                                        handleAddItem('awards', inputs.awards);
                                                        setInputs(prev => ({ ...prev, awards: '' }));
                                                    }}
                                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100 mt-6">
                                        <button
                                            onClick={handleCancel}
                                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center"
                                        >
                                            <Save className="w-4 h-4 mr-2" /> Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-2 space-y-8">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                            <User className="w-5 h-5 mr-2 text-gray-400" /> About
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {profile.bio || "No bio added yet."}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                            <Code className="w-5 h-5 mr-2 text-gray-400" /> Tech Stack
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {profile.techStack.length > 0 ? profile.techStack.map((tech, index) => (
                                                <span key={index} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                                                    {tech}
                                                </span>
                                            )) : <span className="text-gray-500 text-sm">No tech stack added.</span>}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                            <Briefcase className="w-5 h-5 mr-2 text-gray-400" /> Interests
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {profile.interests.length > 0 ? profile.interests.map((interest, index) => (
                                                <span key={index} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                                                    {interest}
                                                </span>
                                            )) : <span className="text-gray-500 text-sm">No interests added.</span>}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                            <Award className="w-5 h-5 mr-2 text-gray-400" /> Awards & Certifications
                                        </h3>
                                        <ul className="space-y-2">
                                            {profile.awards.length > 0 ? profile.awards.map((award, index) => (
                                                <li key={index} className="flex items-start text-gray-600">
                                                    <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-yellow-400 rounded-full flex-shrink-0"></span>
                                                    {award}
                                                </li>
                                            )) : <span className="text-gray-500 text-sm">No awards added.</span>}
                                        </ul>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Details</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-start">
                                                <GraduationCap className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">School</p>
                                                    <p className="text-sm text-gray-600">{profile.school || "Not specified"}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Location</p>
                                                    <p className="text-sm text-gray-600">{profile.region}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <Briefcase className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Role</p>
                                                    <p className="text-sm text-gray-600">{profile.role}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <Clock className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Availability</p>
                                                    <p className="text-sm text-gray-600">{profile.availableTime}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
