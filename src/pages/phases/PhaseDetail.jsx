import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPhaseById, deletePhase, updatePhase } from '../../services/phaseService';
import { getDailyLogs, deleteDailyLog } from '../../services/dailyLogService';
import { addImagesToPhase, addImagesToDailyLog, deleteImageFromPhase, deleteImageFromDailyLog } from '../../services/imageHelper';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import ImageUpload from '../../components/common/ImageUpload';
import ImageGallery from '../../components/common/ImageGallery';
import AddDailyLogModal from '../../components/logs/AddDailyLogModal';

/**
 * Phase Detail Page
 * Shows phase information and daily logs
 * Ultra-simple layout: Today's work | Tomorrow's needs
 */
const PhaseDetail = () => {
    const { projectId, phaseId } = useParams();
    const navigate = useNavigate();

    const [phase, setPhase] = useState(null);
    const [dailyLogs, setDailyLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAddLogModalOpen, setIsAddLogModalOpen] = useState(false);
    const [editingLog, setEditingLog] = useState(null);
    const [statusUpdating, setStatusUpdating] = useState(false);

    // Fetch phase and daily logs on component mount
    useEffect(() => {
        if (projectId && phaseId) {
            fetchPhaseData();
            fetchDailyLogs();
        }
    }, [projectId, phaseId]);

    const fetchPhaseData = async () => {
        try {
            const result = await getPhaseById(projectId, phaseId);

            if (result.success) {
                setPhase(result.data);
            } else {
                setError(result.error || 'Failed to fetch phase');
            }
        } catch (err) {
            console.error('Error fetching phase:', err);
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePhase = async () => {
        const confirmed = window.confirm(`Are you sure you want to delete this phase: "${phase.phaseName}"?\n\nThis will delete ALL daily logs associated with this phase. This action cannot be undone.`);

        if (!confirmed) return;

        try {
            const result = await deletePhase(projectId, phaseId);
            if (result.success) {
                alert('🚀 Phase and all associated logs deleted successfully!');
                navigate(`/project/${projectId}`);
            } else {
                alert(`❌ Failed to delete phase: ${result.error}`);
            }
        } catch (err) {
            console.error('Error deleting phase:', err);
            alert('❌ An unexpected error occurred while deleting the phase');
        }
    };

    const handleUpdateStatus = async (newStatus) => {
        if (statusUpdating) return;
        setStatusUpdating(true);

        try {
            const result = await updatePhase(projectId, phaseId, { status: newStatus });
            if (result.success) {
                setPhase(prev => ({ ...prev, status: newStatus }));
                const message = newStatus === 'completed'
                    ? '✅ Phase marked as COMPLETED! Work is now locked.'
                    : '🔄 Phase is back IN PROGRESS.';
                alert(message);
            } else {
                alert(`❌ Failed to update status: ${result.error}`);
            }
        } catch (err) {
            console.error('Error updating status:', err);
            alert('❌ An unexpected error occurred while updating status');
        } finally {
            setStatusUpdating(false);
        }
    };


    const fetchDailyLogs = async () => {
        try {
            const result = await getDailyLogs(projectId, phaseId);

            if (result.success) {
                setDailyLogs(result.data);
                console.log('✅ Daily logs loaded:', result.data.length);
            } else {
                console.error('Failed to fetch daily logs:', result.error);
            }
        } catch (err) {
            console.error('Error fetching daily logs:', err);
        }
    };

    const handleLogSaved = () => {
        console.log('Daily log saved, refreshing...');
        fetchDailyLogs(); // Refresh logs list
        setEditingLog(null); // Clear editing state
    };

    const handleEditLog = (log) => {
        setEditingLog(log);
        setIsAddLogModalOpen(true);
    };

    const handleDeleteLog = async (log) => {
        // Show confirmation dialog
        const confirmed = window.confirm(
            `Are you sure you want to delete this daily log?\n\nDate: ${formatDate(log.date)}\n\nThis action cannot be undone.`
        );

        if (!confirmed) {
            return;
        }

        try {
            console.log('Deleting daily log:', log.id);
            const result = await deleteDailyLog(projectId, phaseId, log.id);

            if (result.success) {
                console.log('✅ Daily log deleted successfully');
                // Refresh logs list
                fetchDailyLogs();
            } else {
                alert(`Failed to delete log: ${result.error}`);
            }
        } catch (error) {
            console.error('Error deleting log:', error);
            alert('An unexpected error occurred while deleting the log');
        }
    };

    const handleCloseModal = () => {
        setIsAddLogModalOpen(false);
        setEditingLog(null);
    };

    // Image upload handlers
    const handlePhaseImageUpload = async (imageUrls) => {
        try {
            console.log('Uploading phase images:', imageUrls);
            const result = await addImagesToPhase(
                projectId,
                phaseId,
                phase.images || [],
                imageUrls
            );

            if (result.success) {
                console.log('✅ Phase images uploaded successfully');
                fetchPhaseData(); // Refresh phase data
            } else {
                alert(`Failed to upload images: ${result.error}`);
            }
        } catch (error) {
            console.error('Error uploading phase images:', error);
            alert('An unexpected error occurred while uploading images');
        }
    };

    const handleLogImageUpload = async (log, imageUrls) => {
        try {
            console.log('Uploading daily log images:', imageUrls);
            const result = await addImagesToDailyLog(
                projectId,
                phaseId,
                log.id,
                log.images || [],
                imageUrls
            );

            if (result.success) {
                console.log('✅ Daily log images uploaded successfully');
                fetchDailyLogs(); // Refresh logs
            } else {
                alert(`Failed to upload images: ${result.error}`);
            }
        } catch (error) {
            console.error('Error uploading log images:', error);
            alert('An unexpected error occurred while uploading images');
        }
    };

    // Delete image handlers
    const handleDeletePhaseImage = async (imageUrl) => {
        try {
            console.log('Deleting phase image:', imageUrl);
            const result = await deleteImageFromPhase(
                projectId,
                phaseId,
                phase.images || [],
                imageUrl
            );

            if (result.success) {
                console.log('✅ Phase image deleted successfully');
                fetchPhaseData(); // Refresh phase data
            } else {
                alert(`Failed to delete image: ${result.error}`);
            }
        } catch (error) {
            console.error('Error deleting phase image:', error);
            alert('An unexpected error occurred while deleting image');
        }
    };

    const handleDeleteLogImage = async (log, imageUrl) => {
        try {
            console.log('Deleting daily log image:', imageUrl);
            const result = await deleteImageFromDailyLog(
                projectId,
                phaseId,
                log.id,
                log.images || [],
                imageUrl
            );

            if (result.success) {
                console.log('✅ Daily log image deleted successfully');
                fetchDailyLogs(); // Refresh logs
            } else {
                alert(`Failed to delete image: ${result.error}`);
            }
        } catch (error) {
            console.error('Error deleting log image:', error);
            alert('An unexpected error occurred while deleting image');
        }
    };

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

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px'
            }}>
                <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>⏳</div>
                    <p>Loading phase...</p>
                </div>
            </div>
        );
    }

    if (error || !phase) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px'
            }}>
                <div style={{ textAlign: 'center', color: 'var(--color-danger)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>⚠️</div>
                    <p>{error || 'Phase not found'}</p>
                    <Button
                        variant="outline"
                        onClick={() => navigate(`/project/${projectId}`)}
                        style={{ marginTop: 'var(--spacing-md)' }}
                    >
                        Back to Project
                    </Button>
                </div>
            </div>
        );
    }

    const progress = phase.progress || 0;
    const isCompleted = phase.status === 'completed';

    return (
        <div style={{
            backgroundColor: isCompleted ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
            minHeight: '100vh',
            transition: 'background-color 0.3s ease'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 'var(--spacing-xl)',
                flexWrap: 'wrap',
                gap: 'var(--spacing-md)',
                paddingTop: 'var(--spacing-md)'
            }}>
                <div>
                    <Button
                        variant="outline"
                        size="small"
                        onClick={() => navigate(`/project/${projectId}`)}
                        style={{ marginBottom: 'var(--spacing-sm)' }}
                    >
                        ← Back to Project
                    </Button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                        <h1 style={{
                            margin: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-sm)',
                            color: isCompleted ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)'
                        }}>
                            {isCompleted && <span style={{ color: 'var(--color-success)', fontSize: '1.5rem' }}>✔</span>}
                            {phase.phaseName}
                        </h1>
                        {isCompleted && (
                            <span style={{
                                color: 'var(--color-success)',
                                fontWeight: '600',
                                fontSize: '0.875rem',
                                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                                padding: '4px 12px',
                                borderRadius: 'var(--radius-full)'
                            }}>
                                COMPLETED
                            </span>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
                    {/* Status Radio Group */}
                    <div style={{
                        display: 'flex',
                        backgroundColor: 'var(--color-bg-tertiary)',
                        padding: '4px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)'
                    }}>
                        <label style={{
                            padding: '6px 12px',
                            cursor: 'pointer',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            backgroundColor: !isCompleted ? 'var(--color-primary)' : 'transparent',
                            color: !isCompleted ? 'white' : 'var(--color-text-secondary)',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            <input
                                type="radio"
                                name="status"
                                checked={!isCompleted}
                                onChange={() => handleUpdateStatus('ongoing')}
                                style={{ display: 'none' }}
                                disabled={statusUpdating}
                            />
                            {statusUpdating && !isCompleted ? '⏳' : ''} In Progress
                        </label>
                        <label style={{
                            padding: '6px 12px',
                            cursor: 'pointer',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            backgroundColor: isCompleted ? 'var(--color-success)' : 'transparent',
                            color: isCompleted ? 'white' : 'var(--color-text-secondary)',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            <input
                                type="radio"
                                name="status"
                                checked={isCompleted}
                                onChange={() => handleUpdateStatus('completed')}
                                style={{ display: 'none' }}
                                disabled={statusUpdating}
                            />
                            {statusUpdating && isCompleted ? '⏳' : ''} Completed
                        </label>
                    </div>

                    {/* Delete Toggle */}
                    <button
                        onClick={handleDeletePhase}
                        style={{
                            backgroundColor: 'transparent',
                            border: '1px solid var(--color-border)',
                            cursor: 'pointer',
                            fontSize: '1.25rem',
                            color: 'var(--color-text-tertiary)',
                            padding: '8px',
                            borderRadius: 'var(--radius-md)',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = 'var(--color-danger)';
                            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                            e.currentTarget.style.borderColor = 'var(--color-danger)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'var(--color-text-tertiary)';
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.borderColor = 'var(--color-border)';
                        }}
                        title="Delete Phase"
                    >
                        ❌
                    </button>
                </div>
            </div>


            {/* Phase Info Card */}
            <Card
                title="Phase Information"
                style={{ marginBottom: 'var(--spacing-xl)' }}
            >
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                    gap: 'var(--spacing-md)',
                    marginBottom: 'var(--spacing-xl)'
                }}>
                    <div>
                        <div style={{ color: 'var(--color-text-tertiary)', fontSize: '0.875rem', marginBottom: '4px' }}>
                            Work Type
                        </div>
                        <div style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                            {phase.workType}
                        </div>
                    </div>

                    <div>
                        <div style={{ color: 'var(--color-text-tertiary)', fontSize: '0.875rem', marginBottom: '4px' }}>
                            Phase Cost
                        </div>
                        <div style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-primary)' }}>
                            {formatCurrency(phase.phaseCost)}
                        </div>
                    </div>

                    <div>
                        <div style={{ color: 'var(--color-text-tertiary)', fontSize: '0.875rem', marginBottom: '4px' }}>
                            Total Quantity
                        </div>
                        <div style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                            {phase.totalQuantity}
                        </div>
                    </div>

                    <div>
                        <div style={{ color: 'var(--color-text-tertiary)', fontSize: '0.875rem', marginBottom: '4px' }}>
                            Start Date
                        </div>
                        <div style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                            {formatDate(phase.startDate)}
                        </div>
                    </div>

                    <div>
                        <div style={{ color: 'var(--color-text-tertiary)', fontSize: '0.875rem', marginBottom: '4px' }}>
                            Status
                        </div>
                        <div>
                            <span style={{
                                padding: '6px 16px',
                                backgroundColor: isCompleted
                                    ? 'rgba(34, 197, 94, 0.1)'
                                    : 'rgba(245, 158, 11, 0.1)',
                                color: isCompleted
                                    ? 'var(--color-success)'
                                    : 'var(--color-primary)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                textTransform: 'capitalize',
                                display: 'inline-block',
                            }}>
                                {phase.status}
                            </span>
                        </div>
                    </div>

                    <div>
                        <div style={{ color: 'var(--color-text-tertiary)', fontSize: '0.875rem', marginBottom: '4px' }}>
                            Total Logs
                        </div>
                        <div style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-success)' }}>
                            {dailyLogs.length}
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                {progress > 0 && (
                    <div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 'var(--spacing-sm)'
                        }}>
                            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-tertiary)' }}>
                                Progress
                            </span>
                            <span style={{
                                fontSize: '1.25rem',
                                fontWeight: '600',
                                color: isCompleted ? 'var(--color-success)' : 'var(--color-primary)'
                            }}>
                                {progress}%
                            </span>
                        </div>
                        <div style={{
                            width: '100%',
                            height: '12px',
                            backgroundColor: 'var(--color-bg-tertiary)',
                            borderRadius: 'var(--radius-full)',
                            overflow: 'hidden',
                        }}>
                            <div style={{
                                width: `${progress}%`,
                                height: '100%',
                                background: isCompleted
                                    ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                                    : 'linear-gradient(90deg, var(--color-primary), #f97316)',
                                transition: 'width 0.5s ease-in-out',
                            }} />
                        </div>
                    </div>
                )}
            </Card>

            {/* Phase Images Section */}
            <Card
                title="📷 Phase Images"
                style={{ marginBottom: 'var(--spacing-xl)' }}
            >
                {!isCompleted && (
                    <ImageUpload
                        onUploadComplete={handlePhaseImageUpload}
                        buttonText="📷 Upload Phase Images"
                        multiple={true}
                    />
                )}

                <ImageGallery
                    images={phase.images || []}
                    emptyMessage="No phase images yet. Upload images to document this phase."
                    onDeleteImage={handleDeletePhaseImage}
                    showDelete={!isCompleted}
                    maxThumbnails={3}
                />
            </Card>

            {/* Daily Logs Section */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--spacing-lg)'
            }}>
                <h2 style={{ margin: 0 }}>📝 Daily Logs</h2>
                {!isCompleted && (
                    <Button
                        variant="primary"
                        onClick={() => {
                            setEditingLog(null);
                            setIsAddLogModalOpen(true);
                        }}
                    >
                        ➕ Add Daily Log
                    </Button>
                )}
            </div>


            <Card>
                {dailyLogs.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: 'var(--spacing-2xl)',
                        color: 'var(--color-text-tertiary)'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>📔</div>
                        <p>No daily logs yet</p>
                        <p style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-lg)' }}>
                            Click "Add Daily Log" to start tracking daily work
                        </p>
                        <Button
                            variant="primary"
                            onClick={() => {
                                setEditingLog(null);
                                setIsAddLogModalOpen(true);
                            }}
                        >
                            ➕ Add First Log
                        </Button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                        {dailyLogs.map((log) => (
                            <div
                                key={log.id}
                                style={{
                                    backgroundColor: 'var(--color-bg-tertiary)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--color-border)',
                                    overflow: 'hidden',
                                }}
                            >
                                {/* Date Header */}
                                <div style={{
                                    padding: 'var(--spacing-md) var(--spacing-lg)',
                                    backgroundColor: 'var(--color-bg-secondary)',
                                    borderBottom: '1px solid var(--color-border)',
                                }}>
                                    <div style={{
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        color: 'var(--color-text-primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--spacing-sm)'
                                    }}>
                                        📅 {formatDate(log.date)}
                                    </div>
                                </div>

                                {/* Two Column Layout: Today's Work | Tomorrow's Needs */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                                    gap: '1px',
                                    backgroundColor: 'var(--color-border)',
                                }}>
                                    {/* Today's Work */}
                                    <div style={{
                                        padding: 'var(--spacing-lg)',
                                        backgroundColor: 'var(--color-bg-tertiary)',
                                    }}>
                                        <div style={{
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            color: 'var(--color-text-tertiary)',
                                            marginBottom: 'var(--spacing-sm)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>
                                            Today's Work
                                        </div>
                                        <div style={{
                                            fontSize: '0.9375rem',
                                            color: 'var(--color-text-primary)',
                                            lineHeight: '1.7',
                                            whiteSpace: 'pre-wrap',
                                            wordBreak: 'break-word'
                                        }}>
                                            {log.todayLog || '-'}
                                        </div>
                                    </div>

                                    {/* Tomorrow's Needs */}
                                    <div style={{
                                        padding: 'var(--spacing-lg)',
                                        backgroundColor: 'var(--color-bg-tertiary)',
                                    }}>
                                        <div style={{
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            color: 'var(--color-text-tertiary)',
                                            marginBottom: 'var(--spacing-sm)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>
                                            Tomorrow's Needs
                                        </div>
                                        <div style={{
                                            fontSize: '0.9375rem',
                                            color: 'var(--color-text-primary)',
                                            lineHeight: '1.7',
                                            whiteSpace: 'pre-wrap',
                                            wordBreak: 'break-word'
                                        }}>
                                            {log.tomorrowNeeds || '-'}
                                        </div>
                                    </div>
                                </div>

                                {/* Images Section */}
                                <div style={{
                                    padding: 'var(--spacing-lg)',
                                    backgroundColor: 'var(--color-bg-tertiary)',
                                    borderTop: '1px solid var(--color-border)',
                                }}>
                                    <div style={{
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        color: 'var(--color-text-tertiary)',
                                        marginBottom: 'var(--spacing-sm)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        Images
                                    </div>

                                    {!isCompleted && (
                                        <ImageUpload
                                            onUploadComplete={(urls) => handleLogImageUpload(log, urls)}
                                            buttonText="📷 Upload Images"
                                            multiple={true}
                                        />
                                    )}

                                    <ImageGallery
                                        images={log.images || []}
                                        emptyMessage="No images for this log"
                                        onDeleteImage={(imageUrl) => handleDeleteLogImage(log, imageUrl)}
                                        showDelete={!isCompleted}
                                        maxThumbnails={3}
                                    />
                                </div>

                                {/* Edit and Delete Buttons */}
                                {!isCompleted && (
                                    <div style={{
                                        padding: 'var(--spacing-md) var(--spacing-lg)',
                                        backgroundColor: 'var(--color-bg-secondary)',
                                        borderTop: '1px solid var(--color-border)',
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        gap: 'var(--spacing-sm)',
                                    }}>
                                        <Button
                                            variant="outline"
                                            size="small"
                                            onClick={() => handleEditLog(log)}
                                        >
                                            ✏️ Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="small"
                                            onClick={() => handleDeleteLog(log)}
                                            style={{
                                                borderColor: 'var(--color-danger)',
                                                color: 'var(--color-danger)',
                                            }}
                                        >
                                            🗑️ Delete
                                        </Button>
                                    </div>
                                )}

                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* Add/Edit Daily Log Modal */}
            <AddDailyLogModal
                isOpen={isAddLogModalOpen}
                onClose={handleCloseModal}
                projectId={projectId}
                phaseId={phaseId}
                editLog={editingLog}
                onLogSaved={handleLogSaved}
            />
        </div>
    );
};

export default PhaseDetail;
