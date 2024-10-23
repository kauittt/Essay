import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { colorBorder, colorBackground, colorHover } from "@/utils/palette";
import { left } from "@/utils/directions";
import SidebarLink, { SidebarLinkTitle, SidebarNavLink } from "./SidebarLink";
import SidebarCategory from "./SidebarCategory";
import { useTranslation } from "react-i18next";

const SidebarContent = ({
    // onClick,
    collapse = false,
    changeToLight,
    changeToDark,
}) => {
    const { t } = useTranslation(["common", "errors", "store"]);
    const dispatch = useDispatch();

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        // dispatch(userLogout());
    };
    return (
        <SidebarContentWrap collapse={collapse}>
            <SidebarBlock collapse={collapse}>
                <SidebarCategory
                    title="Layout"
                    icon="layers"
                    collapse={collapse}
                >
                    <SidebarNavLink
                        as="button"
                        type="button"
                        onClick={changeToLight}
                    >
                        <SidebarLinkTitle>Light Theme</SidebarLinkTitle>
                    </SidebarNavLink>
                    <SidebarNavLink
                        as="button"
                        type="button"
                        onClick={changeToDark}
                    >
                        <SidebarLinkTitle>Dark Theme</SidebarLinkTitle>
                    </SidebarNavLink>
                </SidebarCategory>
            </SidebarBlock>

            <SidebarBlock collapse={collapse}>
                <SidebarLink
                    title="Dashboard"
                    icon="store"
                    route="/pages/dashboard"
                />
            </SidebarBlock>

            <SidebarBlock collapse={collapse}>
                <SidebarLink
                    title={t("store:product.titles")}
                    icon="store"
                    route="/pages/products"
                />
            </SidebarBlock>

            <SidebarBlock collapse={collapse}>
                <SidebarLink
                    title={t("store:category.titles")}
                    icon="store"
                    route="/pages/categories"
                />
            </SidebarBlock>

            <SidebarBlock collapse={collapse}>
                <SidebarLink
                    title={t("store:voucher.titles")}
                    icon="store"
                    route="/pages/vouchers"
                />
            </SidebarBlock>

            <SidebarBlock collapse={collapse}>
                <SidebarLink
                    title={t("store:user.titles")}
                    icon="store"
                    route="/pages/users"
                />
            </SidebarBlock>

            <SidebarBlock collapse={collapse}>
                <SidebarLink
                    title={t("store:order.titles")}
                    icon="store"
                    route="/pages/orders"
                />
            </SidebarBlock>

            <SidebarBlock collapse={collapse}>
                <SidebarLink
                    title="Log out"
                    icon="exit"
                    route="/log_in"
                    onClick={logout}
                />
            </SidebarBlock>
        </SidebarContentWrap>
    );
};

SidebarContent.propTypes = {
    // onClick: PropTypes.func.isRequired,
    collapse: PropTypes.bool,
    changeToLight: PropTypes.func.isRequired,
    changeToDark: PropTypes.func.isRequired,
};

export default SidebarContent;

// region STYLES

const SidebarContentWrap = styled.div`
    height: 100%;
    overflow: auto;
    padding-top: 0;

    & > div:last-child {
        width: 4px !important;

        div {
            transition: height 0.3s;
            opacity: 0.52;
        }
    }

    @media screen and (min-width: 576px) {
        padding-top: 15px;

        ${(props) =>
            props.collapse &&
            `
      width: 55px;
      overflow: visible !important;
      transition: width 0.3s;
    `}
    }
`;

const SidebarBlock = styled.ul`
    padding: 15px 0;
    border-bottom: 1px solid ${colorBorder};
    list-style-type: none;

    &:last-child {
        border: none;
    }

    @media screen and (min-width: 576px) {
        ${(props) =>
            props.collapse &&
            `
      & > li > a,
      & > li > button {
        overflow: hidden;
        width: 55px;
        background: ${colorBackground(props)};
        
        span:last-of-type {
          opacity: 0;
          transition: 0.3s;
        }
  
        ${SidebarLinkTitle} {
          position: absolute;
          width: 160px;
          ${left(props)}: 70px;
        }
  
        &:hover {
          background: ${colorHover(props)};
        }
      }
      
      & > li:hover > a,
      & > li:hover > button {
        width: 275px;
        
        span {
          opacity: 1;
        }
      }
    `}
    }
`;

// endregion
