import { Card } from "@/shared/ui";
import { cn } from "@/shared/lib";

type MetricCardSize = "sm"
    | "md"
    | "lg"
    | "xl";

const sizes = {
    sm: `
        min-h-[100px]
    `,
    md: `
        min-h-[120px]
    `,
    lg: `
        min-h-[160px]
    `,
    xl: `
        min-h-[220px]
    `
} as const;

const valueSizes = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl",
    xl: "text-5xl"
} as const;

const iconSizes = {
    sm: "size-4",
    md: "size-5",
    lg: "size-6",
    xl: "size-7"
} as const;

type MetricCardProps = {
    label: string;
    value: string;
    change?: string;
    size?: MetricCardSize;
    icon?: React.ReactNode;
}

const MetricCard = ({
    label,
    value,
    change,
    icon,
    size = "md"
}: MetricCardProps) => {
    return (
        <Card
            variant="default"
            size={size}
            className={sizes[size]}
        >
            <Card.Header>
                <div className="space-y-1">
                    <Card.Description>
                        {label}
                    </Card.Description>

                    <Card.Title
                        className={cn(
                            "font-semibold tracking-tight",
                            valueSizes[size]
                        )}
                    >
                        {value}
                    </Card.Title>
                </div>

                {icon && (
                    <div
                        className={cn(
                            `
                            flex
                            items-center
                            justify-center
                            text-muted
                            `,
                            iconSizes[size]
                        )}
                    >
                        {icon}
                    </div>
                )}
            </Card.Header>

            {change && (
                <Card.Footer>
                    <div
                        className={cn(
                            "text-sm font-medium",
                            change.startsWith("+")
                                ? "text-success"
                                : "text-danger"
                        )}
                    >
                        {change}
                    </div>
                </Card.Footer>
            )}
        </Card>
    );
}

export {
    MetricCard
}