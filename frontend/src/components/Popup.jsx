/* import React, { useState } from 'react'
import '../styles/Popup.css'
const Popup = ({ statusCode }) => {
    const [isShowing, setIsShowing] = useState(true);
    return (
        <div className='registration-success'>
            <section>
                <h1>{statusCode < 300 ? "Item Added to Database Successfully" : "Error While Adding Data to Database"}</h1>
            </section>
        </div>
    )
}

export default Popup */
import React, { useState } from 'react'
import '../styles/Popup.css'

const Popup = ({ statusCode, onClose }) => {
    const [isShowing, setIsShowing] = useState(true);

    const isSuccess = statusCode < 300;

    const handleClose = () => {
        setIsShowing(false);
        window.location.reload();
        if (onClose) {
            onClose();
        }
    };

    if (!isShowing) return null;

    return (
        <div className='registration-success'>
            <section className={isSuccess ? 'success' : 'error'}>
                <div className="popup-content">
                    <h1>
                        {isSuccess
                            ? "Item Added to Database Successfully"
                            : "Error While Adding Data to Database"
                        }
                    </h1>
                </div>

                <button
                    className="close-button"
                    onClick={handleClose}
                >
                    OK
                </button>
            </section>
        </div>
    )
}

export default Popup