import React, { useState, useEffect } from 'react';
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
            const response = await fetch('http://localhost:5000/api/items');
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

export default ItemList;