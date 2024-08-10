// import React, { useState, useEffect } from 'react';

// const DisplayVideo = () => {
//     const [videoUrl, setVideoUrl] = useState('');

//     useEffect(() => {
//         // Fetch the video URL from your backend or directly from S3
//         const fetchVideoUrl = async () => {
//             // For example, this could be a static URL or a URL fetched from your backend
//             const videoUrl = 'https://simple-mern-bucket.s3.amazonaws.com/videos/2023-11-09+23-45-26.mp4';
//             setVideoUrl(videoUrl);
//         };

//         fetchVideoUrl();
//     }, []);

//     return (
//         <div>
//             <h1>Video Player</h1>
//             {videoUrl && (
//                 <video width="600" controls>
//                     <source src={videoUrl} type="video/mp4" />
//                     Your browser does not support the video tag.
//                 </video>
//             )}
//         </div>
//     );
// };

// export default DisplayVideo;


import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const DisplayVideo = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [expirationTime, setExpirationTime] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const {id} = useParams(); 
  const videoRef = useRef(null);

  const fetchVideoUrl = async () => {
    try {
      const token = sessionStorage.getItem('accessToken');
      const response = await axios.get(`http://localhost:4000/videos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setVideoUrl(response.data.url);
      setExpirationTime(Date.now() + 3 * 60 * 1000); // 3 minutes
    } catch (error) {
        setErrorMessage('Error fetching video URL'); //MIGHT NEED TO HANDLE ACCESS TOKEN EXPIRATION TOO
      console.error('Error fetching video URL', error);
    }
  };

  useEffect(() => {
    fetchVideoUrl();
  }, [id]); // Fetch URL when component mounts or when `id` changes

  useEffect(() => {
    // const intervalId = setInterval(() => {
    //   if (Date.now() >= expirationTime - 2 * 60 * 1000) { // 2 minutes before expiration
    //     fetchVideoUrl().then(() => {
    //       if (videoRef.current) {
    //         // Save the current playback position
    //         const currentTime = videoRef.current.currentTime;

    //         // Pause the video, update the URL, and resume playback
    //         videoRef.current.pause();
    //         videoRef.current.src = videoUrl;
    //         videoRef.current.load();
    //         videoRef.current.currentTime = currentTime;
    //         videoRef.current.play();
    //       }
    //     });
    //   }
    // }, 60 * 1000); // Check every minute

    const intervalId = setInterval(() => {
        if ((Date.now() >= expirationTime - 2 * 60 * 1000) && !errorMessage) { // 2 minutes before expiration
          fetchVideoUrl().then(() => {
            if (videoRef.current) {
              const isPlaying = !videoRef.current.paused && !videoRef.current.ended;
              const currentTime = videoRef.current.currentTime;
  
              videoRef.current.pause();
              videoRef.current.oncanplay = () => {
                videoRef.current.currentTime = currentTime;
                if (isPlaying) {
                  videoRef.current.play();
                }
                videoRef.current.oncanplay = null;
              };
  
              videoRef.current.src = videoUrl;
              videoRef.current.load();
            }
          });
        }
      }, 60 * 1000); // Check every minute

    return () => clearInterval(intervalId);
  }, [expirationTime, videoUrl]); // Check for expirationTime and videoUrl changes


  return (
    // <div>
    //   {videoUrl ? (
    //     <video ref={videoRef} src={videoUrl} controls />
    //   ) : (
    //     <p>Loading video...</p>
    //   )}
    // </div>

    <div style={{ position: 'relative', width: '600px' }}>
      {videoUrl ? (
        <video ref={videoRef} controls width="600">
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <video controls width="600">
          <p>Your browser does not support the video tag.</p>
        </video>
      )}
      {errorMessage && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
            zIndex: 1,
          }}
        >
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default DisplayVideo;
