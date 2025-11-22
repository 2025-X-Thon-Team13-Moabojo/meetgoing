import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Plus, X, Search } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { CONTEST_CATEGORIES, getCategoryLabels } from '../constants/contestCategories';

const CreateTeamPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const contestId = searchParams.get('contestId');
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        contestId: contestId || '',
        description: '',
        category: '', // 카테고리 (single select)
        rolesNeeded: [], // 역할군 (multi-select based on category)
        region: 'Online'
    });

    const [contests, setContests] = useState([]);
    const [filteredContests, setFilteredContests] = useState([]);
    const [contestSearch, setContestSearch] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch contests from Firestore
    useEffect(() => {
        const fetchContests = async () => {
            try {
                const q = query(collection(db, 'contests'), orderBy('scrapedAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const contestList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setContests(contestList);
                setFilteredContests(contestList);
            } catch (error) {
                console.error('Error fetching contests:', error);
            }
        };
        fetchContests();
    }, []);

    // Filter contests based on search
    useEffect(() => {
        if (contestSearch) {
            const filtered = contests.filter(contest =>
                contest.title?.toLowerCase().includes(contestSearch.toLowerCase())
            );
            setFilteredContests(filtered);
        } else {
            setFilteredContests(contests);
        }
    }, [contestSearch, contests]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddRole = (role) => {
        if (role && !formData.rolesNeeded.includes(role)) {
            setFormData({
                ...formData,
                rolesNeeded: [...formData.rolesNeeded, role]
            });
        }
    };

    const handleRemoveRole = (roleToRemove) => {
        setFormData({
            ...formData,
            rolesNeeded: formData.rolesNeeded.filter(role => role !== roleToRemove)
        });
    };

    const handleCategoryChange = (e) => {
        const newCategory = e.target.value;
        setFormData({
            ...formData,
            category: newCategory,
            rolesNeeded: [] // Clear roles when category changes
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        setIsSubmitting(true);

        try {
            // Save to Firestore
            const teamData = {
                name: formData.name,
                contestId: formData.contestId,
                description: formData.description,
                category: formData.category, // 팀 카테고리
                rolesNeeded: formData.rolesNeeded, // 모집 역할군
                region: formData.region,
                creatorId: user.uid,
                creatorName: user.name || user.displayName || 'Anonymous',
                createdAt: serverTimestamp(),
                members: [user.uid]
            };

            await addDoc(collection(db, 'teams'), teamData);

            alert('팀이 성공적으로 생성되었습니다!');
            navigate('/teams'); // Navigate to Team List page
        } catch (error) {
            console.error('Error creating team:', error);
            alert('팀 생성에 실패했습니다: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-100 bg-gray-50">
                        <h1 className="text-2xl font-bold text-gray-900">Create a New Team</h1>
                        <p className="mt-1 text-sm text-gray-500">Recruit members for your next project.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div>
                            <label htmlFor="contestId" className="block text-sm font-medium text-gray-700 mb-1">
                                Target Contest
                            </label>
                            {/* Search Input */}
                            <div className="relative mb-2">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="공모전 검색..."
                                    value={contestSearch}
                                    onChange={(e) => setContestSearch(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-lg border"
                                />
                            </div>
                            <select
                                id="contestId"
                                name="contestId"
                                value={formData.contestId}
                                onChange={handleChange}
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg"
                            >
                                <option value="">Select a contest</option>
                                {filteredContests.map(contest => (
                                    <option key={contest.id} value={contest.id}>
                                        {contest.title}
                                    </option>
                                ))}
                            </select>
                            <p className="mt-1 text-xs text-gray-500">
                                {filteredContests.length}개의 공모전
                            </p>
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Team Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-lg p-2.5 border"
                                placeholder="e.g., The Avengers"
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                required
                                value={formData.description}
                                onChange={handleChange}
                                className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-lg p-2.5 border"
                                placeholder="Tell us about your team's goal and what you are looking for."
                            />
                        </div>

                        {/* Category - Single Select */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                카테고리 (Category)
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleCategoryChange}
                                required
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg"
                            >
                                <option value="">카테고리를 선택하세요</option>
                                {getCategoryLabels().map((label) => (
                                    <option key={label} value={label}>{label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Roles - Multi-select based on selected category */}
                        {formData.category && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    모집 역할 (Roles)
                                </label>
                                <select
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            handleAddRole(e.target.value);
                                            e.target.value = ''; // Reset dropdown
                                        }
                                    }}
                                    className="block w-full pl-3 pr-10 py-2 mb-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg"
                                >
                                    <option value="">역할을 선택하세요...</option>
                                    {Object.values(CONTEST_CATEGORIES)
                                        .find(cat => cat.label === formData.category)
                                        ?.roles.filter(role => !formData.rolesNeeded.includes(role))
                                        .map((role) => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                </select>
                                <div className="flex flex-wrap gap-2">
                                    {formData.rolesNeeded.map((role) => (
                                        <span key={role} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                            {role}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveRole(role)}
                                                className="hover:bg-blue-200 rounded-full p-0.5"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                                Region / Preference
                            </label>
                            <select
                                id="region"
                                name="region"
                                value={formData.region}
                                onChange={handleChange}
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg"
                            >
                                <option value="Online">Online</option>
                                <option value="Seoul">Seoul</option>
                                <option value="Busan">Busan</option>
                                <option value="Incheon">Incheon</option>
                                <option value="Daegu">Daegu</option>
                                <option value="Daejeon">Daejeon</option>
                                <option value="Gwangju">Gwangju</option>
                                <option value="Ulsan">Ulsan</option>
                            </select>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? '생성 중...' : 'Create Team'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateTeamPage;

