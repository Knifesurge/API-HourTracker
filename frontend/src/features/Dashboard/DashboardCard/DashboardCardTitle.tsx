
type DashboardCardTitleProps = {
    title: string;
};

const DashboardCardTitle = ({
    title
}:
DashboardCardTitleProps
) => {
    return (
        <h1>{title}</h1>
    )
}

export {
    DashboardCardTitle
}