import React, { useState, useEffect } from 'react';
import { subscribeMaterialLogs, addMaterialLog, calculateMaterialTotals, MATERIALS, PAYMENT_METHODS } from '../../services/materialService';

/**
 * MaterialImageStrip Component - ICON STYLE VERSION
 * Rounded icon-style images with cartoon/flat illustration look
 * Ultra-clean, modern, contractor-friendly design
 */
const MaterialImageStrip = ({ projectId, onUpdate }) => {
    const [totals, setTotals] = useState({
        Sand: 0,
        Cement: 0,
        Labour: 0,
        Metal: 0,
        Iron: 0,
    });
    const [loading, setLoading] = useState(true);
    const [activeInput, setActiveInput] = useState(null);
    const [formData, setFormData] = useState({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Cash',
    });
    const [saving, setSaving] = useState(false);

    // Icon-style material images - cartoon/flat illustration look
    // Using circular/rounded style with high clarity
    const materialIcons = {
        Sand: 'https://5.imimg.com/data5/SELLER/Default/2024/10/456296423/RM/FG/VS/233293184/building-construction-sand.jpg',
        Cement: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS01cUr_hVe57PMiBvqDbsvxSUYIx2JE9z7_w&s',
        Labour: 'https://png.pngtree.com/png-vector/20250926/ourlarge/pngtree-cartoon-construction-worker-pushing-wheelbarrow-with-cement-bags-isolated-png-image_17604988.webp',
        Metal: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSY_WK7d58oxHTuNt1qCFbntrRu60GHUr8d1w&s',
        Iron: 'https://www.shutterstock.com/image-photo/construction-steel-reinforcement-bars-sitedeformed-600nw-2471328793.jpg',
    };

    // Material emoji icons for visual clarity
    const materialEmojis = {
        Sand: '🏖️',
        Cement: '🏗️',
        Labour: '👷',
        Metal: '⚙️',
        Iron: '🔩',
    };

    // Real-time subscription
    useEffect(() => {
        if (!projectId) return;

        setLoading(true);

        const unsubscribe = subscribeMaterialLogs(projectId, (result) => {
            if (result.success) {
                const newTotals = calculateMaterialTotals(result.data);
                setTotals(newTotals);
                setLoading(false);
            } else {
                console.error('Error in real-time subscription:', result.error);
                setLoading(false);
            }
        });

        return () => {
            console.log('Unsubscribing from material logs');
            unsubscribe();
        };
    }, [projectId]);

    const handleAddClick = (material) => {
        setActiveInput(material);
        setFormData({
            amount: '',
            date: new Date().toISOString().split('T')[0],
            paymentMethod: 'Cash',
        });
    };

    const handleCancel = () => {
        setActiveInput(null);
        setFormData({
            amount: '',
            date: new Date().toISOString().split('T')[0],
            paymentMethod: 'Cash',
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
            date: formData.date,
            paymentMethod: formData.paymentMethod,
        });

        if (result.success) {
            if (onUpdate) onUpdate();
            handleCancel();
        } else {
            alert(`Error: ${result.error}`);
        }

        setSaving(false);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount || 0);
    };

    if (loading) {
        return (
            <div style={{
                padding: 'var(--spacing-xl)',
                textAlign: 'center',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--spacing-xl)',
            }}>
                Loading materials...
            </div>
        );
    }

    return (
        <div style={{
            marginBottom: 'var(--spacing-2xl)',
        }}>
            {/* Title */}
            <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-lg)',
            }}>
                📊 Material Tracking
            </h2>

            {/* Responsive Grid - Icon Style */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: 'var(--spacing-md)',
                maxWidth: '100%',
                justifyItems: 'center',
            }}>
                {MATERIALS.map((material) => (
                    <div
                        key={material}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 'var(--spacing-sm)',
                        }}
                    >
                        {/* Rounded Icon-Style Image */}
                        <div style={{
                            position: 'relative',
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            cursor: activeInput === material ? 'default' : 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                            border: '3px solid #f0f0f0',
                        }}
                            onMouseEnter={(e) => {
                                if (activeInput !== material) {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.12)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                            }}
                            onClick={() => {
                                if (activeInput !== material) {
                                    handleAddClick(material);
                                }
                            }}
                        >
                            <img
                                src={materialIcons[material]}
                                alt={material}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block',
                                }}
                            />
                            {/* Emoji Overlay for Extra Clarity */}
                            <div style={{
                                position: 'absolute',
                                bottom: '-5px',
                                right: '-5px',
                                width: '40px',
                                height: '40px',
                                backgroundColor: 'white',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                            }}>
                                {materialEmojis[material]}
                            </div>
                        </div>

                        {/* Material Name */}
                        <div style={{
                            fontSize: '1rem',
                            fontWeight: '600',
                            color: 'var(--color-text-primary)',
                            textAlign: 'center',
                        }}>
                            {material}
                        </div>

                        {/* Total Amount */}
                        <div style={{
                            fontSize: '1.125rem',
                            fontWeight: '700',
                            color: 'var(--color-success)',
                            textAlign: 'center',
                        }}>
                            {formatCurrency(totals[material])}
                        </div>

                        {/* Add Form or Button */}
                        {activeInput === material ? (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                width: '100%',
                                maxWidth: '220px',
                                padding: 'var(--spacing-md)',
                                backgroundColor: '#0f172a',
                                borderRadius: '12px',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                                border: '1px solid #334155',
                            }}>
                                {/* Amount Input */}
                                <input
                                    type="number"
                                    placeholder="Amount (₹)"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    style={{
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '2px solid #334155',
                                        backgroundColor: '#020617',
                                        color: '#ffffff',
                                        fontSize: '0.875rem',
                                        width: '100%',
                                        outline: 'none',
                                        transition: 'border-color 0.2s',
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                                    onBlur={(e) => e.target.style.borderColor = '#334155'}
                                    disabled={saving}
                                    autoFocus
                                />

                                {/* Date Input */}
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    style={{
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '2px solid #334155',
                                        backgroundColor: '#020617',
                                        color: '#ffffff',
                                        fontSize: '0.875rem',
                                        width: '100%',
                                        outline: 'none',
                                        colorScheme: 'dark',
                                    }}
                                    disabled={saving}
                                />

                                {/* Payment Method */}
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px',
                                    padding: '8px 0',
                                }}>
                                    <div style={{
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        color: '#94a3b8',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                    }}>
                                        Payment Method
                                    </div>
                                    {PAYMENT_METHODS.map(method => (
                                        <label key={method} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            cursor: 'pointer',
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            backgroundColor: formData.paymentMethod === method ? '#1e3a8a' : 'transparent',
                                            border: `2px solid ${formData.paymentMethod === method ? '#2563eb' : '#334155'}`,
                                            transition: 'all 0.2s',
                                        }}
                                            onMouseEnter={(e) => {
                                                if (formData.paymentMethod !== method) {
                                                    e.currentTarget.style.borderColor = '#475569';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (formData.paymentMethod !== method) {
                                                    e.currentTarget.style.borderColor = '#334155';
                                                }
                                            }}
                                        >
                                            <input
                                                type="radio"
                                                name={`payment-${material}`}
                                                value={method}
                                                checked={formData.paymentMethod === method}
                                                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                                disabled={saving}
                                                style={{
                                                    accentColor: '#2563eb',
                                                    width: '16px',
                                                    height: '16px',
                                                }}
                                            />
                                            <span style={{
                                                fontSize: '0.875rem',
                                                fontWeight: '600',
                                                color: '#ffffff',
                                            }}>
                                                {method}
                                            </span>
                                        </label>
                                    ))}
                                </div>

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                    <button
                                        onClick={() => handleSave(material)}
                                        disabled={saving}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            fontWeight: '700',
                                            cursor: saving ? 'not-allowed' : 'pointer',
                                            opacity: saving ? 0.6 : 1,
                                            transition: 'all 0.2s',
                                            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!saving) {
                                                e.currentTarget.style.transform = 'translateY(-1px)';
                                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.4)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!saving) {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(37, 99, 235, 0.3)';
                                            }
                                        }}
                                    >
                                        {saving ? 'SAVING...' : 'SAVE'}
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        disabled={saving}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            backgroundColor: 'transparent',
                                            color: '#94a3b8',
                                            border: '2px solid #334155',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            fontWeight: '700',
                                            cursor: saving ? 'not-allowed' : 'pointer',
                                            transition: 'all 0.2s',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!saving) {
                                                e.currentTarget.style.borderColor = '#475569';
                                                e.currentTarget.style.color = '#ffffff';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!saving) {
                                                e.currentTarget.style.borderColor = '#334155';
                                                e.currentTarget.style.color = '#94a3b8';
                                            }
                                        }}
                                    >
                                        CANCEL
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => handleAddClick(material)}
                                style={{
                                    padding: '8px 14px',
                                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '999px',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 3px 8px rgba(0, 0, 0, 0.25)',
                                    letterSpacing: '0.5px',
                                    minWidth: '80px',
                                    textTransform: 'uppercase',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 5px 12px rgba(37, 99, 235, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 3px 8px rgba(0, 0, 0, 0.25)';
                                }}
                            >
                                ADD
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MaterialImageStrip;
