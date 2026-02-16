import React, { useState } from 'react';
import ImageCarousel from './ImageCarousel';
import Button from './Button';

/**
 * ImageGallery Component
 * Displays images in a grid with delete functionality and carousel viewer
 * 
 * @param {Array} images - Array of image URLs
 * @param {string} emptyMessage - Message when no images
 * @param {function} onDeleteImage - Callback when image is deleted (receives image URL and index)
 * @param {boolean} showDelete - Show delete buttons
 * @param {number} maxThumbnails - Maximum thumbnails to show (default: 3)
 */
const ImageGallery = ({
    images = [],
    emptyMessage = 'No images yet',
    onDeleteImage,
    showDelete = true,
    maxThumbnails = 3
}) => {
    const [carouselOpen, setCarouselOpen] = useState(false);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [deletingIndex, setDeletingIndex] = useState(null);

    if (!images || images.length === 0) {
        return (
            <div style={{
                padding: 'var(--spacing-lg)',
                textAlign: 'center',
                color: 'var(--color-text-tertiary)',
                fontSize: '0.875rem',
            }}>
                {emptyMessage}
            </div>
        );
    }

    const handleImageClick = (index) => {
        setCarouselIndex(index);
        setCarouselOpen(true);
    };

    const handleDeleteClick = async (imageUrl, index, e) => {
        e.stopPropagation();

        const confirmed = window.confirm(
            'Are you sure you want to delete this image?\n\nThis action cannot be undone.'
        );

        if (!confirmed) return;

        setDeletingIndex(index);

        try {
            if (onDeleteImage) {
                await onDeleteImage(imageUrl, index);
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            alert('Failed to delete image. Please try again.');
        } finally {
            setDeletingIndex(null);
        }
    };

    const openGallery = () => {
        setCarouselIndex(0);
        setCarouselOpen(true);
    };

    // Show limited thumbnails
    const thumbnails = images.slice(0, maxThumbnails);
    const hasMore = images.length > maxThumbnails;

    return (
        <>
            {/* Action Buttons */}
            {images.length > 0 && (
                <div style={{
                    display: 'flex',
                    gap: 'var(--spacing-sm)',
                    marginTop: 'var(--spacing-md)',
                    marginBottom: 'var(--spacing-md)',
                }}>
                    <Button
                        variant="outline"
                        size="small"
                        onClick={openGallery}
                    >
                        🖼️ View Gallery ({images.length})
                    </Button>
                </div>
            )}

            {/* Thumbnail Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: 'var(--spacing-sm)',
            }}>
                {thumbnails.map((imageUrl, index) => (
                    <div
                        key={index}
                        style={{
                            position: 'relative',
                            paddingBottom: '100%',
                            backgroundColor: 'var(--color-bg-secondary)',
                            borderRadius: 'var(--radius-md)',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        {/* Image */}
                        <img
                            src={imageUrl}
                            alt={`Image ${index + 1}`}
                            onClick={() => handleImageClick(index)}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />

                        {/* Delete Button */}
                        {showDelete && onDeleteImage && (
                            <button
                                onClick={(e) => handleDeleteClick(imageUrl, index, e)}
                                disabled={deletingIndex === index}
                                style={{
                                    position: 'absolute',
                                    top: '8px',
                                    right: '8px',
                                    backgroundColor: deletingIndex === index
                                        ? 'rgba(0, 0, 0, 0.5)'
                                        : 'rgba(239, 68, 68, 0.9)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: deletingIndex === index ? 'not-allowed' : 'pointer',
                                    fontSize: '1rem',
                                    color: 'white',
                                    transition: 'background-color 0.2s ease, transform 0.2s ease',
                                    zIndex: 10,
                                }}
                                onMouseEnter={(e) => {
                                    if (deletingIndex !== index) {
                                        e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 1)';
                                        e.currentTarget.style.transform = 'scale(1.1)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (deletingIndex !== index) {
                                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.9)';
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }
                                }}
                            >
                                {deletingIndex === index ? '⏳' : '🗑️'}
                            </button>
                        )}

                        {/* Deleting Overlay */}
                        {deletingIndex === index && (
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '0.75rem',
                                zIndex: 9,
                            }}>
                                Deleting...
                            </div>
                        )}
                    </div>
                ))}

                {/* "More Images" Indicator */}
                {hasMore && (
                    <div
                        onClick={openGallery}
                        style={{
                            position: 'relative',
                            paddingBottom: '100%',
                            backgroundColor: 'var(--color-bg-secondary)',
                            borderRadius: 'var(--radius-md)',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            border: '2px dashed var(--color-border)',
                            transition: 'transform 0.2s ease, border-color 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.borderColor = 'var(--color-primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.borderColor = 'var(--color-border)';
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-text-secondary)',
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>+{images.length - maxThumbnails}</div>
                            <div style={{ fontSize: '0.75rem' }}>more</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Carousel Modal */}
            {carouselOpen && (
                <ImageCarousel
                    images={images}
                    initialIndex={carouselIndex}
                    onClose={() => setCarouselOpen(false)}
                />
            )}
        </>
    );
};

export default ImageGallery;
