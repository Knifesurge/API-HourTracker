
type DashboardCardContentProps = {
    content: string;
};

const DashboardCardContent = ({
    content
}: DashboardCardContentProps) => {
    return (
        <p>{content}</p>
    )
}

export {
    DashboardCardContent
}