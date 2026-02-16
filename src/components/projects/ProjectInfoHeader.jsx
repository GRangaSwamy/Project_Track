import React, { useState, useEffect } from 'react';
import { updateProject } from '../../services/projectService';
import { subscribeMaterialLogs, calculateMaterialTotals } from '../../services/materialService';
import { uploadImageToCloudinary, compressImage, getOptimizedImageUrl } from '../../services/imageUploadService';

/**
 * ProjectInfoHeader Component
 * Hero-style header with background image support
 * Displays project information with dark overlay for readability
 * Includes status toggle, editable estimated cost, and real-time budget tracking
 */
const ProjectInfoHeader = ({ project, onUpdate }) => {
    const [updating, setUpdating] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [editingCost, setEditingCost] = useState(false);
    const [editedCost, setEditedCost] = useState('');
    const [totalSpent, setTotalSpent] = useState(0);
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [completionDate, setCompletionDate] = useState('');

    // Real-time subscription to material logs for total spent calculation
    useEffect(() => {
        if (!project?.id) return;

        const unsubscribe = subscribeMaterialLogs(project.id, (result) => {
            if (result.success) {
                const totals = calculateMaterialTotals(result.data);
                // Sum all material costs
                const total = Object.values(totals).reduce((sum, amount) => sum + amount, 0);
                setTotalSpent(total);
            }
        });

        return () => unsubscribe();
    }, [project?.id]);

    const handleStatusToggle = async (newStatus) => {
        if (updating || !project) return;

        setUpdating(true);
        const result = await updateProject(project.id, { status: newStatus });

        if (result.success) {
            console.log('✅ Project status updated');
            if (onUpdate) onUpdate();
        } else {
            alert(`Error: ${result.error}`);
        }

        setUpdating(false);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !project) return;

        setUploadingImage(true);

        try {
            // Compress image before upload
            const compressedFile = await compressImage(file);

            // Upload to Cloudinary
            const result = await uploadImageToCloudinary(compressedFile);

            if (result.success) {
                // Update project with new image URL
                const updateResult = await updateProject(project.id, {
                    projectImageUrl: result.url
                });

                if (updateResult.success) {
                    console.log('✅ Project image updated');
                    if (onUpdate) onUpdate();
                } else {
                    alert(`Error: ${updateResult.error}`);
                }
            } else {
                alert(`Upload failed: ${result.error}`);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleEditCost = () => {
        setEditingCost(true);
        setEditedCost(project.estimatedCost?.toString() || '0');
    };

    const handleSaveCost = async () => {
        if (!project) return;

        const newCost = parseFloat(editedCost);
        if (isNaN(newCost) || newCost < 0) {
            alert('Please enter a valid cost');
            return;
        }

        setUpdating(true);
        const result = await updateProject(project.id, { estimatedCost: newCost });

        if (result.success) {
            console.log('✅ Estimated cost updated');
            setEditingCost(false);
            if (onUpdate) onUpdate();
        } else {
            alert(`Error: ${result.error}`);
        }

        setUpdating(false);
    };

    const handleCancelCostEdit = () => {
        setEditingCost(false);
        setEditedCost('');
    };

    const handleRemoveBackground = async () => {
        if (!project) return;

        const confirmRemove = window.confirm('Are you sure you want to remove the background image?');
        if (!confirmRemove) return;

        setUpdating(true);
        const result = await updateProject(project.id, { projectImageUrl: '' });

        if (result.success) {
            console.log('✅ Background image removed');
            if (onUpdate) onUpdate();
        } else {
            alert(`Error: ${result.error}`);
        }

        setUpdating(false);
    };

    const handleMarkCompleted = () => {
        // Set default completion date to today
        const today = new Date().toISOString().split('T')[0];
        setCompletionDate(today);
        setShowCompletionModal(true);
    };

    const handleConfirmCompletion = async () => {
        if (!project || !completionDate) return;

        setUpdating(true);
        const result = await updateProject(project.id, {
            status: 'completed',
            completedDate: completionDate,
        });

        if (result.success) {
            console.log('✅ Project marked as completed');
            setShowCompletionModal(false);
            alert('Project marked as completed successfully! ✓');
            if (onUpdate) onUpdate();
        } else {
            alert(`Error: ${result.error}`);
        }

        setUpdating(false);
    };

    const handleCancelCompletion = () => {
        setShowCompletionModal(false);
        setCompletionDate('');
    };

    const handleMarkIncomplete = async () => {
        if (!project) return;

        const confirmReset = window.confirm('Are you sure you want to mark this project as In Progress? This will remove the completion date.');
        if (!confirmReset) return;

        setUpdating(true);
        const result = await updateProject(project.id, {
            status: 'ongoing',
            completedDate: null,
        });

        if (result.success) {
            console.log('✅ Project marked as in progress');
            alert('Project marked as in progress! 🔄');
            if (onUpdate) onUpdate();
        } else {
            alert(`Error: ${result.error}`);
        }

        setUpdating(false);
    };

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (!project) return null;

    // Calculate values
    const estimatedCost = project.estimatedCost || 0;

    const backgroundStyle = project.projectImageUrl ? {
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.9)), url(${project.projectImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: 'none',
    } : {
        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
        border: '1px solid var(--color-border)',
    };

    return (
        <div style={{
            marginBottom: 'var(--spacing-2xl)',
            padding: isMobile ? 'var(--spacing-lg)' : 'var(--spacing-2xl)',
            borderRadius: 'var(--radius-lg)',
            position: 'relative',
            minHeight: isMobile ? 'auto' : '320px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 'var(--spacing-xl)',
            ...backgroundStyle,
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
            {/* Circular Floating Background Controls */}
            <div style={{
                position: 'absolute',
                right: 'var(--spacing-md)',
                display: 'flex',
                gap: '10px',
                zIndex: 10,
            }}>
                {/* Logic: If image exists, show ONLY Remove icon. Else show ONLY Add icon. */}
                {!project.projectImageUrl ? (
                    <>
                        <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                            style={{ display: 'none' }}
                            id="header-image-upload"
                        />
                        <label
                            htmlFor="header-image-upload"
                            title="Add Background Image"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '42px',
                                height: '42px',
                                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                                backdropFilter: 'blur(8px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '50%',
                                cursor: uploadingImage ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                fontSize: '1.25rem',
                                color: 'white',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                            }}
                            onMouseEnter={(e) => {
                                if (!uploadingImage) {
                                    e.currentTarget.style.transform = 'scale(1.1)';
                                    e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.8)';
                                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.6)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                            }}
                        >
                            {uploadingImage ? '⏳' : '📷'}
                        </label>
                    </>
                ) : (
                    <button
                        onClick={handleRemoveBackground}
                        disabled={updating}
                        title="Remove Background Image"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '42px',
                            height: '42px',
                            backgroundColor: 'rgba(239, 68, 68, 0.25)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(239, 68, 68, 0.4)',
                            borderRadius: '50%',
                            cursor: updating ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            fontSize: '1.1rem',
                            color: 'white',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                        }}
                        onMouseEnter={(e) => {
                            if (!updating) {
                                e.currentTarget.style.transform = 'scale(1.1)';
                                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.45)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.25)';
                        }}
                    >
                        {updating ? '⏳' : '❌'}
                    </button>
                )}
            </div>

            {/* Project Name and Badge */}
            <div style={{ maxWidth: '85%' }}>
                <h1 style={{
                    fontSize: 'clamp(1.5rem, 5vw, 2.75rem)',
                    fontWeight: '800',
                    color: 'white',
                    marginBottom: 'var(--spacing-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    flexWrap: 'wrap',
                    textShadow: '0 4px 12px rgba(0,0,0,0.5)',
                    lineHeight: '1.1',
                }}>
                    {project.name}
                </h1>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                    {project.status === 'completed' ? (
                        <span style={{
                            fontSize: '0.75rem',
                            padding: '4px 12px',
                            backgroundColor: 'rgba(34, 197, 94, 0.2)',
                            color: '#4ade80',
                            borderRadius: '999px',
                            fontWeight: '700',
                            border: '1px solid rgba(34, 197, 94, 0.4)',
                            backdropFilter: 'blur(4px)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                        }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ade80', boxShadow: '0 0 8px #4ade80' }}></span>
                            Completed
                        </span>
                    ) : (
                        <span style={{
                            fontSize: '0.75rem',
                            padding: '4px 12px',
                            backgroundColor: 'rgba(59, 130, 246, 0.2)',
                            color: '#60a5fa',
                            borderRadius: '999px',
                            fontWeight: '700',
                            border: '1px solid rgba(59, 130, 246, 0.4)',
                            backdropFilter: 'blur(4px)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                        }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#60a5fa', boxShadow: '0 0 8px #60a5fa' }}></span>
                            In Progress
                        </span>
                    )}
                </div>
            </div>

            {/* Financial Information Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: isMobile ? 'var(--spacing-md)' : 'var(--spacing-lg)',
                marginBottom: 'var(--spacing-md)',
            }}>
                {/* Estimated Cost - Editable */}
                <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                    <div style={{
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        color: 'rgba(255,255,255,0.5)',
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                    }}>
                        Estimated Cost
                    </div>
                    {editingCost ? (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <input
                                type="number"
                                value={editedCost}
                                onChange={(e) => setEditedCost(e.target.value)}
                                disabled={updating}
                                style={{
                                    padding: '6px 10px',
                                    borderRadius: '6px',
                                    border: '1px solid var(--color-primary)',
                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                    color: '#0f172a',
                                    fontSize: '0.9rem',
                                    fontWeight: '700',
                                    width: '100px',
                                    outline: 'none',
                                }}
                                autoFocus
                            />
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <button onClick={handleSaveCost} disabled={updating} style={{ padding: '6px 8px', background: 'var(--color-success)', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.65rem', fontWeight: '800', cursor: 'pointer' }}>SAVE</button>
                                <button onClick={handleCancelCostEdit} disabled={updating} style={{ padding: '6px 8px', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.65rem', fontWeight: '800', cursor: 'pointer' }}>ESC</button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div style={{
                                fontSize: 'clamp(1rem, 3vw, 1.25rem)',
                                fontWeight: '800',
                                color: 'white',
                            }}>
                                {formatCurrency(estimatedCost)}
                            </div>
                            <button
                                onClick={handleEditCost}
                                style={{
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    color: 'var(--color-primary)',
                                    fontSize: '0.7rem',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    padding: 0,
                                    textAlign: 'left',
                                    textTransform: 'uppercase'
                                }}
                            >
                                ✏️ Edit
                            </button>
                        </div>
                    )}
                </div>

                {/* Total Amount Spent - Running Total */}
                <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                    <div style={{
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        color: 'rgba(255,255,255,0.5)',
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                    }}>
                        Total Spent
                    </div>
                    <div style={{
                        fontSize: 'clamp(1rem, 3vw, 1.25rem)',
                        fontWeight: '800',
                        color: '#fbbf24',
                    }}>
                        {formatCurrency(totalSpent)}
                    </div>
                </div>

                {/* Start Date */}
                <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                    <div style={{
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        color: 'rgba(255,255,255,0.5)',
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                    }}>
                        Start Date
                    </div>
                    <div style={{
                        fontSize: 'clamp(1rem, 3vw, 1.25rem)',
                        fontWeight: '800',
                        color: 'white',
                    }}>
                        {formatDate(project.startDate)}
                    </div>
                </div>

                {/* Completed Date or Mark Completed Button */}
                <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        color: 'rgba(255,255,255,0.5)',
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                    }}>
                        {project.status === 'completed' ? 'Completion' : 'Status'}
                    </div>
                    {project.status === 'completed' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div style={{
                                fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                                fontWeight: '800',
                                color: '#4ade80',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                {formatDate(project.completedDate)}
                                <span>✓</span>
                            </div>
                            <button
                                onClick={handleMarkIncomplete}
                                disabled={updating}
                                style={{
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    color: 'var(--color-text-tertiary)',
                                    fontSize: '0.65rem',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    padding: 0,
                                    textAlign: 'left',
                                    textTransform: 'uppercase'
                                }}
                            >
                                Reset 🔄
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleMarkCompleted}
                            disabled={updating}
                            style={{
                                padding: '8px 12px',
                                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '0.75rem',
                                fontWeight: '800',
                                cursor: updating ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                                width: 'fit-content'
                            }}
                            onMouseEnter={(e) => {
                                if (!updating) e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            Done ✓
                        </button>
                    )}
                </div>
            </div>

            {/* Completion Date Modal */}
            {showCompletionModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: 'var(--spacing-md)',
                }}>
                    <div style={{
                        backgroundColor: '#0f172a',
                        borderRadius: '16px',
                        padding: 'var(--spacing-2xl)',
                        maxWidth: '400px',
                        width: '100%',
                        border: '1px solid #334155',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                    }}>
                        <h3 style={{
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            color: 'white',
                            marginBottom: 'var(--spacing-md)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}>
                            <span>✓</span>
                            Mark Project as Completed
                        </h3>

                        <p style={{
                            fontSize: '0.875rem',
                            color: 'rgba(255,255,255,0.7)',
                            marginBottom: 'var(--spacing-lg)',
                        }}>
                            Select the completion date for this project:
                        </p>

                        <div style={{
                            marginBottom: 'var(--spacing-xl)',
                        }}>
                            <label style={{
                                display: 'block',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                color: 'rgba(255,255,255,0.7)',
                                marginBottom: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                            }}>
                                Completion Date
                            </label>
                            <input
                                type="date"
                                value={completionDate}
                                onChange={(e) => setCompletionDate(e.target.value)}
                                disabled={updating}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '2px solid #334155',
                                    backgroundColor: '#020617',
                                    color: 'white',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    outline: 'none',
                                    colorScheme: 'dark',
                                }}
                            />
                        </div>

                        <div style={{
                            display: 'flex',
                            gap: '12px',
                            justifyContent: 'flex-end',
                        }}>
                            <button
                                onClick={handleCancelCompletion}
                                disabled={updating}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: 'transparent',
                                    color: '#94a3b8',
                                    border: '2px solid #334155',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    fontWeight: '700',
                                    cursor: updating ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                    if (!updating) {
                                        e.currentTarget.style.borderColor = '#475569';
                                        e.currentTarget.style.color = 'white';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#334155';
                                    e.currentTarget.style.color = '#94a3b8';
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmCompletion}
                                disabled={updating || !completionDate}
                                style={{
                                    padding: '10px 20px',
                                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    fontWeight: '700',
                                    cursor: (updating || !completionDate) ? 'not-allowed' : 'pointer',
                                    opacity: (updating || !completionDate) ? 0.6 : 1,
                                    transition: 'all 0.2s',
                                    boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)',
                                }}
                                onMouseEnter={(e) => {
                                    if (!updating && completionDate) {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.4)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(34, 197, 94, 0.3)';
                                }}
                            >
                                {updating ? 'Saving...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    );
};

export default ProjectInfoHeader;
