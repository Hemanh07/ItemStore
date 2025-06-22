/* import React, { useState } from 'react'
import "../styles/FileUpload.css"
const SingleFileUpload = ({ fieldName, id, data, setData }) => {
    const [isUploaded, setIsUploaded] = useState(false);
    function updateData(url) {
        data[id] = url;
        setData(data);
        setIsUploaded(true)
    }
    async function handleChange(event) {

        const coverImageUpload = document.getElementById("coverImageUpload");
        const coverImage = document.getElementById("coverImage");


        const fileReader = new FileReader();
        fileReader.readAsDataURL(coverImageUpload.files[0]);

        fileReader.onload = () => {
            coverImage.src = fileReader.result;
            updateData(fileReader.result);
        }
    }
    return (
        <div className='file-upload'>
            <label htmlFor="coverImageUpload">{fieldName.trim()}</label>
            {!isUploaded && <div className='file-uploader'>
                <h2>Drag and Drop the file</h2>
                <br />
                <button>
                    Browse Files
                </button>
                <input
                    type="file"
                    accept='.png,.jpg,.jpeg,.svg,.webp'
                    name="coverImageUpload"
                    id="coverImageUpload"
                    onChange={handleChange}
                    required
                />
            </div>}
            <div>

                <img
                    src='dummy.png'
                    alt=""
                    id='coverImage'
                    height="300px"
                    width="300px"
                />
                {isUploaded && < h3 onClick={() => setIsUploaded(false)}>Change {fieldName}</h3>}
            </div>

        </div >
    )
}

export default SingleFileUpload */
import React, { useState } from 'react'
import "../styles/FileUpload.css"
import { compressAndConvert } from '../utils/imageCompression'

const SingleFileUpload = ({ fieldName, id, data, setData }) => {
    const [isUploaded, setIsUploaded] = useState(false);
    const [isCompressing, setIsCompressing] = useState(false);

    function updateData(url) {
        data[id] = url;
        setData({ ...data }); // Create new object to trigger re-render
        setIsUploaded(true)
    }

    async function handleChange(event) {
        const coverImageUpload = document.getElementById("coverImageUpload");
        const coverImage = document.getElementById("coverImage");
        const file = coverImageUpload.files[0];

        if (!file) return;

        setIsCompressing(true);

        try {
            // Compress image based on file size
            let maxWidth = 800;
            let quality = 0.8;

            // Adjust compression based on file size
            const fileSizeMB = file.size / 1024 / 1024;
            if (fileSizeMB > 5) {
                maxWidth = 600;
                quality = 0.6;
            } else if (fileSizeMB > 2) {
                maxWidth = 700;
                quality = 0.7;
            }

            const compressedBase64 = await compressAndConvert(file, maxWidth, quality);

            if (compressedBase64) {
                coverImage.src = compressedBase64;
                updateData(compressedBase64);
            } else {
                // Fallback to original file reading if compression fails
                const fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onload = () => {
                    coverImage.src = fileReader.result;
                    updateData(fileReader.result);
                }
            }
        } catch (error) {
            console.error('Error processing image:', error);
            // Fallback to original file reading
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                coverImage.src = fileReader.result;
                updateData(fileReader.result);
            }
        } finally {
            setIsCompressing(false);
        }
    }

    return (
        <div className='file-upload'>
            <label htmlFor="coverImageUpload">{fieldName.trim()}</label>
            {!isUploaded && <div className='file-uploader'>
                <h2>Drag and Drop the file</h2>
                <br />
                <button disabled={isCompressing}>
                    {isCompressing ? 'Compressing...' : 'Browse Files'}
                </button>
                <input
                    type="file"
                    accept='.png,.jpg,.jpeg,.svg,.webp'
                    name="coverImageUpload"
                    id="coverImageUpload"
                    onChange={handleChange}
                    required
                    disabled={isCompressing}
                />
                {isCompressing && <p>Optimizing image, please wait...</p>}
            </div>}
            <div>
                <img
                    src='dummy.png'
                    alt=""
                    id='coverImage'
                    height="300px"
                    width="300px"
                />
                {isUploaded && <h3 onClick={() => setIsUploaded(false)}>Change {fieldName}</h3>}
            </div>
        </div>
    )
}

export default SingleFileUpload