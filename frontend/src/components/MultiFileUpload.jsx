/* import React, { useState } from 'react'
import "../styles/FileUpload.css"
const MultiFileUpload = ({ fieldName, id, data, setData }) => {
    const [imageUrls, setImageUrls] = useState([]);
    function updateData() {
        console.log(data);

        data[id] = imageUrls
        setData(data);
    }
    async function handleChange() {
        const imageUpload = document.getElementById("imageUpload");


        const fileReader = new FileReader();
        fileReader.readAsDataURL(imageUpload.files[0]);

        fileReader.onload = () => {
            imageUrls.push(fileReader.result);
            setImageUrls([...imageUrls]);
            updateData()



        }

    }
    function handleDelete(index) {
        imageUrls.pop(index);
        setImageUrls([...imageUrls]);

    }
    let previewImages = [];
    for (let i = 0; i < imageUrls.length; i++) {
        previewImages.push(
            <div
                className='preview-image'
                key={imageUrls[i]}
            >
                <img
                    src={imageUrls[i]}
                    alt=""
                    id='coverImage'
                    height="300px"
                    width="300px"
                />
                <div>

                    <div
                        className='closeButton'
                        onClick={() => handleDelete(i)}
                    >
                        <div>
                            <div className="close close1"></div>
                            <div className="close close2"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className='file-upload'>
            <label htmlFor="imageUpload">{fieldName.trim()}</label>
            <div className='file-uploader'>
                <h2>Drag and Drop the files</h2>
                <br />
                <button>
                    Browse Files
                </button>
                <input
                    type="file"
                    accept='.png,.jpg,.jpeg,.svg,.webp'
                    name="imageUpload"
                    id="imageUpload"
                    onChange={handleChange}
                    required
                />
            </div>
            {imageUrls.length ? previewImages : ""}
        </div>
    )
}

export default MultiFileUpload */

import React, { useState } from 'react'
import "../styles/FileUpload.css"
import { compressAndConvert } from '../utils/imageCompression'

const MultiFileUpload = ({ fieldName, id, data, setData }) => {
    const [imageUrls, setImageUrls] = useState([]);
    const [isCompressing, setIsCompressing] = useState(false);

    function updateData(urls) {
        data[id] = urls || imageUrls;
        setData({ ...data }); // Create new object to trigger re-render
    }

    async function handleChange() {
        const imageUpload = document.getElementById("imageUpload");
        const file = imageUpload.files[0];

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
                const newImageUrls = [...imageUrls, compressedBase64];
                setImageUrls(newImageUrls);
                updateData(newImageUrls);
            } else {
                // Fallback to original file reading if compression fails
                const fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onload = () => {
                    const newImageUrls = [...imageUrls, fileReader.result];
                    setImageUrls(newImageUrls);
                    updateData(newImageUrls);
                }
            }
        } catch (error) {
            console.error('Error processing image:', error);
            // Fallback to original file reading
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                const newImageUrls = [...imageUrls, fileReader.result];
                setImageUrls(newImageUrls);
                updateData(newImageUrls);
            }
        } finally {
            setIsCompressing(false);
            // Clear the input so the same file can be selected again
            imageUpload.value = '';
        }
    }

    function handleDelete(index) {
        const newImageUrls = imageUrls.filter((_, i) => i !== index);
        setImageUrls(newImageUrls);
        updateData(newImageUrls);
    }

    let previewImages = [];
    for (let i = 0; i < imageUrls.length; i++) {
        previewImages.push(
            <div
                className='preview-image'
                key={`${imageUrls[i]}-${i}`} // Better key using index
            >
                <img
                    src={imageUrls[i]}
                    alt=""
                    id={`itemImage-${i}`} // Unique IDs
                    height="300px"
                    width="300px"
                />
                <div>
                    <div
                        className='closeButton'
                        onClick={() => handleDelete(i)}
                    >
                        <div>
                            <div className="close close1"></div>
                            <div className="close close2"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='file-upload'>
            <label htmlFor="imageUpload">{fieldName.trim()}</label>
            <div className='file-uploader'>
                <h2>Drag and Drop the files</h2>
                <br />
                <button disabled={isCompressing}>
                    {isCompressing ? 'Compressing...' : 'Browse Files'}
                </button>
                <input
                    type="file"
                    accept='.png,.jpg,.jpeg,.svg,.webp'
                    name="imageUpload"
                    id="imageUpload"
                    onChange={handleChange}
                    disabled={isCompressing}
                    required={imageUrls.length ? false : true}
                />
                {isCompressing && <p>Optimizing image, please wait...</p>}
            </div>
            {imageUrls.length ? previewImages : ""}
        </div>
    )
}

export default MultiFileUpload