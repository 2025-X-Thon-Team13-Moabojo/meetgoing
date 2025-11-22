import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
<<<<<<< HEAD
import { ArrowLeft } from 'lucide-react';
import { contests } from '../data/contests';
=======
import { ArrowLeft, Plus, X } from 'lucide-react';
import { contests } from '../data/contests';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
>>>>>>> 0befbef76cfcc4c50d8a8bd4fbe3ac93ce05880a

const CreateTeamPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const contestId = searchParams.get('contestId');
<<<<<<< HEAD
=======
    const { user } = useAuth();
>>>>>>> 0befbef76cfcc4c50d8a8bd4fbe3ac93ce05880a

    const [formData, setFormData] = useState({
        name: '',
        contestId: contestId || '',
        description: '',
<<<<<<< HEAD
        rolesNeeded: '',
        stack: '',
        region: 'Online'
    });

=======
        rolesNeeded: [],
        techStack: [],
        region: 'Online'
    });

    const [inputs, setInputs] = useState({
        role: '',
        tech: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

>>>>>>> 0befbef76cfcc4c50d8a8bd4fbe3ac93ce05880a
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

<<<<<<< HEAD
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Create Team:', formData);
        navigate('/teams');
=======
    const handleAddRole = () => {
        if (inputs.role.trim() && !formData.rolesNeeded.includes(inputs.role.trim())) {
            setFormData({
                ...formData,
                rolesNeeded: [...formData.rolesNeeded, inputs.role.trim()]
            });
            setInputs({ ...inputs, role: '' });
        }
    };

    const handleRemoveRole = (roleToRemove) => {
        setFormData({
            ...formData,
            rolesNeeded: formData.rolesNeeded.filter(role => role !== roleToRemove)
        });
    };

    const handleAddTech = () => {
        if (inputs.tech.trim() && !formData.techStack.includes(inputs.tech.trim())) {
            setFormData({
                ...formData,
                techStack: [...formData.techStack, inputs.tech.trim()]
            });
            setInputs({ ...inputs, tech: '' });
        }
    };

    const handleRemoveTech = (techToRemove) => {
        setFormData({
            ...formData,
            techStack: formData.techStack.filter(tech => tech !== techToRemove)
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
                rolesNeeded: formData.rolesNeeded,
                techStack: formData.techStack,
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
>>>>>>> 0befbef76cfcc4c50d8a8bd4fbe3ac93ce05880a
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
                            <select
                                id="contestId"
                                name="contestId"
                                value={formData.contestId}
                                onChange={handleChange}
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg"
                            >
                                <option value="">Select a contest</option>
                                {contests.map(contest => (
                                    <option key={contest.id} value={contest.id}>
                                        {contest.title}
                                    </option>
                                ))}
                            </select>
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

<<<<<<< HEAD
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="rolesNeeded" className="block text-sm font-medium text-gray-700 mb-1">
                                    Roles Needed
                                </label>
                                <input
                                    type="text"
                                    name="rolesNeeded"
                                    id="rolesNeeded"
                                    value={formData.rolesNeeded}
                                    onChange={handleChange}
                                    className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-lg p-2.5 border"
                                    placeholder="e.g., Designer, Frontend Dev"
                                />
                                <p className="mt-1 text-xs text-gray-500">Comma separated</p>
                            </div>

                            <div>
                                <label htmlFor="stack" className="block text-sm font-medium text-gray-700 mb-1">
                                    Tech Stack
                                </label>
                                <input
                                    type="text"
                                    name="stack"
                                    id="stack"
                                    value={formData.stack}
                                    onChange={handleChange}
                                    className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-lg p-2.5 border"
                                    placeholder="e.g., React, Figma"
                                />
                                <p className="mt-1 text-xs text-gray-500">Comma separated</p>
=======
                        {/* Roles Needed - Multi-select */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Roles Needed
                            </label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={inputs.role}
                                    onChange={(e) => setInputs({ ...inputs, role: e.target.value })}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRole())}
                                    className="flex-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-lg p-2.5 border"
                                    placeholder="e.g., Frontend Developer"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddRole}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
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

                        {/* Tech Stack - Multi-select */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tech Stack
                            </label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={inputs.tech}
                                    onChange={(e) => setInputs({ ...inputs, tech: e.target.value })}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                                    className="flex-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-lg p-2.5 border"
                                    placeholder="e.g., React"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddTech}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.techStack.map((tech) => (
                                    <span key={tech} className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                        {tech}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTech(tech)}
                                            className="hover:bg-green-200 rounded-full p-0.5"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
>>>>>>> 0befbef76cfcc4c50d8a8bd4fbe3ac93ce05880a
                            </div>
                        </div>

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
<<<<<<< HEAD
                                className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                Create Team
=======
                                disabled={isSubmitting}
                                className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? '생성 중...' : 'Create Team'}
>>>>>>> 0befbef76cfcc4c50d8a8bd4fbe3ac93ce05880a
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateTeamPage;
<<<<<<< HEAD
=======

>>>>>>> 0befbef76cfcc4c50d8a8bd4fbe3ac93ce05880a
