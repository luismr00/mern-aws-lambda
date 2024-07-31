import React, { useState } from 'react';

const UploadImage = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        // Get the pre-signed URL from the backend
        const response = await fetch(`http://localhost:4000/generate-presigned-url?fileName=${selectedFile.name}&fileType=${selectedFile.type}`);
        const { url } = await response.json();

        // Upload the file to S3 using the pre-signed URL
        const uploadResponse = await fetch(url, {
            method: 'PUT',
            body: selectedFile,
            headers: {
                'Content-Type': selectedFile.type
            }
        });

        if (uploadResponse.ok) {
            setImageUrl(url.split('?')[0]); // The URL of the uploaded file without the query string
        } else {
            console.error('Error uploading image');
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            {imageUrl && <img src={imageUrl} alt="Uploaded" />}
        </div>
    );
};

export default UploadImage;
