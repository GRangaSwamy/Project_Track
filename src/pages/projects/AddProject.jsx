import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { createProject } from '../../services/projectService';
import { uploadImageToCloudinary, compressImage } from '../../services/imageUploadService';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

/**
 * Add Project Page
 * Form to create a new construction project
 * 
 * Fields: name, startDate, estimatedCost, status, projectImageUrl
 */
const AddProject = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        startDate: '',
        estimatedCost: '',
        status: 'ongoing',
        projectImageUrl: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        setError(''); // Clear error on input change
    };

    const handleStatusChange = (status) => {
        setFormData(prev => ({
            ...prev,
            status,
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingImage(true);
        setError('');

        try {
            // Compress image before upload
            const compressedFile = await compressImage(file);

            // Upload to Cloudinary
            const result = await uploadImageToCloudinary(compressedFile);

            if (result.success) {
                setFormData(prev => ({
                    ...prev,
                    projectImageUrl: result.url,
                }));
                setImagePreview(result.url);
                console.log('✅ Image uploaded successfully');
            } else {
                setError(result.error || 'Failed to upload image');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            setError('Failed to upload image. Please try again.');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleRemoveImage = () => {
        setFormData(prev => ({
            ...prev,
            projectImageUrl: '',
        }));
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Validate data
            if (!formData.name || !formData.startDate) {
                setError('Please fill in all required fields');
                setLoading(false);
                return;
            }

            // Create project in Firestore
            const result = await createProject({
                name: formData.name,
                startDate: formData.startDate,
                estimatedCost: formData.estimatedCost || 0,
                status: formData.status,
                projectImageUrl: formData.projectImageUrl,
                userId: currentUser.uid,
            });

            if (result.success) {
                console.log('✅ Project created successfully');
                // Navigate to dashboard
                navigate('/');
            } else {
                setError(result.error || 'Failed to create project');
            }
        } catch (error) {
            console.error('Error creating project:', error);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Add New Project</h1>

            <Card>
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div style={{
                            padding: 'var(--spacing-md)',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid var(--color-danger)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--color-danger)',
                            marginBottom: 'var(--spacing-lg)',
                        }}>
                            {error}
                        </div>
                    )}

                    <Input
                        label="Project Name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter project name"
                        required
                    />

                    <Input
                        label="Start Date"
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        label="Estimated Cost (₹)"
                        type="number"
                        name="estimatedCost"
                        value={formData.estimatedCost}
                        onChange={handleChange}
                        placeholder="Enter estimated cost"
                        min="0"
                        step="1"
                    />

                    {/* Status Toggle */}
                    {/* Project Image Upload */}
                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: 'var(--spacing-sm)',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: 'var(--color-text-primary)',
                        }}>
                            Project Image (Optional)
                        </label>
                        <p style={{
                            fontSize: '0.75rem',
                            color: 'var(--color-text-tertiary)',
                            marginBottom: 'var(--spacing-sm)',
                        }}>
                            This image will be used as the project header background
                        </p>

                        {imagePreview ? (
                            <div style={{
                                position: 'relative',
                                width: '100%',
                                maxWidth: '400px',
                                borderRadius: 'var(--radius-md)',
                                overflow: 'hidden',
                                marginBottom: 'var(--spacing-sm)',
                            }}>
                                <img
                                    src={imagePreview}
                                    alt="Project preview"
                                    style={{
                                        width: '100%',
                                        height: '200px',
                                        objectFit: 'cover',
                                        display: 'block',
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    style={{
                                        position: 'absolute',
                                        top: '8px',
                                        right: '8px',
                                        padding: '8px 12px',
                                        backgroundColor: 'rgba(0,0,0,0.7)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                    }}
                                >
                                    ✕ Remove
                                </button>
                            </div>
                        ) : (
                            <div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={handleImageUpload}
                                    disabled={uploadingImage}
                                    style={{ display: 'none' }}
                                    id="project-image-upload"
                                />
                                <label
                                    htmlFor="project-image-upload"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 'var(--spacing-sm)',
                                        padding: '12px 24px',
                                        backgroundColor: uploadingImage ? '#f5f5f5' : 'var(--color-bg-secondary)',
                                        border: '2px dashed var(--color-border)',
                                        borderRadius: 'var(--radius-md)',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        color: 'var(--color-text-secondary)',
                                        cursor: uploadingImage ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!uploadingImage) {
                                            e.currentTarget.style.borderColor = 'var(--color-primary)';
                                            e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--color-border)';
                                        e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
                                    }}
                                >
                                    {uploadingImage ? (
                                        <>
                                            <span>⏳</span>
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <span>📷</span>
                                            Upload Project Image
                                        </>
                                    )}
                                </label>
                            </div>
                        )}
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: 'var(--spacing-md)',
                        marginTop: 'var(--spacing-xl)'
                    }}>
                        <Button
                            type="submit"
                            variant="primary"
                            size="large"
                            loading={loading}
                            disabled={uploadingImage}
                        >
                            {loading ? 'Creating...' : 'Create Project'}
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            size="large"
                            onClick={() => navigate('/')}
                            disabled={loading || uploadingImage}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default AddProject;
