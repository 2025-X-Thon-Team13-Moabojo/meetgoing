import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { contests } from '../data/contests';

const CreateTeamPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const contestId = searchParams.get('contestId');

    const [formData, setFormData] = useState({
        name: '',
        contestId: contestId || '',
        description: '',
        rolesNeeded: '',
        stack: '',
        region: 'Online'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Create Team:', formData);
        navigate('/teams');
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
                                className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                Create Team
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateTeamPage;
