import React, { useState } from 'react';

const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <div>
            <h2>Music Player</h2>
            <button onClick={togglePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
            {/* Add more controls here */}
        </div>
    );
};

export default MusicPlayer;