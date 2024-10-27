import styled from "styled-components";
import {
    colorAdditional,
    colorAdditionalHover,
    colorDarkText,
} from "@/utils/palette";

export const WalletInfoWrapper = styled("div")`
    > div {
        margin-bottom: 24px;
        :last-child {
            margin-bottom: 34px;
        }
    }
`;

export const WalletStatRowWrapper = styled("div")`
    > * {
        &:not(:last-child) {
            margin-bottom: 8px;
        }
    }
`;

export const WalletStatRowTitle = styled("div")`
    font-size: 13px;
    color: ${colorAdditional};
    line-height: 1;
`;

export const WalletStatRowValue = styled("div")`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 8px;
    font-size: ${({ variant }) => (variant === "small" ? "16px" : "24px")};
    color: ${colorDarkText};
    line-height: 1.1;

    .lnr {
        cursor: pointer;
    }
`;

export const WalletConnection = styled("button")`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 16px;
    background: none;
    border: none;
    padding: 0;
    color: ${colorAdditional};
    transition: color 0.2s;

    &:hover {
        color: ${colorAdditionalHover};
    }
`;

export const NFTItemsWrap = styled("div")`
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 15px;

    @media (max-width: 768px) {
        justify-content: space-between;
    }

    img {
        width: 250px;
        height: 250px;
        object-fit: cover;
        object-position: top center;

        @media (max-width: 1199px) {
            width: 200px;
            height: 200px;
        }

        @media (max-width: 768px) {
            width: 115px;
            height: 115px;
        }
    }
`;

export const PanelTabs = styled("div")`
    > div {
        min-width: auto;
    }
`;

export const StyledNoWrapCell = styled("td")`
    white-space: nowrap;
`;

export const TableRow = styled("tr")`
    td:last-of-type {
        width: 20px;
    }
`;
