import React, { useContext } from 'react';
import { MusicContext } from './MusicPlayer';

export default function MusicToggle({ onClose }) {
  const {
    tracks,
    selectedTrackIndex,
    isPlaying,
    volume,
    muted,
    togglePlayPause,
    handleTrackChange,
    handleVolumeChange,
    handleMuteToggle,
    stopMusic
  } = useContext(MusicContext);

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="music-modal-overlay">
      <div className="music-modal">
        <h3 className="font-retro">🎵 Music Settings</h3>
        <label className="font-retro">Select Track:</label>
        <select
          value={selectedTrackIndex}
          onChange={(e) => handleTrackChange(parseInt(e.target.value))}
        >
          {tracks.map((track, index) => (
            <option key={index} value={index}>
              {track.name}
            </option>
          ))}
        </select>

        <button onClick={togglePlayPause} className="font-retro">
          {isPlaying ? '❚❚ Pause' : '▶ Play'}
        </button>

        <label className="font-retro">🔉 Volume:</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={muted ? 0 : volume}
          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
        />

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleMuteToggle} className="font-retro">
            {muted ? '🔊 Unmute' : '🔇 Mute'}
          </button>
          <button onClick={handleCancel} className="cancelButton font-retro">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
