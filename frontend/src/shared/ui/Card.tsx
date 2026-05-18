import { cn } from "../lib";
import type { HTMLAttributes, ReactNode } from "react";

/**
 * Variants
 */

const variants = {
    default: `
        bg-surface
        border
        border-border
        text-primary
    `,
    outlined: `
        bg-transparent
        border
        border-border
        text-primary
    `,

    elevated: `
        bg-surface-elevated
        border
        border-border
        shadow-card
        text-primary
    `,

    interactive: `
        bg-surface
        border
        border-border
        hover:bg-surface-hover
        hover:border-border-strong
        hover:-translate-y-0.5
        cursor-pointer
        transition-all
        duration-200
        text-primary
    `
} as const;

type CardVariant = keyof typeof variants;

/**
 * Sizes
 */

const sizes = {
    sm: `
        p-4
        rounded-xl
        gap-3
    `,
    md: `
        p-5
        rounded-2xl
        gap-4
    `,
    lg: `
        p-6
        rounded-2xl
        gap-5
    `,

    xl: `
        p-8
        rounded-2xl
        gap-6
    `
} as const;

type CardSize = keyof typeof sizes;

/**
 * Card
 */

export type CardProps = {
    variant?: CardVariant;
    size?: CardSize;
    children?: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

const Card = ({
    variant = "default",
    size = "md",
    className,
    children,
    ...props
}: CardProps) => {
    const base = `
        flex
        flex-col
        transition-colors
        duration-200
    `;

    return (
        <div
            className={cn(
                base,
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

/**
 * Header
 */

type SlotProps = {
    children?: ReactNode;
    className?: string;
};

const CardHeader = ({
    children,
    className
}: SlotProps) => {
    return (
        <div className={cn(
            `
            flex
            items-start
            justify-between
            gap-4
            `,
            className
        )}
    >
        {children}
    </div>
    );
};

/**
 * Title
 */

const CardTitle = ({
    children,
    className
}: SlotProps) => {
    return (
        <h3
            className={cn(
                `
                text-lg
                font-semibold
                tracking-tight
                text-primary
                `,
                className
            )}
        >
            {children}
        </h3>
    );
};

/**
 * Description
 */

const CardDescription = ({
    children,
    className
}: SlotProps) => {
    return (
        <p
            className={cn(
                `
                text-sm
                text-muted
                `,
                className
            )}
        >
            {children}
        </p>
    );
};

/**
 * Content
 */

const CardContent = ({
    children,
    className
}: SlotProps) => {
    return (
        <div
            className={cn(
                `
                flex-1
                text-sm
                text-secondary
                `,
                className
            )}
        >
            {children}
        </div>
    );
};

/**
 * Footer
 */

const CardFooter = ({
    children,
    className
}: SlotProps) => {
    return (
        <div
            className={cn(
                `
                flex
                items-center
                justify-end
                gap-2
                pt-4
                border-t
                border-border
                `,
                className
            )}
        >
            {children}
        </div>
    );
};

/**
 * Compound Components
 */

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export {
    Card
};