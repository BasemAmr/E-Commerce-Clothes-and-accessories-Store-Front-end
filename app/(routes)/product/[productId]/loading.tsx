import Transition from '@/components/loading-transition';
import React from 'react';

const Loading: React.FC = () => {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <Transition />
        </div>
    );
};

export default Loading;