import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import {
    TableCheckbox,
    TableSortLabel,
    TableLabel,
} from "@/shared/components/MaterialTableElements";
import styled from "styled-components";
import { colorBackground, colorText } from "@/utils/palette";
import { useTranslation } from "react-i18next";

const createSortHandler = (property, onRequestSort) => (event) => {
    onRequestSort(event, property);
};

const MatTableHead = ({
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
}) => {
    const rtl = useSelector((state) => state.rtl);
    const { t, i18n } = useTranslation(["common", "errors", "store"]);
    let language = i18n.language;

    const rows = [
        {
            id: "no",
            disablePadding: false,
            label: t("store:no"),
            sortable: false,
        },
        {
            id: "name",
            disablePadding: false,
            label: t("store:product.tableName"),
        },
        {
            id: "size",
            disablePadding: false,
            label: t("store:size.title") || "Size",
        },
        { id: "price", disablePadding: false, label: t("store:product.price") },
        {
            id: "quantity",
            disablePadding: false,
            label: t("store:product.quantity"),
        },
        {
            id: "total",
            disablePadding: false,
            label: t("store:product.totalPrice"),
        },
        {
            id: "remove",
            disablePadding: false,
            label: t("action.delete"),
            sortable: false,
        },
    ];

    return (
        <TableHead>
            <StyledTableRow>
                <StyledTableCell padding="checkbox">
                    <TableCheckbox
                        indeterminate={
                            numSelected > 0 && numSelected < rowCount
                        }
                        checked={numSelected === rowCount}
                        onChange={onSelectAllClick}
                    />
                </StyledTableCell>
                {rows.map((row) => (
                    <StyledTableCell
                        key={row.id}
                        align={rtl.direction === "rtl" ? "right" : "left"}
                        padding={row.disablePadding ? "none" : "normal"}
                        sortDirection={orderBy === row.id ? order : false}
                    >
                        {row.sortable === false ? (
                            <TableLabel>{row.label}</TableLabel>
                        ) : (
                            <TableSortLabel
                                active={orderBy === row.id}
                                direction={order}
                                onClick={createSortHandler(
                                    row.id,
                                    onRequestSort
                                )}
                                className="material-table__sort-label"
                                // style={{ color: colorText }}
                            >
                                {row.label}
                            </TableSortLabel>
                        )}
                    </StyledTableCell>
                ))}
            </StyledTableRow>
        </TableHead>
    );
};

MatTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const StyledTableCell = styled(TableCell)`
    background-color: ${colorBackground} !important;
    /* background-color: red !important; // Đảm bảo override stickyHeader styles */
    z-index: 10; // Sticky headers có thể cần chỉ số z-index
`;

const StyledTableRow = styled(TableRow)`
    && {
    }
`;

export default MatTableHead;
