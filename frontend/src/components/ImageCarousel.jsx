import React, { useState, useEffect } from 'react';
import '../styles/ImageCarousel.css';

const ImageCarousel = ({ images = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'ArrowLeft') {
                goToPrevious();
            } else if (e.key === 'ArrowRight') {
                goToNext();
            } else if (e.key === 'Escape') {
                setIsZoomed(false);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentIndex]);

    const goToNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    const handleImageClick = () => {
        setIsZoomed(!isZoomed);
    };

    if (!images || images.length === 0) {
        return (
            <div className="carousel-container">
                <div className="no-images">
                    <p>No images available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="carousel-container">
            <div className="main-image-container">
                <img
                    src={images[currentIndex]?.url}
                    alt={images[currentIndex]?.alt}
                    className={`main-image ${isZoomed ? 'zoomed' : ''}`}
                    onClick={handleImageClick}
                    onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                    }}
                />

                {images[currentIndex]?.isCover && (
                    <div className="cover-badge">
                        Cover Image
                    </div>
                )}

                {images.length > 1 && (
                    <>
                        <button
                            className="nav-arrow nav-arrow-left"
                            onClick={goToPrevious}
                            aria-label="Previous image"
                        >
                            &#8249;
                        </button>
                        <button
                            className="nav-arrow nav-arrow-right"
                            onClick={goToNext}
                            aria-label="Next image"
                        >
                            &#8250;
                        </button>
                    </>
                )}

                {images.length > 1 && (
                    <div className="image-counter">
                        {currentIndex + 1} / {images.length}
                    </div>
                )}

                <div className="zoom-hint">
                    Click to {isZoomed ? 'zoom out' : 'zoom in'}
                </div>
            </div>

            {images.length > 1 && (
                <div className="thumbnail-container">
                    <div className="thumbnails">
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
                                onClick={() => goToSlide(index)}
                            >
                                <img
                                    src={image.url}
                                    alt={image.alt}
                                    onError={(e) => {
                                        e.target.src = '/placeholder-image.jpg';
                                    }}
                                />
                                {image.isCover && (
                                    <div className="thumbnail-cover-badge">
                                        Cover
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {images.length > 1 && images.length <= 5 && (
                <div className="dots-container">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            className={`dot ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                            aria-label={`Go to image ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {isZoomed && (
                <div className="zoom-modal" onClick={() => setIsZoomed(false)}>
                    <div className="zoom-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="zoom-close-btn"
                            onClick={() => setIsZoomed(false)}
                        >
                            ×
                        </button>
                        <img
                            src={images[currentIndex]?.url}
                            alt={images[currentIndex]?.alt}
                            className="zoom-modal-image"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageCarousel;