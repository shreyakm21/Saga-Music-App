import React, { useState } from 'react';

const Playlist = () => {
    const [songs, setSongs] = useState([]);

    const addSong = () => {
        // Logic to add a song (e.g., form input)
    };

    return (
        <div>
            <h2>Your Playlist</h2>
            <button onClick={addSong}>Add Song</button>
            <ul>
                {songs.map((song, index) => (
                    <li key={index}>{song.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Playlist;
