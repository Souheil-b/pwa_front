import Camera from '@/components/Camera';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function TopBar({ }) {
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const handleSearchBar = () => {
        router.push({
            pathname: '/search',
            query: {
                searchTerm: searchTerm
            },
        });
    };

    const handleGoBack = () => {
        router.back();
    };

    const handleGoToFavorites = () => {
        router.push('/favorites');
    };

    const handleGoToHome = () => {
        router.push('/home');
    };

    const handleDisconnect = () => {
        localStorage.removeItem('connectionCookie');
        localStorage.removeItem('favorites');
        localStorage.removeItem('token')
        router.push('/');
    };

    return (
        <div className="bg-gray-800 text-black p-4 flex justify-between items-center w-full">
            <button onClick={handleGoBack} className="mr-4 text-white">
                <img src="./black.svg" alt="back arrow" className="h-2 w-2 object-cover" />
            </button>
            <div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="px-3 py-2 rounded-md focus:outline-none focus:border-blue-500 bg-gray-200 text-gray-800 placeholder-gray-500"
                />
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md" onClick={handleSearchBar}>
                    Search
                </button>
            </div>
            <div className="flex items-center space-x-4">
                <Camera />
                <button onClick={handleGoToFavorites} className="text-sm text-black px-4 py-2 rounded-md bg-transparent border border-black">Favorite Meals</button>
                <button onClick={handleGoToHome} className="text-sm text-blue-500 px-4 py-2 rounded-md bg-transparent border border-blue-500 hover:bg-blue-500 hover:text-white">
                    Home
                </button>
                <button onClick={handleDisconnect} className="text-sm text-red-500 px-4 py-2 rounded-md bg-transparent border border-red-500 hover:bg-red-500 hover:text-white">
                    Disconnect
                </button>
            </div>
        </div>
    );
}
