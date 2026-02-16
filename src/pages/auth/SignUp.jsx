import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../../components/common/Logo';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import styles from './SignUp.module.css';

/**
 * Sign Up Page
 * User registration page integrated with Firebase
 */
const SignUp = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();

    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
        setError('');

        // Validation
        if (!formData.email || !formData.password || !formData.displayName) {
            setError('Please fill in all required fields');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const result = await signup(formData.email, formData.password, formData.displayName);

            if (result.success) {
                alert('🚀 Account created successfully! Welcome aboard.');
                navigate('/');
            } else {
                setError(result.error || 'Registration failed. Please try again.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            console.error('Signup error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles['signup-page']}>
            <div className={styles['signup-container']}>
                <div className={styles['signup-header']}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--spacing-md)' }}>
                        <Logo size="large" showText={false} />
                    </div>
                    <h1 className={styles['signup-title']}>Join ConstructaX</h1>
                    <p className={styles['signup-subtitle']}>
                        Create an account to start managing your projects
                    </p>
                </div>

                <form onSubmit={handleSubmit} className={styles['signup-form']}>
                    {error && (
                        <div className={styles['signup-error']}>
                            {error}
                        </div>
                    )}

                    <Input
                        label="Full Name"
                        type="text"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleChange}
                        placeholder="e.g. John Contractor"
                        required
                        disabled={loading}
                    />

                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                        disabled={loading}
                    />

                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Min. 6 characters"
                        required
                        disabled={loading}
                    />

                    <Input
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Repeat your password"
                        required
                        disabled={loading}
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        size="large"
                        fullWidth
                        loading={loading}
                        style={{ marginTop: 'var(--spacing-md)' }}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </Button>

                    <div className={styles['signup-footer']}>
                        Already have an account?
                        <Link to="/login" className={styles['signup-link']}>Sign In</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
