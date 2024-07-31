import React, { useState, useEffect } from 'react';

const DisplayVideo = () => {
    const [videoUrl, setVideoUrl] = useState('');

    useEffect(() => {
        // Fetch the video URL from your backend or directly from S3
        const fetchVideoUrl = async () => {
            // For example, this could be a static URL or a URL fetched from your backend
            const videoUrl = 'https://simple-mern-bucket.s3.amazonaws.com/videos/2023-11-09+23-45-26.mp4';
            setVideoUrl(videoUrl);
        };

        fetchVideoUrl();
    }, []);

    return (
        <div>
            <h1>Video Player</h1>
            {videoUrl && (
                <video width="600" controls>
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            )}
        </div>
    );
};

export default DisplayVideo;
