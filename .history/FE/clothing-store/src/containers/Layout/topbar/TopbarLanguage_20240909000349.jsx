import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Collapse } from "react-bootstrap";
import styled from "styled-components";
import { colorAccent, colorText } from "@/utils/palette";
import { left, marginRight } from "@/utils/directions";
import {
    TopbarBack,
    TopbarButton,
    TopbarDownIcon,
} from "./BasicTopbarComponents";
import {
    TopbarCollapse,
    TopbarCollapseContent,
} from "./CollapseTopbarComponents";

const gb = `${import.meta.env.BASE_URL}img/language/gb.png`;
const vn = `${import.meta.env.BASE_URL}img/language/vn.png`;

const GbLng = () => (
    <TopbarLanguageButtonTitle>
        <img src={gb} alt="gb" />
        <span className="tw-font-bold">EN</span>
    </TopbarLanguageButtonTitle>
);

const VnLng = () => (
    <TopbarLanguageButtonTitle>
        <img src={vn} alt="vn" />
        <span className="tw-font-bold">VN</span>
    </TopbarLanguageButtonTitle>
);

const TopbarLanguage = () => {
    const { i18n } = useTranslation("common");
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [mainButtonContent, setMainButtonContent] = useState(<GbLng />);

    const toggleLanguage = () => {
        setIsCollapsed(!isCollapsed);
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng).then(() => {
            switch (lng) {
                case "en":
                    setMainButtonContent(<GbLng />);
                    break;
                case "vn":
                    setMainButtonContent(<VnLng />);
                    break;
                default:
                    setMainButtonContent(<GbLng />);
                    break;
            }
        });
    };

    return (
        <TopbarLanguageCollapse>
            {/*//* Icon/Button  */}
            <TopbarButton type="button" onClick={toggleLanguage}>
                {mainButtonContent}
                <TopbarDownIcon />
            </TopbarButton>

            {/*//* Layer  */}
            {isCollapsed && (
                <TopbarBack
                    type="button"
                    aria-label="language button"
                    onClick={toggleLanguage}
                />
            )}

            <Collapse in={isCollapsed}>
                <TopbarLanguageCollapseContent>
                    {/*//* Options  */}
                    <TopbarLanguageButton
                        type="button"
                        onClick={() => changeLanguage("en")}
                    >
                        <GbLng />
                    </TopbarLanguageButton>

                    {/*//* VN  */}
                    <TopbarLanguageButton
                        type="button"
                        onClick={() => changeLanguage("vn")}
                    >
                        <VnLng />
                    </TopbarLanguageButton>
                </TopbarLanguageCollapseContent>
            </Collapse>
        </TopbarLanguageCollapse>
    );
};

export default TopbarLanguage;

// region STYLES

const TopbarLanguageCollapse = styled(TopbarCollapse)`
    min-width: 70px;
    display: block;

    & > button {
        padding: 0 4px;
        width: 100%;
    }
`;

const TopbarLanguageCollapseContent = styled(TopbarCollapseContent)`
    max-width: 75px;
    width: 100%;

    @media screen and (max-width: 1024px) {
        ${left}: 0;
    }
`;

const TopbarLanguageButton = styled.button`
    width: 100%;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 13px;
    line-height: 16px;
    transition: 0.3s;
    padding: 4px 5px 4px 15px;
    text-align: ${left};

    &:first-child {
        padding-top: 14px;
    }

    &:last-child {
        padding-bottom: 14px;
    }

    &:hover {
        color: ${colorAccent};
    }
`;

export const TopbarLanguageButtonTitle = styled.span`
    display: flex;
    font-size: 11px;
    align-items: center;
    margin: auto 0;
    color: ${colorText};

    &:not(:last-child) {
        ${marginRight}: 5px;
    }

    img {
        height: 11px;
        width: 16px;
        ${marginRight}: 4px;
    }
`;

// endregion
