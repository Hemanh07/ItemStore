/* import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ItemList.css';

const ItemList = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://itemstore-03el.onrender.com/api/items');
            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }
            const data = await response.json();
            setItems(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleItemClick = (itemId) => {
        navigate(`/item/${itemId}`);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading items...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>Error: {error}</p>
                <button onClick={fetchItems} className="retry-btn">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="item-list-container">
            <div className="header">
                <h1>All Items</h1>
                <p>{items.length} items found</p>
            </div>

            {items.length === 0 ? (
                <div className="empty-state">
                    <p>No items found. Add some items to get started!</p>
                </div>
            ) : (
                <div className="items-grid">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="item-card"
                            onClick={() => handleItemClick(item.id)}
                        >
                            <div className="item-image-container">
                                {item.coverImage ? (
                                    <img
                                        src={item.coverImage}
                                        alt={item.name}
                                        className="item-image"
                                        onError={(e) => {
                                            e.target.src = '/placeholder-image.jpg';
                                        }}
                                    />
                                ) : (
                                    <div className="no-image-placeholder">
                                        <span>No Image</span>
                                    </div>
                                )}
                                {item.itemImages && item.itemImages.length > 0 && (
                                    <div className="image-count-badge">
                                        +{item.itemImages.length}
                                    </div>
                                )}
                            </div>

                            <div className="item-details">
                                <h3 className="item-name">{item.name}</h3>
                                <span className="item-type">{item.type}</span>
                                <p className="item-description">
                                    {item.description.length > 100
                                        ? `${item.description.substring(0, 100)}...`
                                        : item.description
                                    }
                                </p>
                                <div className="item-meta" style={
                                    {
                                        backgroundColor: Date(item.created_at) == Date() ? "#007bff" : "",
                                        color: Date(item.created_at) == Date() ? "white" : "",
                                    }
                                }>
                                    <span className="creation-date">
                                        Added on {formatDate(item.created_at)}  <br />{Date(item.created_at) == Date() ? "New Stock" : ""}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ItemList; */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ItemList.css';

// Mock data for fallback
const mockItems = [
    {
        id: 1,
        name: "Sample Item 1",
        type: "Electronics",
        description: "This is a sample electronic item with various features and specifications that demonstrate the layout.",
        coverImage: "https://via.placeholder.com/300x200?text=Sample+Item+1",
        itemImages: ["image1.jpg", "image2.jpg"],
        created_at: "2024-01-15T10:30:00Z"
    },
    {
        id: 2,
        name: "Sample Item 2",
        type: "Clothing",
        description: "A sample clothing item that showcases how the item list displays different product categories.",
        coverImage: null,
        itemImages: [],
        created_at: new Date().toISOString() // Today's date for "New Stock" demo
    },
    {
        id: 3,
        name: "Sample Item 3",
        type: "Books",
        description: "This is a longer description that will be truncated to show how the component handles lengthy descriptions. It contains more than 100 characters to demonstrate the substring functionality.",
        coverImage: "https://via.placeholder.com/300x200?text=Sample+Item+3",
        itemImages: ["image1.jpg", "image2.jpg", "image3.jpg", "image4.jpg"],
        created_at: "2024-02-20T14:45:00Z"
    },
    {
        id: 4,
        name: "Sample Item 4",
        type: "Home & Garden",
        description: "A sample home and garden item for demonstration purposes.",
        coverImage: "https://via.placeholder.com/300x200?text=Sample+Item+4",
        itemImages: ["image1.jpg"],
        created_at: "2024-01-10T09:15:00Z"
    }
];

const ItemList = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [usingMockData, setUsingMockData] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            setLoading(true);
            setError(null);
            setUsingMockData(false);

            const response = await fetch('https://itemstore-03el.onrender.com/api/items');
            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }
            const data = await response.json();
            setItems(data);
        } catch (err) {
            console.error('API fetch failed, loading mock data:', err);
            setError(err.message);
            setItems(mockItems);
            setUsingMockData(true);
        } finally {
            setLoading(false);
        }
    };

    const handleItemClick = (itemId) => {
        navigate(`/item/${itemId}`);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading items...</p>
            </div>
        );
    }

    return (
        <div className="item-list-container">
            <div className="header">
                <h1>All Items</h1>
                <p>{items.length} items found</p>
                {usingMockData && (
                    <div className="mock-data-notice" style={{
                        backgroundColor: '#fff3cd',
                        color: '#856404',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        margin: '10px 0',
                        border: '1px solid #ffeaa7'
                    }}>
                        ⚠️ Using sample data - API unavailable
                        <button
                            onClick={fetchItems}
                            className="retry-btn"
                            style={{ marginLeft: '10px', fontSize: '12px' }}
                        >
                            Retry API
                        </button>
                    </div>
                )}
                {error && !usingMockData && (
                    <div className="error-container">
                        <p>Error: {error}</p>
                        <button onClick={fetchItems} className="retry-btn">
                            Try Again
                        </button>
                    </div>
                )}
            </div>

            {items.length === 0 ? (
                <div className="empty-state">
                    <p>No items found. Add some items to get started!</p>
                </div>
            ) : (
                <div className="items-grid">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="item-card"
                            onClick={() => handleItemClick(item.id)}
                        >
                            <div className="item-image-container">
                                {item.coverImage ? (
                                    <img
                                        src={item.coverImage}
                                        alt={item.name}
                                        className="item-image"
                                        onError={(e) => {
                                            e.target.src = '/placeholder-image.jpg';
                                        }}
                                    />
                                ) : (
                                    <div className="no-image-placeholder">
                                        <span>No Image</span>
                                    </div>
                                )}
                                {item.itemImages && item.itemImages.length > 0 && (
                                    <div className="image-count-badge">
                                        +{item.itemImages.length}
                                    </div>
                                )}
                            </div>

                            <div className="item-details">
                                <h3 className="item-name">{item.name}</h3>
                                <span className="item-type">{item.type}</span>
                                <p className="item-description">
                                    {item.description.length > 100
                                        ? `${item.description.substring(0, 100)}...`
                                        : item.description
                                    }
                                </p>
                                <div className="item-meta" style={
                                    {
                                        backgroundColor: Date(item.created_at) == Date() ? "#007bff" : "",
                                        color: Date(item.created_at) == Date() ? "white" : "",
                                    }
                                }>
                                    <span className="creation-date">
                                        Added on {formatDate(item.created_at)}  <br />{Date(item.created_at) == Date() ? "New Stock" : ""}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ItemList;