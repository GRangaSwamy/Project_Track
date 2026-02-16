import React, { useState } from 'react';
import { createPhase } from '../../services/phaseService';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

/**
 * AddPhaseModal Component
 * Modal form to create a new phase in a project
 * 
 * @param {boolean} isOpen - Control modal visibility
 * @param {function} onClose - Close handler
 * @param {string} projectId - Parent project ID
 * @param {function} onPhaseCreated - Callback after successful creation
 */
const AddPhaseModal = ({ isOpen, onClose, projectId, onPhaseCreated }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        phaseName: '',
        workType: '',
        startDate: '',
        phaseCost: '',
        totalQuantity: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        setError(''); // Clear error on input change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Validate required fields
            if (!formData.phaseName || !formData.workType || !formData.startDate ||
                !formData.phaseCost || !formData.totalQuantity) {
                setError('Please fill in all required fields');
                setLoading(false);
                return;
            }

            // Validate projectId
            if (!projectId) {
                setError('Project ID is missing');
                setLoading(false);
                return;
            }

            console.log('Creating phase for project:', projectId);
            console.log('Phase data:', formData);

            // Create phase in Firestore
            const result = await createPhase(projectId, {
                phaseName: formData.phaseName,
                workType: formData.workType,
                startDate: formData.startDate,
                phaseCost: parseFloat(formData.phaseCost),
                totalQuantity: parseFloat(formData.totalQuantity),
            });

            if (result.success) {
                console.log('✅ Phase created successfully:', result.id);

                // Reset form
                setFormData({
                    phaseName: '',
                    workType: '',
                    startDate: '',
                    phaseCost: '',
                    totalQuantity: '',
                });

                // Call callback to refresh phase list
                if (onPhaseCreated) {
                    onPhaseCreated();
                }

                // Close modal
                onClose();
            } else {
                setError(result.error || 'Failed to create phase');
            }
        } catch (error) {
            console.error('Error creating phase:', error);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setFormData({
                phaseName: '',
                workType: '',
                startDate: '',
                phaseCost: '',
                totalQuantity: '',
            });
            setError('');
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Add New Phase"
            footer={
                <>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        loading={loading}
                        onClick={handleSubmit}
                    >
                        {loading ? 'Creating...' : 'Create Phase'}
                    </Button>
                </>
            }
        >
            <form onSubmit={handleSubmit}>
                {error && (
                    <div style={{
                        padding: 'var(--spacing-md)',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid var(--color-danger)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--color-danger)',
                        marginBottom: 'var(--spacing-lg)',
                        fontSize: '0.875rem',
                    }}>
                        {error}
                    </div>
                )}

                <Input
                    label="Phase Name"
                    type="text"
                    name="phaseName"
                    value={formData.phaseName}
                    onChange={handleChange}
                    placeholder="e.g., Foundation Work"
                    required
                    disabled={loading}
                />

                <Input
                    label="Work Type"
                    type="text"
                    name="workType"
                    value={formData.workType}
                    onChange={handleChange}
                    placeholder="e.g., Gravel, Sand Filling, Weed Removal"
                    required
                    disabled={loading}
                    helper="Type of work to be done in this phase"
                />

                <Input
                    label="Start Date"
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    disabled={loading}
                />

                <Input
                    label="Phase Cost"
                    type="number"
                    name="phaseCost"
                    value={formData.phaseCost}
                    onChange={handleChange}
                    placeholder="Enter estimated cost for this phase"
                    required
                    disabled={loading}
                    helper="Estimated budget for this phase (in ₹)"
                />

                <Input
                    label="Total Quantity"
                    type="number"
                    name="totalQuantity"
                    value={formData.totalQuantity}
                    onChange={handleChange}
                    placeholder="e.g., 100 (meters, bags, etc.)"
                    required
                    disabled={loading}
                    helper="Total quantity of work (e.g., 100 meters)"
                />
            </form>
        </Modal>
    );
};

export default AddPhaseModal;
