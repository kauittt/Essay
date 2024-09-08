import React from "react";
import PropTypes from "prop-types";
import TopbarSidebarButton from "./TopbarSidebarButton";
import TopbarProfile from "./TopbarProfile";
import {
    TopbarContainer,
    TopbarLeft,
    TopbarLogo,
    TopbarRight,
    TopbarSearchWrap,
} from "./BasicTopbarComponents";
import TopbarSearch from "./TopbarSearch";
import { TopbarRightOver } from "./BasicTopbarComponents";
import TopbarNotification from "./TopbarNotification";
import TopbarMail from "./TopbarMail";
import TopbarLanguage from "./TopbarLanguage";

const Topbar = ({ changeMobileSidebarVisibility, changeSidebarVisibility }) => (
    <TopbarContainer>
        <TopbarLeft>
            <TopbarSidebarButton
                onClickMobile={changeMobileSidebarVisibility}
                onClickDesktop={changeSidebarVisibility}
            />
            <TopbarLogo to="/" />
        </TopbarLeft>
        <TopbarRight>
            {/*//* Search  */}
            <TopbarSearchWrap>
                <TopbarSearch />
            </TopbarSearchWrap>

            {/*//* Others  */}
            <TopbarRightOver>
                <TopbarNotification />
                <TopbarMail new />
                <TopbarProfile />
                <TopbarLanguage />
            </TopbarRightOver>
        </TopbarRight>
    </TopbarContainer>
);

Topbar.propTypes = {
    changeMobileSidebarVisibility: PropTypes.func.isRequired,
    changeSidebarVisibility: PropTypes.func.isRequired,
};

export default Topbar;
