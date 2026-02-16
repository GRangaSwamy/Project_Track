import React, { useState, useRef } from 'react';
import { uploadMultipleImages } from '../../services/cloudinaryService';
import Button from '../common/Button';

/**
 * ImageUpload Component
 * Handles image upload to Cloudinary
 * Supports multiple images, camera capture, and file upload
 * 
 * @param {function} onUploadComplete - Callback with uploaded image URLs
 * @param {boolean} multiple - Allow multiple image selection
 * @param {string} buttonText - Custom button text
 */
const ImageUpload = ({
    onUploadComplete,
    multiple = true,
    buttonText = '📷 Upload Images'
}) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);

        if (files.length === 0) return;

        setError('');
        setSelectedFiles(files);

        // Create preview URLs
        const previews = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(previews);
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            setError('Please select images first');
            return;
        }

        setUploading(true);
        setError('');

        try {
            console.log(`Uploading ${selectedFiles.length} image(s)...`);

            const result = await uploadMultipleImages(selectedFiles);

            if (result.success) {
                console.log('✅ Upload complete:', result.urls);

                // Clean up preview URLs
                previewUrls.forEach(url => URL.revokeObjectURL(url));

                // Reset state
                setSelectedFiles([]);
                setPreviewUrls([]);

                // Reset file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }

                // Call callback with URLs
                if (onUploadComplete) {
                    onUploadComplete(result.urls);
                }
            } else {
                setError(result.error || 'Upload failed');
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError('An unexpected error occurred');
        } finally {
            setUploading(false);
        }
    };

    const handleCancel = () => {
        // Clean up preview URLs
        previewUrls.forEach(url => URL.revokeObjectURL(url));

        setSelectedFiles([]);
        setPreviewUrls([]);
        setError('');

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div style={{ marginTop: 'var(--spacing-md)' }}>
            {/* File Input (Hidden) */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple={multiple}
                capture="environment" // Enable camera on mobile
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />

            {/* Upload Button */}
            {selectedFiles.length === 0 && (
                <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                >
                    {buttonText}
                </Button>
            )}

            {/* Preview and Upload */}
            {selectedFiles.length > 0 && (
                <div style={{
                    padding: 'var(--spacing-md)',
                    backgroundColor: 'var(--color-bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                }}>
                    {/* Preview Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                        gap: 'var(--spacing-sm)',
                        marginBottom: 'var(--spacing-md)',
                    }}>
                        {previewUrls.map((url, index) => (
                            <div
                                key={index}
                                style={{
                                    position: 'relative',
                                    paddingBottom: '100%',
                                    backgroundColor: 'var(--color-bg-secondary)',
                                    borderRadius: 'var(--radius-sm)',
                                    overflow: 'hidden',
                                }}
                            >
                                <img
                                    src={url}
                                    alt={`Preview ${index + 1}`}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Info */}
                    <div style={{
                        fontSize: '0.875rem',
                        color: 'var(--color-text-secondary)',
                        marginBottom: 'var(--spacing-md)',
                    }}>
                        {selectedFiles.length} image{selectedFiles.length > 1 ? 's' : ''} selected
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div style={{
                            padding: 'var(--spacing-sm)',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid var(--color-danger)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--color-danger)',
                            fontSize: '0.875rem',
                            marginBottom: 'var(--spacing-md)',
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{
                        display: 'flex',
                        gap: 'var(--spacing-sm)',
                    }}>
                        <Button
                            variant="primary"
                            onClick={handleUpload}
                            loading={uploading}
                            disabled={uploading}
                        >
                            {uploading ? 'Uploading...' : 'Upload'}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            disabled={uploading}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
