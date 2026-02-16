import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAllProjects, deleteProject } from '../services/projectService';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import TypingGreeting from '../components/common/TypingGreeting';

/**
 * Dashboard Page
 * Main dashboard showing project statistics and list
 * Integrated with Firestore
 */
const Dashboard = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    // Fetch projects on component mount and when user changes
    useEffect(() => {
        if (currentUser) {
            fetchProjects();
        }
    }, [currentUser]);

    const fetchProjects = async () => {
        if (!currentUser) return;

        setLoading(true);
        setError('');

        try {
            const result = await getAllProjects(currentUser.uid);

            if (result.success) {
                setProjects(result.data);
            } else {
                if (result.error === 'DATABASE_INDEX_REQUIRED') {
                    setError('⚠️ Database setup in progress. Please wait a few minutes for the system to optimize or contact the administrator.');
                } else {
                    setError(result.error || 'Failed to fetch projects');
                }
            }
        } catch (err) {
            console.error('Error fetching projects:', err);
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProject = async (e, projectId, projectName) => {
        e.stopPropagation(); // Prevent navigation to project detail

        const confirmed = window.confirm(`Are you sure you want to delete "${projectName}"?\n\nThis will delete ALL phases and daily logs associated with this project. This action cannot be undone.`);

        if (!confirmed) return;

        try {
            const result = await deleteProject(projectId);
            if (result.success) {
                alert('🚀 Project and all associated data deleted successfully!');
                fetchProjects(); // Refresh the list
            } else {
                alert(`❌ Failed to delete project: ${result.error}`);
            }
        } catch (err) {
            console.error('Error deleting project:', err);
            alert('❌ An unexpected error occurred while deleting the project');
        }
    };





    // Calculate statistics
    const totalProjects = projects.length;
    const ongoingProjects = projects.filter(p => p.status === 'ongoing').length;

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--spacing-xl)'
            }}>
                <h1>Dashboard</h1>
                <Button
                    variant="primary"
                    onClick={() => navigate('/add-project')}
                >
                    ➕ Add Project
                </Button>
            </div>

            <TypingGreeting name={currentUser?.displayName} />


            {/* Statistics Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-xl)'
            }}>
                <Card title="Total Projects" hoverable>
                    <div style={{ fontSize: '2.5rem', fontWeight: '600', color: 'var(--color-primary)' }}>
                        {totalProjects}
                    </div>
                    <div style={{ color: 'var(--color-text-tertiary)', fontSize: '0.875rem', marginTop: 'var(--spacing-sm)' }}>
                        All time
                    </div>
                </Card>

                <Card title="Ongoing Projects" hoverable>
                    <div style={{ fontSize: '2.5rem', fontWeight: '600', color: 'var(--color-success)' }}>
                        {ongoingProjects}
                    </div>
                    <div style={{ color: 'var(--color-text-tertiary)', fontSize: '0.875rem', marginTop: 'var(--spacing-sm)' }}>
                        Active now
                    </div>
                </Card>
            </div>

            {/* Projects List */}
            <Card title="Recent Projects">
                {loading ? (
                    <div style={{
                        textAlign: 'center',
                        padding: 'var(--spacing-2xl)',
                        color: 'var(--color-text-secondary)'
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>⏳</div>
                        <p>Loading projects...</p>
                    </div>
                ) : error ? (
                    <div style={{
                        textAlign: 'center',
                        padding: 'var(--spacing-2xl)',
                        color: 'var(--color-danger)'
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>⚠️</div>
                        <p>{error}</p>
                        <Button
                            variant="outline"
                            size="small"
                            onClick={fetchProjects}
                            style={{ marginTop: 'var(--spacing-md)' }}
                        >
                            Retry
                        </Button>
                    </div>
                ) : projects.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: 'var(--spacing-2xl)',
                        color: 'var(--color-text-tertiary)'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>📋</div>
                        <p>No projects yet</p>
                        <p style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-lg)' }}>
                            Click "Add Project" to create your first project
                        </p>
                        <Button
                            variant="primary"
                            onClick={() => navigate('/add-project')}
                        >
                            ➕ Add Your First Project
                        </Button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                onClick={() => navigate(`/project/${project.id}`)}
                                style={{
                                    padding: 'var(--spacing-lg)',
                                    backgroundColor: 'var(--color-bg-tertiary)',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer',
                                    transition: 'all var(--transition-fast)',
                                    border: '1px solid transparent',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                                    e.currentTarget.style.transform = 'translateX(4px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'transparent';
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
                                            color: 'var(--color-text-primary)',
                                            fontSize: '1.125rem',
                                            margin: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--spacing-sm)'
                                        }}>
                                            {project.name}
                                            <span style={{
                                                padding: '4px 12px',
                                                backgroundColor: project.status === 'ongoing'
                                                    ? 'rgba(34, 197, 94, 0.1)'
                                                    : 'rgba(156, 163, 175, 0.1)',
                                                color: project.status === 'ongoing'
                                                    ? 'var(--color-success)'
                                                    : 'var(--color-text-tertiary)',
                                                borderRadius: 'var(--radius-sm)',
                                                fontSize: '0.75rem',
                                                fontWeight: '500',
                                                textTransform: 'capitalize',
                                            }}>
                                                {project.status === 'completed' ? '✓ ' : ''}{project.status === 'ongoing' ? 'Ongoing' : 'Completed'}
                                            </span>
                                        </h3>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                        <button
                                            onClick={(e) => handleDeleteProject(e, project.id, project.name)}
                                            style={{
                                                backgroundColor: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: '1.25rem',
                                                color: 'var(--color-text-tertiary)',
                                                padding: '4px',
                                                borderRadius: 'var(--radius-sm)',
                                                transition: 'all var(--transition-fast)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.color = 'var(--color-danger)';
                                                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.color = 'var(--color-text-tertiary)';
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                            }}
                                            title="Delete Project"
                                        >
                                            ❌
                                        </button>
                                    </div>
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
                                            Start Date
                                        </div>
                                    </div>

                                    <div>
                                        <div style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--color-text-tertiary)',
                                            marginBottom: '4px'
                                        }}>
                                            Estimated Cost
                                        </div>
                                        <div style={{
                                            fontSize: '1rem',
                                            fontWeight: '600',
                                            color: 'var(--color-primary)'
                                        }}>
                                            {new Intl.NumberFormat('en-IN', {
                                                style: 'currency',
                                                currency: 'INR',
                                                maximumFractionDigits: 0,
                                            }).format(project.estimatedCost || 0)}
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
                                            fontSize: '1rem',
                                            fontWeight: '500',
                                            color: 'var(--color-text-secondary)'
                                        }}>
                                            {formatDate(project.startDate)}
                                        </div>
                                    </div>

                                    <div>
                                        <div style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--color-text-tertiary)',
                                            marginBottom: '4px'
                                        }}>
                                            Status
                                        </div>
                                        <div style={{
                                            fontSize: '0.875rem',
                                            fontWeight: '500',
                                            color: 'var(--color-text-secondary)',
                                            textTransform: 'capitalize'
                                        }}>
                                            {project.status}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};


export default Dashboard;
