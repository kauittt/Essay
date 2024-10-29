import React from "react";
import Select, { components } from "react-select";
import PropTypes from "prop-types";
import { renderComponentField } from "@/shared/components/form/FormField";
import styled from "styled-components";
import {
    colorAccent,
    colorBackground,
    colorBlue,
    colorFieldsBorder,
    colorIcon,
    colorText,
} from "@/utils/palette";
import { borderRight } from "@/utils/directions";
import { Card, CardBody } from "@/shared/components/Card";
import { Table } from "@/shared/components/TableElements";
import { useTranslation } from "react-i18next";

const CustomMenuList = ({ children, ...props }) => {
    const cellStyle = { textAlign: "center" };
    const { t } = useTranslation(["common", "SaleTranslations", "errors"]);

    return (
        <components.Menu {...props}>
            <CardBody>
                <Table bordered responsive hover>
                    <thead>
                        <tr>
                            <th style={cellStyle}>
                                {t("SaleTranslations:sale.fields.line.no")}
                            </th>
                            <th style={cellStyle}>
                                {t(
                                    "SaleTranslations:sale.fields.line.description"
                                )}
                            </th>
                            <th style={cellStyle}>
                                {t(
                                    "SaleTranslations:sale.fields.line.locationCode"
                                )}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {React.Children.map(children, (child) =>
                            React.cloneElement(child, { as: components.Option })
                        )}
                    </tbody>
                </Table>
            </CardBody>
        </components.Menu>
    );
};

const CustomOption = (props) => {
    if (!props.data || !props.data.item) {
        console.log("Invalid data for option", props);
        return null;
    }

    const cellStyle = { textAlign: "center" };
    return (
        <tr {...props.innerProps}>
            <td style={cellStyle}>{props.data.item.no}</td>
            <td style={cellStyle}>{props.data.item.description}</td>
            <td style={cellStyle}>{props.data.item.unitPrice}</td>
        </tr>
    );
};

export const LineItemSelectField = React.forwardRef(
    (
        {
            onChange,
            value,
            name,
            placeholder,
            options,
            setSelectedItem,
            onCellChange,
            columnId,
            cellValue,
            ...other
        },
        ref
    ) => {
        cellValue = cellValue + "";
        const selectedOptions = Array.isArray(cellValue)
            ? options.filter((option) => cellValue.includes(option.value))
            : options.find((option) => option.value === cellValue);

        const handleChange = (selectedOption) => {
            const newValue = Array.isArray(selectedOption)
                ? selectedOption.map((option) => option.value)
                : selectedOption.value;
            onChange(newValue);
            onCellChange(newValue); //! line Table: updateEditableData
            if (selectedOption) {
                setSelectedItem("selectedOption");
            }
        };

        return (
            <StyledSelect
                name={name}
                value={selectedOptions || cellValue}
                onChange={handleChange}
                options={options}
                clearable={false}
                className="react-select"
                placeholder={placeholder}
                classNamePrefix="react-select"
                ref={ref}
                menuPortalTarget={document.body}
                menuPosition="absolute"
                components={{ MenuList: CustomMenuList, Option: CustomOption }}
                styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensure dropdown stays on top
                    control: (base) => ({
                        ...base,
                        minWidth: "100%", // Match the cell width for control
                    }),
                    menu: (base) => ({
                        ...base,
                        width: "auto", // Auto-adjust width to content size
                        minWidth: base.width, // Minimum width as per parent width
                    }),
                }}
                {...other}
            />
        );
    }
);

const valuePropType = PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number, //* add here
    PropTypes.shape({
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number, //* Allow values to be numbers as well
        ]),
        label: PropTypes.string,
    }),
]);

LineItemSelectField.propTypes = {
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number, //* Support both strings and numbers
            ]),
            label: PropTypes.string,
        })
    ),
    value: PropTypes.oneOfType([
        valuePropType,
        PropTypes.arrayOf(valuePropType),
    ]).isRequired,
    setSelectedItem: PropTypes.func,
    onCellChange: PropTypes.func, //* thêm props
};

LineItemSelectField.defaultProps = {
    placeholder: "",
    options: [],
    setSelectedItem: () => {},
};

export default renderComponentField(LineItemSelectField);

// region STYLES

const StyledSelect = styled(Select)`
    width: 100%;
    height: 40px;
    font-size: 12px;

    .react-select__control {
        height: 32px;
        /* border-radius: 0 !important; */
        border-radius: 0.375rem !important; //! Override
        transition: all 0.3s;
        border: 1px solid ${colorFieldsBorder};
        background-color: ${colorBackground};

        &.react-select__control--is-focused,
        &:hover {
            border-color: ${colorAccent} !important;
            box-shadow: none;
            background: transparent;
        }
    }

    .react-select__input {
        height: 30px;
        color: ${colorText};
    }

    .react-select__indicator-separator {
        display: none;
    }

    .react-select__dropdown-indicator,
    .react-select__clear-indicator {
        cursor: pointer;
        color: ${colorIcon};

        svg {
            height: 16px;
            width: 16px;
        }
        display: none;
    }

    .react-select__multi-value {
        background-color: transparent;
        border: 1px solid ${colorBlue};

        .react-select__multi-value__label {
            padding: 3px 6px;
            ${borderRight}: 1px solid ${colorBlue};
            color: ${colorText};
        }
    }

    .react-select__multi-value__remove {
        opacity: 0.8;
        transition: 0.3s;
        cursor: pointer;
        color: ${colorText};
    }

    .react-select__multi-value__label,
    .react-select__multi-value__remove {
        background: ${colorBackground};
    }

    .react-select__single-value {
        color: ${colorText};
    }

    .react-select__menu {
        box-shadow: none !important;
        margin-top: 6px;
        margin-bottom: 6px;
        position: absolute; //! Ensure the menu is positioned absolutely
        z-index: 9999; //! High z-index to avoid clipping
    }

    .react-select__menu-list {
        top: calc(100% + 1px);
        border-radius: 0;
        box-shadow: none;
        font-size: 12px;
        overflow: hidden;
        background: ${colorBackground};
        border: 1px solid ${colorFieldsBorder};
    }

    @keyframes open {
        0% {
            max-height: 0;
        }
        100% {
            max-height: 200px;
        }
    }

    .react-select__placeholder {
        font-size: 12px;
        margin-top: -2px;
    }

    .react-select__value-container {
        padding-top: 0;
        padding-bottom: 0;

        & > div {
            margin-top: 0;
            margin-bottom: 0;
        }
    }
`;

// endregion