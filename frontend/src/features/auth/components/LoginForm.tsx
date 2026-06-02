import React, { useState } from 'react';
import { useAuth } from "../hooks/useAuth";

const inputDivStyle = `
    flex
    flex-col
    gap-1.5
`;

const inputLabelStyle = `
    text-xs
    font-semibold
    text-secondary
    uppercase
    tracking-wider
`;

const inputFieldStyle = `
    w-full
    px-4
    py-2.5
    rounded-lg
    bg-input
    border
    border-input-border
    text-sm
    text-primary
    focus:outline-none
    focus:border-accent
    focus:ring-1
    focus:ring-accent
    transition-all
    disabled:opacity-50
`;

const inputButtonStyle = `
    w-full
    mt-2
    font-semibold
    text-sm
    py-2.5
    px-4
    rounded-xl
    bg-accent
    text-accent-foreground
    hover:bg-accent-hover
    active:scale-[0.99]
    transition-all
    disabled:opacity-50
    cursor-pointer
    text-center
    shadow-subtle
`;

const modeToggleDivStyle = `
    mt-6
    text-center
    text-xs
    border-t
    border-border
    pt-4
`;

const modeToggleButtonStyle = `
    text-secondary
    hover:text-accent
    font-medium
    transition-colors
    cursor-pointer
`;

const LoginForm: React.FC = () => {
    const { login, register, error, clearError } = useAuth();

    // Toggle states
    const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Form input fields
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [localError, setLocalError] = useState<string | null>(null);

    const toggleMode = () => {
        setIsRegisterMode(() => !isRegisterMode);
        setLocalError(null);
        clearError();   // Clear any historic server errors
        setPassword("");
    };

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setLocalError(null);

        // 1. Basic validation pre-flight guards
        if (!email.trim() || !password.trim()) {
            setLocalError("Please fill out all mandatory fields.");
            return;
        }

        if (isRegisterMode && !name.trim()) {
            setLocalError("Name is required.");
            return;
        }

        setIsLoading(true);

        try {
            if (isRegisterMode) {
                // Trigger register + login hooks
                await register(email, password, name);
            } else {
                await login(email, password);
            }
            // Success automatically flips state inside App.tsx
        } catch (err: any) {
            // Axios interceptors catch errors
            console.error("Authentication exception triggered: ", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-primary flex items-center justify-center p-4 select-none">
            <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-card p-8 transition-all duration-300">

                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold tracking-tight text-primary">
                        {isRegisterMode ? "Create an account" : "Welcome Back"}
                    </h2>
                    <p className="text-sm text-secondary mt-2">
                        {isRegisterMode
                            ? "Sign up to start tracking your productivity hours."
                            : "Enter your login details to access your dashboard."
                        }
                    </p>
                </div>

                {/* Error boundaries summary */}
                {(localError || error) && (
                    <div className="mb-5 p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-xs font-medium">
                        {localError || error}
                    </div>
                )}

                {/* Input submission form */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Name field (Register mode only) */}
                    {isRegisterMode && (
                        <div className={inputDivStyle}>
                            <label className={inputLabelStyle}>
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Full Name"
                                disabled={isLoading}
                                className={inputFieldStyle}
                            />
                        </div>
                    )}

                    {/* Email field */}
                    <div className={inputDivStyle}>
                        <label className={inputLabelStyle}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="dev@hourtracker.com"
                            disabled={isLoading}
                            className={inputFieldStyle}
                        />
                    </div>

                    {/* Password field */}
                    <div className={inputDivStyle}>
                        <label className={inputLabelStyle}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="********"
                            disabled={isLoading}
                            className={inputFieldStyle}
                        />
                    </div>

                    {/* Submit interaction button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={inputButtonStyle}
                    >
                        {isLoading
                            ? (isRegisterMode ? "Registering account..." : "Signing in...")
                            : (isRegisterMode ? "Sign Up" : "Sign In")
                        }
                    </button>
                </form>

                {/* Mode toggle link footer */}
                <div className={modeToggleDivStyle}>
                    <button
                        type="button"
                        disabled={isLoading}
                        onClick={toggleMode}
                        className={modeToggleButtonStyle}
                    >
                        {isRegisterMode
                            ? "Already have an account? Sign in here"
                            : "Don't have an account yet? Register here"
                        }
                    </button>
                </div>
            </div >
        </div >
    )
}

export {
    LoginForm
}