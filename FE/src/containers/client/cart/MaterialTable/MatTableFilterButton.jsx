import React, { useState } from "react";
import PropTypes from "prop-types";
import FilterListIcon from "mdi-react/FilterListIcon";
import {
    Menu,
    MenuItem,
    TableButton,
} from "@/shared/components/MaterialTableElements";
import { useTranslation } from "react-i18next";

const MatTableFilterButton = ({ onRequestSort }) => {
    const { t, i18n } = useTranslation(["common", "errors", "store"]);
    let language = i18n.language;
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSort = (property) => (event) => {
        onRequestSort(event, property);
        handleClose();
    };

    return (
        <div>
            <TableButton
                aria-owns={anchorEl ? "simple-menu" : null}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <FilterListIcon />
            </TableButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleSort("name")}>
                    {t("store:product.tableName")}
                </MenuItem>
                <MenuItem onClick={handleSort("quantity")}>
                    {t("store:product.quantity")}
                </MenuItem>
                <MenuItem onClick={handleSort("price")}>
                    {t("store:product.price")}
                </MenuItem>
                <MenuItem onClick={handleSort("total")}>
                    {t("store:product.totalPrice")}
                </MenuItem>
            </Menu>
        </div>
    );
};

MatTableFilterButton.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
};

export default MatTableFilterButton;
