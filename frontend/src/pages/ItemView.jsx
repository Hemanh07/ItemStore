/* 
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
            const response = await fetch(`https://itemstore-03el.onrender.com/api/items/${id}`);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Item not found');
                }
                throw new Error('Failed to fetch item');
            }
            const data = await response.json();
            setItem(data);

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

            const response = await fetch('https://itemstore-03el.onrender.com/api/enquiry', {
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

export default ItemView; */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ImageCarousel from '../components/ImageCarousel';
import '../styles/ItemView.css';

// Mock data for fallback
const mockItems = {
    1: {
        id: 1,
        name: "Sample Electronic Device",
        type: "Electronics",
        description: "This is a comprehensive description of a sample electronic device. It features advanced technology, user-friendly interface, and high-quality materials. Perfect for both professional and personal use. The device comes with multiple connectivity options and a long-lasting battery life.",
        coverImage: "https://via.placeholder.com/600x400?text=Electronic+Device",
        itemImages: [
            "https://via.placeholder.com/600x400?text=Device+Front",
            "https://via.placeholder.com/600x400?text=Device+Back",
            "https://via.placeholder.com/600x400?text=Device+Side"
        ],
        created_at: "2024-01-15T10:30:00Z"
    },
    2: {
        id: 2,
        name: "Premium Clothing Item",
        type: "Clothing",
        description: "A high-quality clothing item made from premium materials. Features modern design and comfortable fit. Available in multiple sizes and perfect for various occasions. The fabric is breathable and durable, ensuring long-lasting wear.",
        coverImage: null,
        itemImages: [],
        created_at: new Date().toISOString()
    },
    3: {
        id: 3,
        name: "Educational Book Collection",
        type: "Books",
        description: "A comprehensive collection of educational books covering various subjects. These books are perfect for students, professionals, and anyone looking to expand their knowledge. Written by experts in their respective fields with clear explanations and practical examples.",
        coverImage: "https://via.placeholder.com/600x400?text=Book+Collection",
        itemImages: [
            "https://via.placeholder.com/600x400?text=Book+1",
            "https://via.placeholder.com/600x400?text=Book+2",
            "https://via.placeholder.com/600x400?text=Book+3",
            "https://via.placeholder.com/600x400?text=Book+4"
        ],
        created_at: "2024-02-20T14:45:00Z"
    },
    4: {
        id: 4,
        name: "Garden Tool Set",
        type: "Home & Garden",
        description: "Professional-grade garden tool set perfect for maintaining your garden. Includes all essential tools made from durable materials. Ergonomic design ensures comfortable use for extended periods.",
        coverImage: "https://via.placeholder.com/600x400?text=Garden+Tools",
        itemImages: [
            "https://via.placeholder.com/600x400?text=Tool+Set"
        ],
        created_at: "2024-01-10T09:15:00Z"
    }
};

const ItemView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [usingMockData, setUsingMockData] = useState(false);
    const [allImages, setAllImages] = useState([]);

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
            setError(null);
            setUsingMockData(false);

            const response = await fetch(`https://itemstore-03el.onrender.com/api/items/${id}`);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Item not found');
                }
                throw new Error('Failed to fetch item');
            }
            const data = await response.json();
            setItem(data);
            setupImages(data);
        } catch (err) {
            console.error('API fetch failed, loading mock data:', err);
            setError(err.message);

            // Try to load mock data
            const mockItem = mockItems[id];
            if (mockItem) {
                setItem(mockItem);
                setupImages(mockItem);
                setUsingMockData(true);
            } else {
                // If no mock data available for this ID, create a generic one
                const genericMockItem = {
                    id: parseInt(id),
                    name: `Sample Item ${id}`,
                    type: "General",
                    description: "This is a sample item displayed because the API is currently unavailable. This demonstrates how the application continues to work even when the backend service is down.",
                    coverImage: `https://via.placeholder.com/600x400?text=Sample+Item+${id}`,
                    itemImages: [
                        `https://via.placeholder.com/600x400?text=Sample+Image+1`,
                        `https://via.placeholder.com/600x400?text=Sample+Image+2`
                    ],
                    created_at: "2024-01-15T10:30:00Z"
                };
                setItem(genericMockItem);
                setupImages(genericMockItem);
                setUsingMockData(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const setupImages = (itemData) => {
        const images = [];
        if (itemData.coverImage) {
            images.push({
                url: itemData.coverImage,
                alt: `${itemData.name} - Cover Image`,
                isCover: true
            });
        }
        if (itemData.itemImages && itemData.itemImages.length > 0) {
            itemData.itemImages.forEach((img, index) => {
                images.push({
                    url: img,
                    alt: `${itemData.name} - Image ${index + 1}`,
                    isCover: false
                });
            });
        }
        setAllImages(images);
    };

    const handleEnquirySubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setEnquiryError('Email is required');
            return;
        }

        // If using mock data, simulate the enquiry process
        if (usingMockData) {
            setEnquiryLoading(true);
            setEnquiryError('');

            // Simulate API delay
            setTimeout(() => {
                setEnquirySuccess(true);
                setEnquiryLoading(false);
                setTimeout(() => {
                    setShowEnquiryModal(false);
                    setEnquirySuccess(false);
                    setEmail('');
                    setMessage('');
                }, 2000);
            }, 1000);
            return;
        }

        try {
            setEnquiryLoading(true);
            setEnquiryError('');

            const response = await fetch('https://itemstore-03el.onrender.com/api/enquiry', {
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

    if (error && !usingMockData && !item) {
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

            {usingMockData && (
                <div className="mock-data-notice" style={{
                    backgroundColor: '#fff3cd',
                    color: '#856404',
                    padding: '12px 16px',
                    borderRadius: '4px',
                    margin: '10px 0',
                    border: '1px solid #ffeaa7',
                    textAlign: 'center'
                }}>
                    ⚠️ Showing sample data - API unavailable
                    <button
                        onClick={fetchItem}
                        className="retry-btn"
                        style={{ marginLeft: '10px', fontSize: '12px' }}
                    >
                        Retry API
                    </button>
                </div>
            )}

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
                            {usingMockData ? 'Enquire (Demo)' : 'Enquire'}
                        </button>
                    </div>
                </div>
            </div>

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

                        {usingMockData && (
                            <div className="demo-notice" style={{
                                backgroundColor: '#e7f3ff',
                                color: '#0066cc',
                                padding: '8px 12px',
                                borderRadius: '4px',
                                marginBottom: '15px',
                                fontSize: '14px'
                            }}>
                                💡 Demo mode - enquiry will be simulated
                            </div>
                        )}

                        {enquirySuccess ? (
                            <div className="success-message">
                                <p>✓ Enquiry sent successfully!</p>
                                <p>{usingMockData ? 'This was a demo submission.' : "We'll get back to you soon."}</p>
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
                                        {enquiryLoading ? 'Sending...' : (usingMockData ? 'Send Demo Enquiry' : 'Send Enquiry')}
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