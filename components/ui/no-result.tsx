import React from 'react';

const NoResult: React.FC = () => {
    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h2>No Results Found</h2>
            <p>Try adjusting your search or filter to find what you&apos;re looking for.</p>
        </div>
    );
};

export default NoResult;