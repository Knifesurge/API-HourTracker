
type DashboardCardFooterProps = {
    content: string;
};

const DashboardCardFooter = ({
    content
}: DashboardCardFooterProps) => {
    return (
        <footer>{content}</footer>
    )
}

export {
    DashboardCardFooter
}