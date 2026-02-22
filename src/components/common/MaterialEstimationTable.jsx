import React, { useState, useEffect } from 'react';
import { subscribeMaterialLogs, deleteMaterialLog, updateMaterialLog, groupLogsByDate, calculateMaterialTotals, MATERIALS } from '../../services/materialService';
import Modal from './Modal';
import Button from './Button';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * MaterialEstimationTable Component
 * Simple black & white table with PDF export
 * Real-time sync with Firestore
 */
const MaterialEstimationTable = ({ isOpen, onClose, projectId, projectName, onUpdate }) => {
    const [logs, setLogs] = useState([]);
    const [logsByDate, setLogsByDate] = useState({});
    const [dates, setDates] = useState([]);
    const [totals, setTotals] = useState({});
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);
    const [markingPaid, setMarkingPaid] = useState(null); // logId being marked as paid

    // Real-time subscription
    useEffect(() => {
        if (!isOpen || !projectId) return;

        setLoading(true);

        // Subscribe to real-time updates
        const unsubscribe = subscribeMaterialLogs(projectId, (result) => {
            if (result.success) {
                setLogs(result.data);

                // Group by date
                const grouped = groupLogsByDate(result.data);
                setLogsByDate(grouped.logsByDate);
                setDates(grouped.dates);

                // Calculate totals
                const materialTotals = calculateMaterialTotals(result.data);
                setTotals(materialTotals);

                setLoading(false);
            } else {
                console.error('Error in real-time subscription:', result.error);
                setLoading(false);
            }
        });

        // Cleanup
        return () => {
            console.log('Unsubscribing from material logs (table)');
            unsubscribe();
        };
    }, [isOpen, projectId]);

    const handleDelete = async (logId) => {
        if (!window.confirm('Are you sure you want to delete this entry?')) {
            return;
        }

        setDeleting(logId);
        const result = await deleteMaterialLog(projectId, logId);

        if (result.success) {
            // Real-time listener will auto-update
            if (onUpdate) onUpdate();
        } else {
            alert(`Error: ${result.error}`);
        }

        setDeleting(null);
    };

    const handleMarkAsPaid = async (log) => {
        setMarkingPaid(log.id);
        const result = await updateMaterialLog(projectId, log.id, { paymentDone: true });
        if (!result.success) {
            alert(`Error marking as paid: ${result.error}`);
        }
        // Real-time listener auto-updates the UI
        setMarkingPaid(null);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
        });
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('en-IN').format(num || 0);
    };

    const calculateRowTotal = (material) => {
        return totals[material] || 0;
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
            total += totals[material] || 0;
        });
        return total;
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        // Brand Name
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 41, 59); // Dark Slate
        doc.text('CONSTRUCTAX', 14, 20);

        // Tagline
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(148, 163, 184); // Gray
        doc.text('A product from Lakshmi Constructions', 14, 26);

        // Report Title
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(245, 158, 11); // Construction Yellow/Orange
        doc.text('Material Estimation Report', 14, 38);

        // Project Info
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85); // Slate
        doc.text(`Project: ${projectName || 'Unnamed Project'}`, 14, 48);
        doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 14, 55);
        doc.text(`Total Entries: ${logs.length}`, 14, 62);

        // Prepare table data
        const tableHeaders = ['Material', ...dates.map(d => formatDate(d)), 'Total'];
        const tableData = MATERIALS.map(material => {
            const row = [material];
            dates.forEach(date => {
                const amount = logsByDate[date]?.[material] || 0;
                row.push(amount > 0 ? formatNumber(amount) : '—');
            });
            row.push(formatNumber(calculateRowTotal(material)));
            return row;
        });

        // Add totals row
        const totalsRow = ['Daily Total'];
        dates.forEach(date => {
            totalsRow.push(formatNumber(calculateColumnTotal(date)));
        });
        totalsRow.push(formatNumber(calculateGrandTotal()));
        tableData.push(totalsRow);

        // Generate table
        doc.autoTable({
            head: [tableHeaders],
            body: tableData,
            startY: 70,
            theme: 'grid',
            styles: {
                fontSize: 9,
                cellPadding: 3,
            },
            headStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                lineWidth: 0.5,
                lineColor: [0, 0, 0],
            },
            bodyStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                lineWidth: 0.5,
                lineColor: [0, 0, 0],
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245],
            },
            footStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
            },
        });

        // Grand Total Summary
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`Grand Total: ₹${formatNumber(calculateGrandTotal())}`, 14, finalY);

        // Save PDF
        const fileName = `${projectName || 'Project'}_Material_Estimation_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
    };

    if (loading) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} title="📊 Detailed Estimation" size="large">
                <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)', color: 'var(--color-text-secondary)' }}>
                    Loading estimation data...
                </div>
            </Modal>
        );
    }

    if (dates.length === 0) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} title="📊 Detailed Estimation" size="large">
                <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)', color: 'var(--color-text-tertiary)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>📋</div>
                    <p>No material logs yet</p>
                    <p style={{ fontSize: '0.875rem' }}>Start adding materials to see the estimation table</p>
                </div>
            </Modal>
        );
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="📊 Detailed Estimation"
            size="large"
        >
            {/* Summary Stats */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-lg)',
                padding: 'var(--spacing-md)',
                backgroundColor: '#f9f9f9',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #ddd',
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '4px' }}>
                        Total Days
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#000' }}>
                        {dates.length}
                    </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '4px' }}>
                        Total Entries
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#000' }}>
                        {logs.length}
                    </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '4px' }}>
                        Grand Total
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#000' }}>
                        ₹{formatNumber(calculateGrandTotal())}
                    </div>
                </div>
            </div>

            {/* PDF Download Button */}
            <div style={{ marginBottom: 'var(--spacing-lg)', textAlign: 'right' }}>
                <Button variant="primary" onClick={generatePDF}>
                    📄 Download PDF
                </Button>
            </div>

            {/* Simple Black & White Table */}
            <div style={{
                overflowX: 'auto',
                marginBottom: 'var(--spacing-lg)',
                border: '2px solid #000',
                borderRadius: 'var(--radius-md)',
            }}>
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '0.875rem',
                    backgroundColor: '#fff',
                }}>
                    <thead>
                        <tr style={{ backgroundColor: '#fff', borderBottom: '2px solid #000' }}>
                            <th style={{
                                padding: '12px',
                                textAlign: 'left',
                                fontWeight: '700',
                                color: '#000',
                                borderRight: '1px solid #000',
                                position: 'sticky',
                                left: 0,
                                backgroundColor: '#fff',
                                zIndex: 1,
                            }}>
                                Material
                            </th>
                            {dates.map(date => (
                                <th key={date} style={{
                                    padding: '12px',
                                    textAlign: 'right',
                                    fontWeight: '700',
                                    color: '#000',
                                    borderRight: '1px solid #ddd',
                                    minWidth: '80px',
                                }}>
                                    {formatDate(date)}
                                </th>
                            ))}
                            <th style={{
                                padding: '12px',
                                textAlign: 'right',
                                fontWeight: '700',
                                color: '#000',
                                backgroundColor: '#f0f0f0',
                            }}>
                                Total
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {MATERIALS.map((material, idx) => (
                            <tr key={material} style={{
                                borderBottom: '1px solid #ddd',
                                backgroundColor: idx % 2 === 0 ? '#fff' : '#f9f9f9',
                            }}>
                                <td style={{
                                    padding: '12px',
                                    fontWeight: '600',
                                    color: '#000',
                                    borderRight: '1px solid #000',
                                    position: 'sticky',
                                    left: 0,
                                    backgroundColor: idx % 2 === 0 ? '#fff' : '#f9f9f9',
                                }}>
                                    {material}
                                </td>
                                {dates.map(date => {
                                    const amount = logsByDate[date]?.[material] || 0;
                                    return (
                                        <td key={date} style={{
                                            padding: '12px',
                                            textAlign: 'right',
                                            color: amount > 0 ? '#000' : '#999',
                                            fontWeight: amount > 0 ? '500' : '400',
                                            borderRight: '1px solid #ddd',
                                        }}>
                                            {amount > 0 ? formatNumber(amount) : '—'}
                                        </td>
                                    );
                                })}
                                <td style={{
                                    padding: '12px',
                                    textAlign: 'right',
                                    fontWeight: '700',
                                    color: '#000',
                                    backgroundColor: '#f0f0f0',
                                }}>
                                    {formatNumber(calculateRowTotal(material))}
                                </td>
                            </tr>
                        ))}
                        {/* Daily Totals Row */}
                        <tr style={{
                            backgroundColor: '#f0f0f0',
                            fontWeight: '700',
                            borderTop: '2px solid #000',
                        }}>
                            <td style={{ padding: '12px', color: '#000', borderRight: '1px solid #000' }}>
                                Daily Total
                            </td>
                            {dates.map(date => (
                                <td key={date} style={{
                                    padding: '12px',
                                    textAlign: 'right',
                                    color: '#000',
                                    borderRight: '1px solid #ddd',
                                }}>
                                    {formatNumber(calculateColumnTotal(date))}
                                </td>
                            ))}
                            <td style={{
                                padding: '12px',
                                textAlign: 'right',
                                color: '#000',
                                fontSize: '1rem',
                                backgroundColor: '#e0e0e0',
                            }}>
                                ₹{formatNumber(calculateGrandTotal())}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Individual Logs with Delete */}
            <div>
                {/* Unpaid alert banner */}
                {logs.filter(l => l.paymentDone === false).length > 0 && (
                    <div style={{
                        marginBottom: 'var(--spacing-md)',
                        padding: '10px 14px',
                        backgroundColor: '#fff3e0',
                        border: '1px solid #ffb74d',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '8px',
                    }}>
                        <span style={{ fontWeight: '700', color: '#e65100', fontSize: '0.875rem' }}>
                            ⚠️ {logs.filter(l => l.paymentDone === false).length} Unpaid {logs.filter(l => l.paymentDone === false).length === 1 ? 'entry' : 'entries'} — Total Pending: ₹{formatNumber(logs.filter(l => l.paymentDone === false).reduce((sum, l) => sum + (l.amount || 0), 0))}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#bf360c' }}>
                            Click <strong>✓ Mark Paid</strong> on each entry below to clear
                        </span>
                    </div>
                )}
                <h3 style={{ marginBottom: 'var(--spacing-md)', fontSize: '1rem', color: '#000', fontWeight: '700' }}>
                    📝 Individual Entries ({logs.length})
                    {logs.filter(l => l.paymentDone === false).length > 0 && (
                        <span style={{
                            marginLeft: '8px',
                            fontSize: '0.72rem',
                            fontWeight: '700',
                            padding: '2px 8px',
                            backgroundColor: '#ffebee',
                            color: '#c62828',
                            borderRadius: '999px',
                            border: '1px solid #ef9a9a',
                        }}>
                            {logs.filter(l => l.paymentDone === false).length} Unpaid
                        </span>
                    )}
                </h3>
                <div style={{
                    maxHeight: '300px',
                    overflowY: 'auto',
                    border: '1px solid #ddd',
                    borderRadius: 'var(--radius-md)',
                }}>
                    {logs.map((log, idx) => (
                        <div
                            key={log.id}
                            style={{
                                padding: 'var(--spacing-md)',
                                borderBottom: idx < logs.length - 1 ? '1px solid #ddd' : 'none',
                                backgroundColor: idx % 2 === 0 ? '#fff' : '#f9f9f9',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: 'var(--spacing-sm)',
                            }}
                        >
                            <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center', flex: 1, flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: '600', color: '#000', minWidth: '70px' }}>
                                    {log.material}
                                </span>
                                <span style={{ fontWeight: '700', color: '#000', minWidth: '80px' }}>
                                    ₹{formatNumber(log.amount)}
                                </span>
                                {log.quantity ? (
                                    <span style={{ fontSize: '0.75rem', color: '#555', fontStyle: 'italic' }}>
                                        📦 {log.quantity}
                                    </span>
                                ) : null}
                                <span style={{ color: '#666', fontSize: '0.875rem' }}>
                                    {new Date(log.date).toLocaleDateString('en-IN')}
                                </span>
                                <span style={{
                                    fontSize: '0.7rem',
                                    padding: '2px 8px',
                                    backgroundColor:
                                        log.paymentMethod === 'Cash' ? '#e3f2fd' :
                                            log.paymentMethod === 'PhonePe' ? '#f3e5f5' : '#fff3e0',
                                    color:
                                        log.paymentMethod === 'Cash' ? '#1976d2' :
                                            log.paymentMethod === 'PhonePe' ? '#7b1fa2' : '#e65100',
                                    borderRadius: 'var(--radius-sm)',
                                    fontWeight: '600',
                                }}>
                                    {log.paymentMethod || 'Cash'}
                                </span>
                                <span style={{
                                    fontSize: '0.7rem',
                                    padding: '2px 8px',
                                    backgroundColor: log.paymentDone === false ? '#ffebee' : '#e8f5e9',
                                    color: log.paymentDone === false ? '#c62828' : '#2e7d32',
                                    borderRadius: 'var(--radius-sm)',
                                    fontWeight: '700',
                                    border: `1px solid ${log.paymentDone === false ? '#ef9a9a' : '#a5d6a7'}`,
                                }}>
                                    {log.paymentDone === false ? '✗ Unpaid' : '✓ Paid'}
                                </span>
                            </div>
                            {/* Action buttons */}
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                {/* Mark as Paid — only shown for unpaid entries */}
                                {log.paymentDone === false && (
                                    <button
                                        onClick={() => handleMarkAsPaid(log)}
                                        disabled={markingPaid === log.id}
                                        title="Mark this payment as done"
                                        style={{
                                            padding: '6px 10px',
                                            backgroundColor: markingPaid === log.id ? '#ccc' : '#e8f5e9',
                                            border: '1px solid #2e7d32',
                                            borderRadius: 'var(--radius-sm)',
                                            color: '#2e7d32',
                                            fontSize: '0.72rem',
                                            cursor: markingPaid === log.id ? 'not-allowed' : 'pointer',
                                            fontWeight: '700',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {markingPaid === log.id ? '⏳ Saving...' : '✓ Mark Paid'}
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(log.id)}
                                    disabled={deleting === log.id}
                                    style={{
                                        padding: '6px 12px',
                                        backgroundColor: deleting === log.id ? '#ccc' : 'transparent',
                                        border: '1px solid #d32f2f',
                                        borderRadius: 'var(--radius-sm)',
                                        color: '#d32f2f',
                                        fontSize: '0.75rem',
                                        cursor: deleting === log.id ? 'not-allowed' : 'pointer',
                                        fontWeight: '600',
                                    }}
                                >
                                    {deleting === log.id ? 'Deleting...' : '❌ Delete'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--spacing-lg)', gap: 'var(--spacing-md)' }}>
                <Button variant="outline" onClick={onClose}>
                    Close
                </Button>
            </div>
        </Modal>
    );
};

export default MaterialEstimationTable;
