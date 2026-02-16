import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectById } from '../../services/projectService';
import { getPhases, deletePhase } from '../../services/phaseService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import AddPhaseModal from '../../components/phases/AddPhaseModal';
import MaterialImageStrip from '../../components/common/MaterialImageStrip';
import MaterialEstimationTable from '../../components/common/MaterialEstimationTable';
import ProjectInfoHeader from '../../components/projects/ProjectInfoHeader';

/**
 * Project Detail Page
 * Shows project information and list of phases
 * Integrated with Firestore
 */
const ProjectDetail = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [phases, setPhases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAddPhaseModalOpen, setIsAddPhaseModalOpen] = useState(false);
    const [isEstimationTableOpen, setIsEstimationTableOpen] = useState(false);


    // Fetch project and phases on component mount
    useEffect(() => {
        if (projectId) {
            fetchProjectData();
            fetchPhases();
        }
    }, [projectId]);

    const fetchProjectData = async () => {
        try {
            const result = await getProjectById(projectId);

            if (result.success) {
                setProject(result.data);
            } else {
                setError(result.error || 'Failed to fetch project');
            }
        } catch (err) {
            console.error('Error fetching project:', err);
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const fetchPhases = async () => {
        try {
            const result = await getPhases(projectId);

            if (result.success) {
                setPhases(result.data);
                console.log('✅ Phases loaded:', result.data.length);
            } else {
                console.error('Failed to fetch phases:', result.error);
            }
        } catch (err) {
            console.error('Error fetching phases:', err);
        }
    };

    const handlePhaseCreated = () => {
        console.log('Phase created, refreshing list...');
        fetchPhases(); // Refresh phases list
    };

    const handleMaterialUpdate = () => {
        console.log('Material updated, refreshing data...');
        // Material panel will auto-refresh, no need to fetch project data
    };


    const handleDeletePhase = async (e, phaseId, phaseName) => {
        e.stopPropagation(); // Prevent navigation to phase detail

        const confirmed = window.confirm(`Are you sure you want to delete phase "${phaseName}"?\n\nThis will delete ALL daily logs for this phase. This action cannot be undone.`);

        if (!confirmed) return;

        try {
            const result = await deletePhase(projectId, phaseId);
            if (result.success) {
                alert('🚀 Phase and all associated logs deleted successfully!');
                fetchPhases(); // Refresh list
            } else {
                alert(`❌ Failed to delete phase: ${result.error}`);
            }
        } catch (err) {
            console.error('Error deleting phase:', err);
            alert('❌ An unexpected error occurred while deleting the phase');
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
                    <p>Loading project...</p>
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px'
            }}>
                <div style={{ textAlign: 'center', color: 'var(--color-danger)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>⚠️</div>
                    <p>{error || 'Project not found'}</p>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/')}
                        style={{ marginTop: 'var(--spacing-md)' }}
                    >
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--spacing-xl)',
                flexWrap: 'wrap',
                gap: 'var(--spacing-md)'
            }}>
                <div>
                    <Button
                        variant="outline"
                        size="small"
                        onClick={() => navigate('/')}
                        style={{ marginBottom: 'var(--spacing-sm)' }}
                    >
                        ← Back to Dashboard
                    </Button>
                    <h1 style={{ margin: 0 }}>{project.name}</h1>
                </div>
                <div>
                    <Button
                        variant="primary"
                        onClick={() => setIsEstimationTableOpen(true)}
                    >
                        📊 Material Estimation
                    </Button>
                </div>
            </div>

            {/* Project Info Header */}
            <ProjectInfoHeader
                project={project}
                onUpdate={fetchProjectData}
            />

            {/* Material Tracking Panel */}
            <MaterialImageStrip
                projectId={projectId}
                onUpdate={handleMaterialUpdate}
            />


            {/* Project Info Card */}
            <Card
                title="Project Information"
                style={{ marginBottom: 'var(--spacing-xl)' }}
            >
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                    gap: 'var(--spacing-md)'
                }}>
                    <div>
                        <div style={{ color: 'var(--color-text-tertiary)', fontSize: '0.875rem', marginBottom: '4px' }}>
                            Start Date
                        </div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                            {formatDate(project.startDate)}
                        </div>
                    </div>

                    <div>
                        <div style={{ color: 'var(--color-text-tertiary)', fontSize: '0.875rem', marginBottom: '4px' }}>
                            Status
                        </div>
                        <div>
                            <span style={{
                                padding: '6px 16px',
                                backgroundColor: project.status === 'ongoing'
                                    ? 'rgba(34, 197, 94, 0.1)'
                                    : 'rgba(156, 163, 175, 0.1)',
                                color: project.status === 'ongoing'
                                    ? 'var(--color-success)'
                                    : 'var(--color-text-tertiary)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                textTransform: 'capitalize',
                                display: 'inline-block',
                            }}>
                                {project.status}
                            </span>
                        </div>
                    </div>

                    <div>
                        <div style={{ color: 'var(--color-text-tertiary)', fontSize: '0.875rem', marginBottom: '4px' }}>
                            Total Phases
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--color-success)' }}>
                            {phases.length}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Phases Section */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--spacing-lg)'
            }}>
                <h2 style={{ margin: 0 }}>Phases</h2>
                <Button
                    variant="primary"
                    onClick={() => setIsAddPhaseModalOpen(true)}
                >
                    ➕ Add Phase
                </Button>
            </div>

            <Card>
                {phases.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: 'var(--spacing-2xl)',
                        color: 'var(--color-text-tertiary)'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>📝</div>
                        <p>No phases yet</p>
                        <p style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-lg)' }}>
                            Click "Add Phase" to create the first phase for this project
                        </p>
                        <Button
                            variant="primary"
                            onClick={() => setIsAddPhaseModalOpen(true)}
                        >
                            ➕ Add First Phase
                        </Button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        {phases.map((phase) => {
                            const isCompleted = phase.status === 'completed';
                            return (
                                <div
                                    key={phase.id}
                                    onClick={() => navigate(`/project/${projectId}/phase/${phase.id}`)}
                                    style={{
                                        padding: 'var(--spacing-lg)',
                                        backgroundColor: isCompleted ? 'rgba(0, 0, 0, 0.02)' : 'var(--color-bg-tertiary)',
                                        borderRadius: 'var(--radius-md)',
                                        cursor: 'pointer',
                                        transition: 'all var(--transition-fast)',
                                        border: isCompleted ? '1px solid var(--color-border)' : '1px solid transparent',
                                        opacity: isCompleted ? 0.8 : 1
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--color-primary)';
                                        e.currentTarget.style.transform = 'translateX(4px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = isCompleted ? 'var(--color-border)' : 'transparent';
                                        e.currentTarget.style.transform = 'translateX(0)';
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        marginBottom: 'var(--spacing-sm)'
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{
                                                color: isCompleted ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)',
                                                fontSize: '1.125rem',
                                                margin: 0,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 'var(--spacing-sm)'
                                            }}>
                                                {isCompleted && <span style={{ color: 'var(--color-success)' }}>✔</span>}
                                                {phase.phaseName}
                                                <span style={{
                                                    padding: '4px 12px',
                                                    backgroundColor: isCompleted
                                                        ? 'rgba(34, 197, 94, 0.1)'
                                                        : 'rgba(245, 158, 11, 0.1)',
                                                    color: isCompleted
                                                        ? 'var(--color-success)'
                                                        : 'var(--color-primary)',
                                                    borderRadius: 'var(--radius-sm)',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '500',
                                                    textTransform: 'capitalize',
                                                }}>
                                                    {phase.status}
                                                </span>
                                            </h3>
                                        </div>
                                        <button
                                            onClick={(e) => handleDeletePhase(e, phase.id, phase.phaseName)}
                                            style={{
                                                backgroundColor: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: '1.125rem',
                                                color: 'var(--color-text-tertiary)',
                                                padding: '4px',
                                                borderRadius: 'var(--radius-sm)',
                                                transition: 'all var(--transition-fast)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginLeft: 'var(--spacing-md)'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.color = 'var(--color-danger)';
                                                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.color = 'var(--color-text-tertiary)';
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                            }}
                                            title="Delete Phase"
                                        >
                                            ❌
                                        </button>
                                    </div>


                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                                        gap: 'var(--spacing-md)',
                                        marginTop: 'var(--spacing-md)'
                                    }}>
                                        <div>
                                            <div style={{
                                                fontSize: '0.75rem',
                                                color: 'var(--color-text-tertiary)',
                                                marginBottom: '4px'
                                            }}>
                                                Work Type
                                            </div>
                                            <div style={{
                                                fontSize: '0.875rem',
                                                fontWeight: '500',
                                                color: 'var(--color-text-secondary)'
                                            }}>
                                                {phase.workType}
                                            </div>
                                        </div>

                                        <div>
                                            <div style={{
                                                fontSize: '0.75rem',
                                                color: 'var(--color-text-tertiary)',
                                                marginBottom: '4px'
                                            }}>
                                                Phase Cost
                                            </div>
                                            <div style={{
                                                fontSize: '0.875rem',
                                                fontWeight: '600',
                                                color: 'var(--color-primary)'
                                            }}>
                                                {formatCurrency(phase.phaseCost)}
                                            </div>
                                        </div>

                                        <div>
                                            <div style={{
                                                fontSize: '0.75rem',
                                                color: 'var(--color-text-tertiary)',
                                                marginBottom: '4px'
                                            }}>
                                                Total Quantity
                                            </div>
                                            <div style={{
                                                fontSize: '0.875rem',
                                                fontWeight: '500',
                                                color: 'var(--color-text-secondary)'
                                            }}>
                                                {phase.totalQuantity}
                                            </div>
                                        </div>

                                        <div>
                                            <div style={{
                                                fontSize: '0.75rem',
                                                color: 'var(--color-text-tertiary)',
                                                marginBottom: '4px'
                                            }}>
                                                Start Date
                                            </div>
                                            <div style={{
                                                fontSize: '0.875rem',
                                                fontWeight: '500',
                                                color: 'var(--color-text-secondary)'
                                            }}>
                                                {formatDate(phase.startDate)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

            </Card>

            {/* Add Phase Modal */}
            <AddPhaseModal
                isOpen={isAddPhaseModalOpen}
                onClose={() => setIsAddPhaseModalOpen(false)}
                projectId={projectId}
                onPhaseCreated={handlePhaseCreated}
            />

            {/* Material Estimation Table Modal */}
            <MaterialEstimationTable
                isOpen={isEstimationTableOpen}
                onClose={() => setIsEstimationTableOpen(false)}
                projectId={projectId}
                projectName={project?.name}
                onUpdate={handleMaterialUpdate}
            />
        </div>
    );
};


export default ProjectDetail;
