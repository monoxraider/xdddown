import React, { useState } from 'react';
import './App.css';

import { BsClipboard2, BsClipboard2Check } from "react-icons/bs";

function App() {
  const [videoUrl, setVideoUrl] = useState('');
  const [isClipboardCopied, setIsClipboardCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  async function handleClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      setVideoUrl(text);
      setIsClipboardCopied(true);
    } catch (error) {
      console.error('Failed to read clipboard contents:', error);
      alert('Failed to read clipboard contents');
    }
  }

  async function handleCopyToClipboard() {
    try {
      await navigator.clipboard.writeText(videoUrl);
      setIsClipboardCopied(true);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      alert('Failed to copy to clipboard');
    }
  }

  async function handleDownload() {
    try {
      setIsDownloading(true); // Set the state to indicate downloading is in progress

      const response = await fetch(`http://localhost:3001/download?url=${encodeURIComponent(videoUrl)}`);
      if (!response.ok) {
        throw new Error('Failed to download video');
      }

      const randomString = Math.random().toString(36).substring(2, 9);
      const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const filename = `video_${currentDate}_${randomString}.mp4`;

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setIsDownloading(false); // Reset the state once download is completed
    } catch (error) {
      console.error('Error downloading video:', error);
      alert('Error downloading video');
      setIsDownloading(false); // Reset the state in case of an error
    }
  }


  function handleButtonClick() {
    if (!isClipboardCopied) {
      handleClipboard();
    } else {
      handleCopyToClipboard();
    }
  }

  return (
    <div className="main">
      {isDownloading && (
        <div className="loading-progress">
          <svg
            style={{
              left: '50%',
              top: '20%',
              border: '1px solid #fa475356',
              borderRadius: '5px',
              position: 'absolute',
              transform: 'translate(-50%, -20%) matrix(1, 0, 0, 1, 0, 0)'
            }}
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 187.3 93.7"
            height="100px"
            width="200px"
          >
            <path
              d="M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1
            c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z"
              strokeMiterlimit="10"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="4"
              fill="none"
              id="outline"
              stroke="#fa4753"
            />
            <path
              d="M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1
            c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z"
              strokeMiterlimit="10"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="4"
              stroke="#fa4753"
              fill="none"
              opacity="0.05"
              id="outline-bg"
            />
          </svg>
        </div>
      )}
      <input placeholder="Paste the link here" className="input" name="text" type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)}></input>

      <div className="buttons">
        <button onClick={handleDownload} style={{ backgroundColor: isDownloading ? '#fa4753' : '' }}>
          {isDownloading ? 'Downloading...' : 'Download'}
        </button>
        <button onClick={handleButtonClick}>
          {isClipboardCopied ? <BsClipboard2Check /> : <BsClipboard2 />}
        </button>
      </div>
      <h1><span>coded :</span> Mono</h1>
    </div>
  );
}

export default App;
