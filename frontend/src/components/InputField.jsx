import React, { useState } from 'react'
import '../styles/FormField.css'
const InputField = ({ fieldName, type, id, error, value }) => {
    fieldName = fieldName.trim();
    const [description, setDescription] = useState("");
    return (
        <div className='input-box'>
            <label htmlFor={id}>
                {fieldName}&nbsp;&nbsp;:
            </label>
            {
                type != "textarea" &&
                <input
                    type={type || "text"}
                    placeholder={`Enter  ${fieldName}`}
                    id={id}
                    required
                    value={value ? value : null}
                />
                ||

                <div
                    className='textarea-container'
                >
                    <textarea
                        placeholder={`Enter  ${fieldName}`}
                        rows="7"
                        id={id}
                        value={description}
                        onChange={(event) => {

                            if (description.length < 500 || event.nativeEvent.data === null)
                                setDescription(event.target.value.trim())
                        }
                        }
                    >
                    </textarea>
                    <p
                        className='text-count'
                        style={
                            {
                                color: `${description.length < 400 ? "green" : description.length < 450 ? "orange" : "red"}`
                            }}
                    >
                        {description.length >= 500 ? "decription limit is only 500 words" : ""}
                        &nbsp;&nbsp;&nbsp;
                        {description.length}/500
                    </p>
                </div>

            }
            {
                error && <p className='error'>{error}</p>
            }
        </div>
    )
}

export default InputField