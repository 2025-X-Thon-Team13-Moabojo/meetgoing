import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { ArrowLeft } from 'lucide-react';

const ContestDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [contest, setContest] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContest = async () => {
            try {
                const docRef = doc(db, 'contests', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setContest(docSnap.data());

                    // Increment view count
                    try {
                        await updateDoc(docRef, {
                            viewCount: increment(1)
                        });
                    } catch (e) {
                        console.error("Error incrementing view count:", e);
                    }
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching contest:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContest();
    }, [id]);

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (!contest) return <div className="flex justify-center items-center h-screen">Contest not found</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900 truncate">{contest.title}</h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
                        {/* Left: Poster */}
                        <div className="flex justify-center bg-gray-100 rounded-xl p-4">
                            {contest.posterUrl ? (
                                <img
                                    src={contest.posterUrl}
                                    alt={contest.title}
                                    className="max-w-full h-auto max-h-[800px] object-contain rounded-lg shadow-sm"
                                />
                            ) : (
                                <div className="w-full h-96 flex items-center justify-center text-gray-400">No Poster Available</div>
                            )}
                        </div>

                        {/* Right: Info */}
                        <div className="space-y-6">
                            <div>
                                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full mb-2">
                                    {contest.category}
                                </span>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">{contest.title}</h2>
                                <div className="flex items-center space-x-4 mb-6">
                                    <span className="bg-orange-100 text-orange-800 font-bold px-3 py-1 rounded-lg">
                                        {contest.dDay}
                                    </span>
                                    <span className="text-gray-600 font-medium">
                                        {contest.condition}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">상세 정보</h3>
                                <div className="space-y-3">
                                    {contest.infoTable && Object.entries(contest.infoTable).map(([key, value]) => (
                                        <div key={key} className="flex flex-col sm:flex-row sm:items-start border-b border-gray-200 last:border-0 pb-3 last:pb-0">
                                            <span className="w-32 font-medium text-gray-500 shrink-0">{key}</span>
                                            <span className="text-gray-900 flex-1 break-words">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4">
                                <a
                                    href={contest.originalLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md hover:shadow-lg"
                                >
                                    원문 보러가기 (콘테스트코리아)
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Bottom: Full Content */}
                    {contest.contentHtml && (
                        <div className="border-t border-gray-200 p-6 lg:p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">상세 요강</h3>
                            <div
                                className="prose max-w-none prose-img:rounded-xl prose-a:text-blue-600 prose-headings:text-gray-900"
                                dangerouslySetInnerHTML={{ __html: contest.contentHtml }}
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ContestDetailPage;
