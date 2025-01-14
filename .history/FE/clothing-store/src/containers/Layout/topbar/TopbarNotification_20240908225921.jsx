import { useState } from "react";
import { Collapse } from "react-bootstrap";
import NotificationsIcon from "mdi-react/NotificationsIcon";
import { TopbarBack, TopbarButton } from "./BasicTopbarComponents";
import {
    TopbarCollapse,
    TopbarCollapseButton,
    TopbarCollapseContent,
    TopbarCollapseDate,
    TopbarCollapseImageWrap,
    TopbarCollapseItem,
    TopbarCollapseLink,
    TopbarCollapseMessage,
    TopbarCollapseName,
    TopbarCollapseTitle,
    TopbarCollapseTitleWrap,
} from "./CollapseTopbarComponents";

const notifications = [
    {
        id: 0,
        ava: `/img/topbar/ava.png`,
        name: "Cristopher Changer",
        message: " has started a new project",
        date: "09:02",
    },
    {
        id: 1,
        ava: `/img/topbar/ava2.png`,
        name: "Sveta Narry",
        message: " has closed a project",
        date: "09:00",
    },
    {
        id: 2,
        ava: `/img/topbar/ava3.png`,
        name: "Lory McQueen",
        message: " has started a new project as a Project Managert",
        date: "08:43",
    },
    {
        id: 3,
        ava: `/img/topbar/ava2.png`,
        name: "Cristopher Changer",
        message: " has closed a project",
        date: "08:43",
    },
];

const TopbarNotification = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const collapseNotification = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <TopbarCollapse>
            {/*//* Icon/Button  */}
            <TopbarButton type="button" onClick={collapseNotification}>
                <NotificationsIcon />
            </TopbarButton>

            {/*//* Layer */}

            {isCollapsed && (
                <TopbarBack
                    aria-label="topbar__back"
                    type="button"
                    onClick={collapseNotification}
                />
            )}

            {/*//* Collapse  */}
            <Collapse in={isCollapsed}>
                <TopbarCollapseContent>
                    {/*//* Title  */}
                    <TopbarCollapseTitleWrap>
                        <TopbarCollapseTitle>Notifications</TopbarCollapseTitle>
                        <TopbarCollapseButton type="button">
                            Mark all as read
                        </TopbarCollapseButton>
                    </TopbarCollapseTitleWrap>

                    {/*//* Map  */}
                    {notifications.map((notification) => (
                        <TopbarCollapseItem key={notification.id}>
                            <TopbarCollapseImageWrap>
                                <img src={notification.ava} alt="" />
                            </TopbarCollapseImageWrap>
                            <TopbarCollapseMessage>
                                <TopbarCollapseName>
                                    {notification.name}
                                </TopbarCollapseName>
                                {notification.message}
                            </TopbarCollapseMessage>
                            <TopbarCollapseDate>
                                {notification.date}
                            </TopbarCollapseDate>
                        </TopbarCollapseItem>
                    ))}

                    {/*//* See all  */}
                    <TopbarCollapseLink
                        to="/online_marketing_dashboard"
                        onClick={collapseNotification}
                    >
                        See all notifications
                    </TopbarCollapseLink>
                </TopbarCollapseContent>
            </Collapse>
        </TopbarCollapse>
    );
};

export default TopbarNotification;
