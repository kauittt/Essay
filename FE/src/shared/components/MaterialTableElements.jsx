import styled from "styled-components";
import { Table as MuiTable } from "@mui/material";
import { TableSortLabel as MuiTableSortLabel } from "@mui/material";
import { TableCell as MuiTableCell } from "@mui/material";
import { TablePagination as MuiTablePagination } from "@mui/material";
import { TableRow as MuiTableRow } from "@mui/material";
import { Checkbox as MuiCheckbox } from "@mui/material";
import { Menu as MuiMenu } from "@mui/material";
import { MenuItem as MuiMenuItem } from "@mui/material";
import { IconButton as MuiIconButton } from "@mui/material";
import { Toolbar as MuiToolbar } from "@mui/material";
import {
    colorAccent,
    colorHover,
    colorText,
    colorBackground,
    colorBackgroundBody,
    colorIcon,
    colorBlue,
} from "@/utils/palette";
import { marginRight, right, left } from "@/utils/directions";

export const TableWrap = styled.div`
    overflow-x: auto;
`;

export const Table = styled(MuiTable)`
    && th {
        white-space: nowrap;
    }
`;

export const TableCheckbox = styled(MuiCheckbox)`
    && {
        transition: 0.3s;
        color: ${colorIcon};

        span {
            ${(props) => props.checked && `color: ${colorAccent};`}
        }
    }
`;

export const TableRow = styled(MuiTableRow)`
    && {
        transition: 0.3s;
        cursor: pointer;

        &[aria-checked="true"] {
            background-color: ${colorHover};

            ${TableCheckbox} span {
                color: ${colorAccent};
            }
        }

        &:hover {
            background-color: ${colorBackgroundBody};
        }
    }
`;

export const TableCell = styled(MuiTableCell)`
    && {
        color: ${colorText};
        ${(props) => props.right && `text-align: ${left(props)};`}
        ${(props) =>
            props.sort &&
            `
      span {
        transition: 0.3s;
        color: ${colorText(props)};
        &:hover {
          color: ${colorAccent};
        }
      }
    `}
    :hover .name {
            transition: all 0.3s;
            color: ${colorBlue};
            text-decoration: underline;
        }
    }
`;

export const TablePagination = styled(MuiTablePagination)`
    && {
        float: ${right};

        button:hover {
            background-color: ${colorHover} !important;
        }

        & > div {
            padding: 0;
        }

        span,
        div,
        svg {
            color: ${colorText};
        }

        @media screen and (max-width: 768px) {
            div {
                margin-left: 8px;
                margin-right: 8px;

                &:last-child {
                    ${marginRight}: 0;
                }

                &:first-child {
                    margin: 0;
                }
            }

            div > span:first-of-type {
                display: none;
            }
        }
    }
`;

export const TableToolbarWrap = styled.div`
    position: absolute;
    top: 10px;
    ${right}: 0;
`;

export const TableButton = styled(MuiIconButton)`
    && {
        color: ${colorText};
    }
`;

export const Toolbar = styled(MuiToolbar)`
    && {
        padding: 0 30px;

        ${TableButton} {
            height: 36px;
            width: 36px;
            padding: 0;
        }
    }
`;

export const TableToolbarSelected = styled.h5`
    ${marginRight}: 10px;

    @media screen and (max-width: 420px) {
        span {
            display: none;
        }
    }
`;

export const Menu = styled(MuiMenu)`
    && {
        div:last-child {
            box-shadow: 0 10px 30px 1px rgba(0, 0, 0, 0.06);
        }
    }
`;

export const MenuItem = styled(MuiMenuItem)`
    && {
        transition: 0.3s;
        font-size: 13px;
        padding: 7px 24px;
        height: auto;
        color: ${colorText};
        background: ${colorBackground};

        &:hover {
            background: ${colorHover};
        }
    }
`;

export const TableSortLabel = styled(MuiTableSortLabel)`
    && {
        color: ${colorText};
    }
`;
