import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import TeamCard from '../components/features/TeamCard';

const TeamListPage = () => {
    // Mock Data
    const teams = [
        {
            id: 1,
            name: "Pizza Lovers",
            contestName: "2025 파파존스 레시피 공모전",
            status: "Recruiting",
            description: "We are looking for a creative chef and a designer to create the best pizza recipe presentation.",
            rolesNeeded: ["Designer", "Planner"],
            stack: ["Figma", "PPT"],
            region: "Seoul"
        },
        {
            id: 2,
            name: "Sky High",
            contestName: "2025 제17회 전국청소년 모형항공기대회",
            status: "Recruiting",
            description: "Join us to build the most aerodynamic model plane. Need engineering enthusiasts!",
            rolesNeeded: ["Engineer", "Builder"],
            stack: ["CAD", "3D Printing"],
            region: "Busan"
        },
        {
            id: 3,
            name: "Code Wizards",
            contestName: "영상제작자 실전 포트폴리오 공모전",
            status: "Closed",
            description: "Full stack team looking for one last frontend developer.",
            rolesNeeded: ["Frontend"],
            stack: ["React", "Node.js"],
            region: "Online"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Find a Team</h1>
                        <p className="mt-2 text-gray-600">Join a team and start your journey.</p>
                    </div>
                    <Link
                        to="/teams/new"
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Create Team
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search teams by name, contest, or stack..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teams.map(team => (
                        <TeamCard key={team.id} team={team} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeamListPage;
