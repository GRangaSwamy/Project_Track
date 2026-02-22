import React, { useState, useEffect } from 'react';
import { getMaterialTotals, addMaterialLog, MATERIALS, PAYMENT_METHODS } from '../../services/materialService';
import Card from './Card';
import Button from './Button';

/**
 * MaterialTrackingPanel Component
 * Displays material cards with totals and inline add functionality
 */
const MaterialTrackingPanel = ({ projectId, onUpdate }) => {
    const [totals, setTotals] = useState({
        Sand: 0,
        Cement: 0,
        Labour: 0,
        Metal: 0,
        Iron: 0,
    });
    const [loading, setLoading] = useState(true);
    const [activeInput, setActiveInput] = useState(null); // Which material is being added
    const [formData, setFormData] = useState({
        amount: '',
        quantity: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Cash',
        paymentDone: true,
    });
    const [saving, setSaving] = useState(false);

    // Material icons mapping
    const materialIcons = {
        Sand: '🏖️',
        Cement: '🏗️',
        Labour: '👷',
        Metal: '⚙️',
        Iron: '🔩',
    };

    useEffect(() => {
        if (projectId) {
            fetchTotals();
        }
    }, [projectId]);

    const fetchTotals = async () => {
        setLoading(true);
        const result = await getMaterialTotals(projectId);
        if (result.success) {
            setTotals(result.data);
        }
        setLoading(false);
    };

    const handleAddClick = (material) => {
        setActiveInput(material);
        setFormData({
            amount: '',
            quantity: '',
            date: new Date().toISOString().split('T')[0],
            paymentMethod: 'Cash',
            paymentDone: true,
        });
    };

    const handleCancel = () => {
        setActiveInput(null);
        setFormData({
            amount: '',
            quantity: '',
            date: new Date().toISOString().split('T')[0],
            paymentMethod: 'Cash',
            paymentDone: true,
        });
    };

    const handleSave = async (material) => {
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        setSaving(true);

        const result = await addMaterialLog(projectId, {
            material,
            amount: parseFloat(formData.amount),
            quantity: formData.quantity,
            date: formData.date,
            paymentMethod: formData.paymentMethod,
            paymentDone: formData.paymentDone,
        });

        if (result.success) {
            // Update totals
            await fetchTotals();
            // Notify parent
            if (onUpdate) onUpdate();
            // Reset form
            handleCancel();
        } else {
            alert(`Error: ${result.error}`);
        }

        setSaving(false);
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('en-IN').format(num || 0);
    };

    const inputStyle = {
        padding: '6px 8px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--color-border)',
        fontSize: '0.8rem',
        width: '100%',
        backgroundColor: 'var(--color-bg-primary)',
        color: 'var(--color-text-primary)',
        boxSizing: 'border-box',
    };


    if (loading) {
        return (
            <Card>
                <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-secondary)' }}>
                    Loading material data...
                </div>
            </Card>
        );
    }

    return (
        <Card title="📊 Material Tracking">
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 'var(--spacing-md)',
            }}>
                {MATERIALS.map((material) => (
                    <div
                        key={material}
                        style={{
                            padding: 'var(--spacing-md)',
                            backgroundColor: 'var(--color-bg-tertiary)',
                            borderRadius: 'var(--radius-md)',
                            border: '2px solid transparent',
                            transition: 'all var(--transition-fast)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'transparent';
                        }}
                    >
                        {/* Material Header */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginBottom: 'var(--spacing-sm)',
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '4px' }}>
                                {materialIcons[material]}
                            </div>
                            <div style={{
                                fontWeight: '600',
                                color: 'var(--color-text-primary)',
                                fontSize: '0.875rem',
                            }}>
                                {material}
                            </div>
                        </div>

                        {/* Total Amount */}
                        <div style={{
                            textAlign: 'center',
                            marginBottom: 'var(--spacing-sm)',
                        }}>
                            <div style={{
                                fontSize: '0.75rem',
                                color: 'var(--color-text-tertiary)',
                                marginBottom: '2px',
                            }}>
                                Total
                            </div>
                            <div style={{
                                fontSize: '1.25rem',
                                fontWeight: '700',
                                color: 'var(--color-success)',
                            }}>
                                {formatNumber(totals[material])}
                            </div>
                        </div>

                        {/* Add Button or Input Form */}
                        {activeInput === material ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {/* Amount */}
                                <input
                                    type="number"
                                    placeholder="Amount (₹)"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    style={inputStyle}
                                    disabled={saving}
                                    autoFocus
                                />
                                {/* Quantity */}
                                <input
                                    type="text"
                                    placeholder="Quantity (e.g. 5 bags, 2 tons)"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    style={inputStyle}
                                    disabled={saving}
                                />
                                {/* Date */}
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    style={inputStyle}
                                    disabled={saving}
                                />
                                {/* Payment Method */}
                                <select
                                    value={formData.paymentMethod}
                                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                    style={inputStyle}
                                    disabled={saving}
                                >
                                    {PAYMENT_METHODS.map(pm => (
                                        <option key={pm} value={pm}>{pm}</option>
                                    ))}
                                </select>
                                {/* Payment Done radio */}
                                <div style={{
                                    backgroundColor: 'var(--color-bg-secondary)',
                                    borderRadius: 'var(--radius-sm)',
                                    padding: '6px 8px',
                                    border: '1px solid var(--color-border)',
                                }}>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-tertiary)', marginBottom: '4px', fontWeight: '600' }}>
                                        PAYMENT STATUS
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name={`paymentDone-${material}`}
                                                checked={formData.paymentDone === true}
                                                onChange={() => setFormData({ ...formData, paymentDone: true })}
                                                disabled={saving}
                                            />
                                            <span style={{ color: '#16a34a', fontWeight: '600' }}>✓ Paid</span>
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name={`paymentDone-${material}`}
                                                checked={formData.paymentDone === false}
                                                onChange={() => setFormData({ ...formData, paymentDone: false })}
                                                disabled={saving}
                                            />
                                            <span style={{ color: '#dc2626', fontWeight: '600' }}>✗ Unpaid</span>
                                        </label>
                                    </div>
                                </div>
                                {/* Save / Cancel */}
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    <button
                                        onClick={() => handleSave(material)}
                                        disabled={saving}
                                        style={{
                                            flex: 1, padding: '6px',
                                            backgroundColor: 'var(--color-success)', color: 'white',
                                            border: 'none', borderRadius: 'var(--radius-sm)',
                                            fontSize: '0.75rem', fontWeight: '500',
                                            cursor: saving ? 'not-allowed' : 'pointer',
                                            opacity: saving ? 0.6 : 1,
                                        }}
                                    >
                                        {saving ? '...' : '✓ Save'}
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        disabled={saving}
                                        style={{
                                            flex: 1, padding: '6px',
                                            backgroundColor: 'var(--color-bg-secondary)',
                                            color: 'var(--color-text-secondary)',
                                            border: '1px solid var(--color-border)',
                                            borderRadius: 'var(--radius-sm)',
                                            fontSize: '0.75rem', fontWeight: '500',
                                            cursor: saving ? 'not-allowed' : 'pointer',
                                        }}
                                    >
                                        ✕ Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Button
                                variant="outline"
                                size="small"
                                onClick={() => handleAddClick(material)}
                                style={{
                                    width: '100%',
                                    fontSize: '0.75rem',
                                    padding: '6px',
                                }}
                            >
                                ➕ Add
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default MaterialTrackingPanel;
