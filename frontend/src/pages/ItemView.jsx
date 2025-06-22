/* import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ImageCarousel from '../components/ImageCarousel';
import '../styles/ItemView.css';

const ItemView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allImages, setAllImages] = useState([]);

    useEffect(() => {
        fetchItem();
    }, [id]);

    const fetchItem = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/api/items/${id}`);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Item not found');
                }
                throw new Error('Failed to fetch item');
            }
            const data = await response.json();
            setItem(data);

            // Combine cover image and item images for carousel
            const images = [];
            if (data.coverImage) {
                images.push({
                    url: data.coverImage,
                    alt: `${data.name} - Cover Image`,
                    isCover: true
                });
            }
            if (data.itemImages && data.itemImages.length > 0) {
                data.itemImages.forEach((img, index) => {
                    images.push({
                        url: img,
                        alt: `${data.name} - Image ${index + 1}`,
                        isCover: false
                    });
                });
            }
            setAllImages(images);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };



    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading item details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>Error: {error}</p>
                <div className="error-actions">
                    <button onClick={fetchItem} className="retry-btn">
                        Try Again
                    </button>
                    <button onClick={() => navigate('/items')} className="back-btn">
                        Back to Items
                    </button>
                </div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="error-container">
                <p>Item not found</p>
                <button onClick={() => navigate('/items')} className="back-btn">
                    Back to Items
                </button>
            </div>
        );
    }

    return (
        <div className="item-view-container">
            <button
                onClick={() => navigate('/items')}
                className="back-button"
            >
                ← Back to Items
            </button>

            <div className="item-view-content">
                <div className="item-images-section">
                    {allImages.length > 0 ? (
                        <ImageCarousel images={allImages} />
                    ) : (
                        <div className="no-images-placeholder">
                            <span>No Images Available</span>
                        </div>
                    )}
                </div>

                <div className="item-info-section">
                    <div className="item-header">
                        <h1 className="item-title">{item.name}</h1>
                        <span className="item-type-badge">{item.type}</span>
                    </div>

                    <div className="item-description-section">
                        <h3>Description</h3>
                        <p className="item-description">{item.description}</p>
                    </div>

                    <div className="item-details-grid">
                        <div className="detail-item">
                            <label>Item Type:</label>
                            <span>{item.type}</span>
                        </div>
                        <div className="detail-item">
                            <label>Added On:</label>
                            <span>{formatDate(item.created_at)}</span>
                        </div>
                        <div className="detail-item">
                            <label>Total Images:</label>
                            <span>{allImages.length}</span>
                        </div>
                        <div className="detail-item">
                            <label>Item ID:</label>
                            <span>{item.id}</span>
                        </div>
                    </div>

                    <div className="action-buttons">
                        <button>Equire</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemView; */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ImageCarousel from '../components/ImageCarousel';
import '../styles/ItemView.css';

const ItemView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allImages, setAllImages] = useState([]);

    // Enquiry modal states
    const [showEnquiryModal, setShowEnquiryModal] = useState(false);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [enquiryLoading, setEnquiryLoading] = useState(false);
    const [enquirySuccess, setEnquirySuccess] = useState(false);
    const [enquiryError, setEnquiryError] = useState('');

    useEffect(() => {
        fetchItem();
    }, [id]);

    const fetchItem = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/api/items/${id}`);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Item not found');
                }
                throw new Error('Failed to fetch item');
            }
            const data = await response.json();
            setItem(data);

            // Combine cover image and item images for carousel
            const images = [];
            if (data.coverImage) {
                images.push({
                    url: data.coverImage,
                    alt: `${data.name} - Cover Image`,
                    isCover: true
                });
            }
            if (data.itemImages && data.itemImages.length > 0) {
                data.itemImages.forEach((img, index) => {
                    images.push({
                        url: img,
                        alt: `${data.name} - Image ${index + 1}`,
                        isCover: false
                    });
                });
            }
            setAllImages(images);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEnquirySubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setEnquiryError('Email is required');
            return;
        }

        try {
            setEnquiryLoading(true);
            setEnquiryError('');

            const response = await fetch('http://localhost:5000/api/enquiry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    message: message || `I am interested in the item: ${item.name}`,
                    itemId: item.id,
                    itemName: item.name,
                    itemType: item.type
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send enquiry');
            }

            setEnquirySuccess(true);
            setTimeout(() => {
                setShowEnquiryModal(false);
                setEnquirySuccess(false);
                setEmail('');
                setMessage('');
            }, 2000);

        } catch (err) {
            setEnquiryError(err.message);
        } finally {
            setEnquiryLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading item details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>Error: {error}</p>
                <div className="error-actions">
                    <button onClick={fetchItem} className="retry-btn">
                        Try Again
                    </button>
                    <button onClick={() => navigate('/items')} className="back-btn">
                        Back to Items
                    </button>
                </div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="error-container">
                <p>Item not found</p>
                <button onClick={() => navigate('/items')} className="back-btn">
                    Back to Items
                </button>
            </div>
        );
    }

    return (
        <div className="item-view-container">
            <button
                onClick={() => navigate('/items')}
                className="back-button"
            >
                ← Back to Items
            </button>

            <div className="item-view-content">
                <div className="item-images-section">
                    {allImages.length > 0 ? (
                        <ImageCarousel images={allImages} />
                    ) : (
                        <div className="no-images-placeholder">
                            <span>No Images Available</span>
                        </div>
                    )}
                </div>

                <div className="item-info-section">
                    <div className="item-header">
                        <h1 className="item-title">{item.name}</h1>
                        <span className="item-type-badge">{item.type}</span>
                    </div>

                    <div className="item-description-section">
                        <h3>Description</h3>
                        <p className="item-description">{item.description}</p>
                    </div>

                    <div className="item-details-grid">
                        <div className="detail-item">
                            <label>Item Type:</label>
                            <span>{item.type}</span>
                        </div>
                        <div className="detail-item">
                            <label>Added On:</label>
                            <span>{formatDate(item.created_at)}</span>
                        </div>
                        <div className="detail-item">
                            <label>Total Images:</label>
                            <span>{allImages.length}</span>
                        </div>
                        <div className="detail-item">
                            <label>Item ID:</label>
                            <span>{item.id}</span>
                        </div>
                    </div>

                    <div className="action-buttons">
                        <button onClick={() => setShowEnquiryModal(true)}>
                            Enquire
                        </button>
                    </div>
                </div>
            </div>

            {/* Enquiry Modal */}
            {showEnquiryModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Enquire About: {item.name}</h3>
                            <button
                                className="modal-close"
                                onClick={() => setShowEnquiryModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        {enquirySuccess ? (
                            <div className="success-message">
                                <p>✓ Enquiry sent successfully!</p>
                                <p>We'll get back to you soon.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleEnquirySubmit} className="enquiry-form">
                                <div className="form-group">
                                    <label htmlFor="email">Email Address *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email address"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message">Message (Optional)</label>
                                    <textarea
                                        id="message"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder={`I am interested in the item: ${item.name}`}
                                        rows="4"
                                    />
                                </div>

                                {enquiryError && (
                                    <div className="error-message">
                                        <p>{enquiryError}</p>
                                    </div>
                                )}

                                <div className="modal-actions">
                                    <button
                                        type="button"
                                        onClick={() => setShowEnquiryModal(false)}
                                        className="cancel-btn"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={enquiryLoading}
                                        className="submit-btn"
                                    >
                                        {enquiryLoading ? 'Sending...' : 'Send Enquiry'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemView;