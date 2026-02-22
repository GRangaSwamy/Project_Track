import React, { useState, useEffect } from 'react';
import { createDailyLog, updateDailyLog } from '../../services/dailyLogService';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

/**
 * AddDailyLogModal Component
 * Ultra-simple form: Today's work + Tomorrow's needs
 * Supports both Add and Edit modes
 * 
 * @param {boolean} isOpen - Control modal visibility
 * @param {function} onClose - Close handler
 * @param {string} projectId - Parent project ID
 * @param {string} phaseId - Parent phase ID
 * @param {Object} editLog - Log to edit (null for add mode)
 * @param {function} onLogSaved - Callback after successful save
 */
const AddDailyLogModal = ({ isOpen, onClose, projectId, phaseId, editLog = null, onLogSaved }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isEditMode = editLog !== null;

    // Get today's date in YYYY-MM-DD format
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const [formData, setFormData] = useState({
        date: getTodayDate(),
        todayLog: '',
        tomorrowNeeds: '',
    });

    // Pre-fill form when editing
    useEffect(() => {
        if (editLog) {
            setFormData({
                date: editLog.date || getTodayDate(),
                todayLog: editLog.todayLog || '',
                tomorrowNeeds: editLog.tomorrowNeeds || '',
            });
        } else {
            setFormData({
                date: getTodayDate(),
                todayLog: '',
                tomorrowNeeds: '',
            });
        }
    }, [editLog, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Validate required fields
            if (!formData.date || !formData.todayLog.trim()) {
                setError('Please fill in date and today\'s work log');
                setLoading(false);
                return;
            }

            console.log(isEditMode ? 'Updating daily log...' : 'Creating daily log...');

            // Prepare log data
            const logData = {
                date: formData.date,
                todayLog: formData.todayLog.trim(),
                tomorrowNeeds: formData.tomorrowNeeds.trim(),
            };

            let result;

            if (isEditMode) {
                // Update existing log
                result = await updateDailyLog(projectId, phaseId, editLog.id, logData);
            } else {
                // Create new log
                result = await createDailyLog(projectId, phaseId, logData);
            }

            if (result.success) {
                console.log(isEditMode ? '✅ Daily log updated' : '✅ Daily log created');

                // Reset form
                resetForm();

                // Call callback to refresh
                if (onLogSaved) {
                    onLogSaved();
                }

                // Close modal
                onClose();
            } else {
                setError(result.error || `Failed to ${isEditMode ? 'update' : 'create'} daily log`);
            }
        } catch (error) {
            console.error('Error saving daily log:', error);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            date: getTodayDate(),
            todayLog: '',
            tomorrowNeeds: '',
        });
        setError('');
    };

    const handleClose = () => {
        if (!loading) {
            resetForm();
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={isEditMode ? '✏️ Edit Daily Log' : '📝 Add Daily Log'}
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
                        {loading ? 'Saving...' : isEditMode ? 'Update Log' : 'Save Log'}
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

                {/* Date */}
                <Input
                    label="Date"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    disabled={loading}
                />

                {/* Today's Work Log */}
                <div style={{ marginTop: 'var(--spacing-lg)' }}>
                    <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: 'var(--color-text-primary)',
                        marginBottom: 'var(--spacing-sm)'
                    }}>
                        Today's Work Log <span style={{ color: 'var(--color-danger)' }}>*</span>
                    </label>
                    <textarea
                        name="todayLog"
                        value={formData.todayLog}
                        onChange={handleChange}
                        placeholder="Enter today's work...

Example:
• Paid ₹4000 to driver
• Used 40 tonnes sand
• Weed removal completed
• Levelling done for 100 meters"
                        required
                        disabled={loading}
                        rows={8}
                        style={{
                            width: '100%',
                            padding: 'var(--spacing-md)',
                            backgroundColor: 'var(--color-bg-tertiary)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--color-text-primary)',
                            fontSize: '0.9375rem',
                            fontFamily: 'inherit',
                            resize: 'vertical',
                            lineHeight: '1.6',
                        }}
                    />
                    <div style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-tertiary)',
                        marginTop: 'var(--spacing-xs)'
                    }}>
                        What work was completed today?
                    </div>
                </div>

                {/* Tomorrow's Requirements */}
                <div style={{ marginTop: 'var(--spacing-lg)' }}>
                    <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: 'var(--color-text-primary)',
                        marginBottom: 'var(--spacing-sm)'
                    }}>
                        Things Required for Tomorrow
                    </label>
                    <textarea
                        name="tomorrowNeeds"
                        value={formData.tomorrowNeeds}
                        onChange={handleChange}
                        placeholder="Enter tomorrow's requirements...

Example:
• White cement
• Boundary marking tools
• Extra labour (2 people)
• Sand delivery"
                        disabled={loading}
                        rows={6}
                        style={{
                            width: '100%',
                            padding: 'var(--spacing-md)',
                            backgroundColor: 'var(--color-bg-tertiary)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--color-text-primary)',
                            fontSize: '0.9375rem',
                            fontFamily: 'inherit',
                            resize: 'vertical',
                            lineHeight: '1.6',
                        }}
                    />
                    <div style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-tertiary)',
                        marginTop: 'var(--spacing-xs)'
                    }}>
                        What materials or resources are needed tomorrow?
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default AddDailyLogModal;
