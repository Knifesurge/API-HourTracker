import { Card } from "@/shared/ui";
import { cn } from "@/shared/lib";

type MetricCardSize = "sm"
    | "md"
    | "lg"
    | "xl";

const sizes = {
    sm: `
        p-4
        min-h-[100px]
    `,
    md: `
        p-5
        min-h-[120px]
    `,
    lg: `
        p-6
        min-h-[160px]
    `,
    xl: `
        p-8
        min-h-[220px]
    `
} as const;

type MetricCardProps = {
    label: string;
    value: string;
    change?: string;
    size?: MetricCardSize;
}

const MetricCard = ({
    label,
    value,
    change,
    size = "md"
}: MetricCardProps) => {
    return (
        <div className="bg-surface rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-semibold mb-2">{label}</h2>
            <p className="text-3xl font-bold"></p>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    );
}

export {
    MetricCard
}