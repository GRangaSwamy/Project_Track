import React, { useState, useEffect } from 'react';
import { getMaterialLogsByDate, getMaterialLogs, deleteMaterialLog, updateMaterialLog, MATERIALS } from '../../services/materialService';
import Modal from './Modal';
import Button from './Button';

/**
 * MaterialQuoteTable Component
 * Displays complete material usage table with date-wise breakdown
 */
const MaterialQuoteTable = ({ isOpen, onClose, projectId, onUpdate }) => {
    const [logsByDate, setLogsByDate] = useState({});
    const [dates, setDates] = useState([]);
    const [allLogs, setAllLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingLog, setEditingLog] = useState(null);
    const [editFormData, setEditFormData] = useState({ amount: '', date: '' });

    useEffect(() => {
        if (isOpen && projectId) {
            fetchData();
        }
    }, [isOpen, projectId]);

    const fetchData = async () => {
        setLoading(true);

        // Fetch grouped data for table
        const groupedResult = await getMaterialLogsByDate(projectId);
        if (groupedResult.success) {
            setLogsByDate(groupedResult.data.logsByDate);
            setDates(groupedResult.data.dates);
        }

        // Fetch all logs for editing/deleting
        const logsResult = await getMaterialLogs(projectId);
        if (logsResult.success) {
            setAllLogs(logsResult.data);
        }

        setLoading(false);
    };

    const handleDelete = async (logId) => {
        if (!window.confirm('Are you sure you want to delete this entry?')) {
            return;
        }

        const result = await deleteMaterialLog(projectId, logId);
        if (result.success) {
            await fetchData();
            if (onUpdate) onUpdate();
        } else {
            alert(`Error: ${result.error}`);
        }
    };

    const handleEdit = (log) => {
        setEditingLog(log);
        setEditFormData({
            amount: log.amount,
            date: log.date,
        });
    };

    const handleSaveEdit = async () => {
        if (!editFormData.amount || parseFloat(editFormData.amount) <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        const result = await updateMaterialLog(projectId, editingLog.id, {
            amount: parseFloat(editFormData.amount),
            date: editFormData.date,
        });

        if (result.success) {
            setEditingLog(null);
            await fetchData();
            if (onUpdate) onUpdate();
        } else {
            alert(`Error: ${result.error}`);
        }
    };

    const handleCancelEdit = () => {
        setEditingLog(null);
        setEditFormData({ amount: '', date: '' });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('en-IN').format(num || 0);
    };

    const calculateRowTotal = (material) => {
        let total = 0;
        dates.forEach(date => {
            total += logsByDate[date]?.[material] || 0;
        });
        return total;
    };

    const calculateColumnTotal = (date) => {
        let total = 0;
        MATERIALS.forEach(material => {
            total += logsByDate[date]?.[material] || 0;
        });
        return total;
    };

    const calculateGrandTotal = () => {
        let total = 0;
        MATERIALS.forEach(material => {
            total += calculateRowTotal(material);
        });
        return total;
    };

    if (loading) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} title="📊 Complete Material Quote">
                <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)', color: 'var(--color-text-secondary)' }}>
                    Loading material data...
                </div>
            </Modal>
        );
    }

    if (dates.length === 0) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} title="📊 Complete Material Quote">
                <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)', color: 'var(--color-text-tertiary)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>📋</div>
                    <p>No material logs yet</p>
                    <p style={{ fontSize: '0.875rem' }}>Start adding materials to see the quote table</p>
                </div>
            </Modal>
        );
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="📊 Complete Material Quote"
            size="large"
        >
            {/* Summary Stats */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-lg)',
                padding: 'var(--spacing-md)',
                backgroundColor: 'var(--color-bg-tertiary)',
                borderRadius: 'var(--radius-md)',
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginBottom: '4px' }}>
                        Total Days
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-primary)' }}>
                        {dates.length}
                    </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginBottom: '4px' }}>
                        Total Entries
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-success)' }}>
                        {allLogs.length}
                    </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginBottom: '4px' }}>
                        Grand Total
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-primary)' }}>
                        {formatNumber(calculateGrandTotal())}
                    </div>
                </div>
            </div>

            {/* Material Quote Table */}
            <div style={{ overflowX: 'auto', marginBottom: 'var(--spacing-lg)' }}>
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '0.875rem',
                }}>
                    <thead>
                        <tr style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
                            <th style={{
                                padding: '12px',
                                textAlign: 'left',
                                fontWeight: '600',
                                color: 'var(--color-text-primary)',
                                position: 'sticky',
                                left: 0,
                                backgroundColor: 'var(--color-bg-tertiary)',
                                zIndex: 1,
                            }}>
                                Material
                            </th>
                            {dates.map(date => (
                                <th key={date} style={{
                                    padding: '12px',
                                    textAlign: 'right',
                                    fontWeight: '600',
                                    color: 'var(--color-text-primary)',
                                    minWidth: '100px',
                                }}>
                                    {formatDate(date)}
                                </th>
                            ))}
                            <th style={{
                                padding: '12px',
                                textAlign: 'right',
                                fontWeight: '700',
                                color: 'var(--color-success)',
                                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                            }}>
                                Total
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {MATERIALS.map((material, idx) => (
                            <tr key={material} style={{
                                borderBottom: '1px solid var(--color-border)',
                                backgroundColor: idx % 2 === 0 ? 'transparent' : 'var(--color-bg-tertiary)',
                            }}>
                                <td style={{
                                    padding: '12px',
                                    fontWeight: '600',
                                    color: 'var(--color-text-primary)',
                                    position: 'sticky',
                                    left: 0,
                                    backgroundColor: idx % 2 === 0 ? 'var(--color-bg-primary)' : 'var(--color-bg-tertiary)',
                                }}>
                                    {material}
                                </td>
                                {dates.map(date => {
                                    const amount = logsByDate[date]?.[material] || 0;
                                    return (
                                        <td key={date} style={{
                                            padding: '12px',
                                            textAlign: 'right',
                                            color: amount > 0 ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
                                            fontWeight: amount > 0 ? '500' : '400',
                                        }}>
                                            {amount > 0 ? formatNumber(amount) : '—'}
                                        </td>
                                    );
                                })}
                                <td style={{
                                    padding: '12px',
                                    textAlign: 'right',
                                    fontWeight: '700',
                                    color: 'var(--color-success)',
                                    backgroundColor: 'rgba(34, 197, 94, 0.05)',
                                }}>
                                    {formatNumber(calculateRowTotal(material))}
                                </td>
                            </tr>
                        ))}
                        {/* Column Totals Row */}
                        <tr style={{
                            backgroundColor: 'var(--color-bg-tertiary)',
                            fontWeight: '700',
                        }}>
                            <td style={{ padding: '12px', color: 'var(--color-text-primary)' }}>
                                Daily Total
                            </td>
                            {dates.map(date => (
                                <td key={date} style={{
                                    padding: '12px',
                                    textAlign: 'right',
                                    color: 'var(--color-primary)',
                                }}>
                                    {formatNumber(calculateColumnTotal(date))}
                                </td>
                            ))}
                            <td style={{
                                padding: '12px',
                                textAlign: 'right',
                                color: 'var(--color-success)',
                                fontSize: '1rem',
                                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                            }}>
                                {formatNumber(calculateGrandTotal())}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Individual Logs Section */}
            <div>
                <h3 style={{ marginBottom: 'var(--spacing-md)', fontSize: '1rem', color: 'var(--color-text-primary)' }}>
                    📝 Individual Entries ({allLogs.length})
                </h3>
                <div style={{
                    maxHeight: '300px',
                    overflowY: 'auto',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                }}>
                    {allLogs.map((log, idx) => (
                        <div
                            key={log.id}
                            style={{
                                padding: 'var(--spacing-md)',
                                borderBottom: idx < allLogs.length - 1 ? '1px solid var(--color-border)' : 'none',
                                backgroundColor: idx % 2 === 0 ? 'transparent' : 'var(--color-bg-tertiary)',
                            }}
                        >
                            {editingLog?.id === log.id ? (
                                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <span style={{ fontWeight: '600', minWidth: '80px' }}>{log.material}</span>
                                    <input
                                        type="number"
                                        value={editFormData.amount}
                                        onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })}
                                        style={{
                                            padding: '6px 8px',
                                            borderRadius: 'var(--radius-sm)',
                                            border: '1px solid var(--color-border)',
                                            fontSize: '0.875rem',
                                            width: '100px',
                                        }}
                                    />
                                    <input
                                        type="date"
                                        value={editFormData.date}
                                        onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                                        style={{
                                            padding: '6px 8px',
                                            borderRadius: 'var(--radius-sm)',
                                            border: '1px solid var(--color-border)',
                                            fontSize: '0.875rem',
                                        }}
                                    />
                                    <Button variant="primary" size="small" onClick={handleSaveEdit}>
                                        ✓ Save
                                    </Button>
                                    <Button variant="outline" size="small" onClick={handleCancelEdit}>
                                        ✕ Cancel
                                    </Button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
                                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
                                        <span style={{ fontWeight: '600', color: 'var(--color-text-primary)', minWidth: '80px' }}>
                                            {log.material}
                                        </span>
                                        <span style={{ fontWeight: '700', color: 'var(--color-success)', minWidth: '80px' }}>
                                            {formatNumber(log.amount)}
                                        </span>
                                        <span style={{ color: 'var(--color-text-tertiary)', fontSize: '0.875rem' }}>
                                            {formatDate(log.date)}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={() => handleEdit(log)}
                                            style={{
                                                padding: '4px 12px',
                                                backgroundColor: 'transparent',
                                                border: '1px solid var(--color-primary)',
                                                borderRadius: 'var(--radius-sm)',
                                                color: 'var(--color-primary)',
                                                fontSize: '0.75rem',
                                                cursor: 'pointer',
                                                fontWeight: '500',
                                            }}
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(log.id)}
                                            style={{
                                                padding: '4px 12px',
                                                backgroundColor: 'transparent',
                                                border: '1px solid var(--color-danger)',
                                                borderRadius: 'var(--radius-sm)',
                                                color: 'var(--color-danger)',
                                                fontSize: '0.75rem',
                                                cursor: 'pointer',
                                                fontWeight: '500',
                                            }}
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--spacing-lg)' }}>
                <Button variant="outline" onClick={onClose}>
                    Close
                </Button>
            </div>
        </Modal>
    );
};

export default MaterialQuoteTable;
