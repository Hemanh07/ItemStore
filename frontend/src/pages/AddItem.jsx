/* import React, { useState } from 'react'
import InputField from '../components/InputField'
import "../styles/AddItem.css"
import DropDown from '../components/DropDown'
import SingleFileUpload from '../components/SingleFileUpload'
import MultiFileUpload from '../components/MultiFileUpload'
import Popup from '../components/Popup'
const AddItem = () => {
    const [item, setItem] = useState({
        name: "",
        type: "",
        description: "",
        coverImage: "",
        itemImages: []
    })
    function handleChange(event) {
        let id = event.target.id;
        let value = event.target.value.trim();
        item[id] = value;

        setItem({ ...item })
    }
    async function handleSubmit(event) {
        event.preventDefault();
        try {
            let response = await fetch('http://localhost:5000/api/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item)
            });
            <Popup
                statusCode={response.status}
            />
        } catch (error) {
            <Popup
                statusCode={response.status}
            />
        }
    }
    return (
        <form
            onChange={handleChange}
            onSubmit={handleSubmit}
        >

            <InputField
                fieldName="Item Name"
                id="name"
            />
            <DropDown
                fieldName="Item Type"
                id="type"
                list={
                    [
                        {
                            label: "Shirt",
                            value: "shirt"
                        }, {
                            label: "Pant",
                            value: "pant"
                        }, {
                            label: "shoes",
                            value: "Shoes"
                        }, {
                            label: "Shorts",
                            value: "shorts"
                        },

                    ]
                }
            />
            <InputField
                fieldName="Description"
                id="description"
                type="textarea"
            />
            <SingleFileUpload
                fieldName="Cover Image"
                id="coverImage"
                data={item}
                setData={setItem}
            />
            <MultiFileUpload
                fieldName="Item Images"
                id="itemImages"
                data={item}
                setData={setItem}
            />
            <button type="submit">Add</button>
        </form>
    )
}

export default AddItem */

import React, { useState } from 'react'
import InputField from '../components/InputField'
import "../styles/AddItem.css"
import DropDown from '../components/DropDown'
import SingleFileUpload from '../components/SingleFileUpload'
import MultiFileUpload from '../components/MultiFileUpload'
import Popup from '../components/Popup'

const AddItem = () => {
    const [item, setItem] = useState({
        name: "",
        type: "",
        description: "",
        coverImage: "",
        itemImages: []
    })
    const [showPopup, setShowPopup] = useState(false);
    const [popupStatus, setPopupStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleChange(event) {
        let id = event.target.id;
        let value = event.target.value.trim();

        setItem(prevItem => ({
            ...prevItem,
            [id]: value
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (!item.name || !item.type || !item.description) {
            alert('Please fill in all required fields');
            return;
        }

        if (!item.coverImage) {
            alert('Please upload a cover image');
            return;
        }

        setIsSubmitting(true);

        try {
            const payloadSize = JSON.stringify(item).length;
            console.log(`Payload size: ${(payloadSize / 1024 / 1024).toFixed(2)}MB`);

            let response = await fetch('http://localhost:5000/api/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item)
            });

            setPopupStatus(response.status);
            setShowPopup(true);

            if (response.ok) {
                setItem({
                    name: "",
                    type: "",
                    description: "",
                    coverImage: "",
                    itemImages: []
                });

                const coverImageUpload = document.getElementById("coverImageUpload");
                const imageUpload = document.getElementById("imageUpload");
                if (coverImageUpload) coverImageUpload.value = '';
                if (imageUpload) imageUpload.value = '';

            }

        } catch (error) {
            console.error('Submit error:', error);
            setPopupStatus(500);
            setShowPopup(true);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <form
                onChange={handleChange}
                onSubmit={handleSubmit}
            >
                <InputField
                    fieldName="Item Name"
                    id="name"
                    value={item.name}
                />
                <DropDown
                    fieldName="Item Type"
                    id="type"
                    value={item.type}
                    list={[
                        {
                            label: "Shirt",
                            value: "shirt"
                        }, {
                            label: "Pant",
                            value: "pant"
                        }, {
                            label: "Shoes",
                            value: "shoes"
                        }, {
                            label: "Shorts",
                            value: "shorts"
                        },
                    ]}
                />
                <InputField
                    fieldName="Description"
                    id="description"
                    type="textarea"
                    value={item.description}
                />
                <SingleFileUpload
                    fieldName="Cover Image"
                    id="coverImage"
                    data={item}
                    setData={setItem}
                />
                <MultiFileUpload
                    fieldName="Item Images"
                    id="itemImages"
                    data={item}
                    setData={setItem}
                />
                <button
                    type="submit"
                    id='submit'
                    disabled={isSubmitting}
                    style={{
                        opacity: isSubmitting ? 0.6 : 1,
                        cursor: isSubmitting ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isSubmitting ? 'Adding Item...' : 'Add'}
                </button>
            </form>

            {showPopup && (
                <Popup
                    statusCode={popupStatus}
                    onClose={() => setShowPopup(false)}
                />
            )}
        </>
    )
}

export default AddItem