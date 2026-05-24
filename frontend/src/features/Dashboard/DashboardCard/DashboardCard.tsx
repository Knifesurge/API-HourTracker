import { DashboardCardContent } from "./DashboardCardContent";
import { DashboardCardFooter } from "./DashboardCardFooter";
import { DashboardCardTitle } from "./DashboardCardTitle";

const Dashboard = () => {
    return (
        <div>
            <DashboardCardTitle
                title="Dashboard Title from component"
            />
            <hr />
            <DashboardCardContent 
                content="Dashboard content goes here from component"
            />
            <hr />
            <DashboardCardFooter
                content="Dashboard Footer from component"
            />
        </div>
    );
}

export {
    Dashboard
}