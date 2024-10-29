import React from "react";
import Select from "react-select";
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
    colorAdditional,
    colorBlackBackground,
} from "@/utils/palette";
import { borderRight } from "@/utils/directions";

console.log("colorBackground", colorBackground);
console.log("colorBlackBackground", colorBlackBackground);

export const SelectField = React.forwardRef(
    (
        {
            onChange,
            value,
            name,
            placeholder = "",
            options = [],
            setSelectedItem = () => {},
            myOnChange = () => {},
            ...other
        },
        ref
    ) => {
        // console.log("Values select", value);
        const selectedOptions = Array.isArray(value)
            ? options.filter((option) => value.includes(option.value))
            : options.find((option) => option.value === value);

        const handleChange = (selectedOption) => {
            console.log(selectedOption);
            const newValue = Array.isArray(selectedOption)
                ? selectedOption.map((option) => option.value)
                : selectedOption.value;
            onChange(newValue);
            myOnChange(newValue);
            if (selectedOption) {
                setSelectedItem(selectedOption);
            }
        };

        return (
            <StyledSelect
                name={name}
                value={selectedOptions || value}
                onChange={handleChange}
                options={options}
                clearable={false}
                className="react-select"
                placeholder={placeholder}
                classNamePrefix="react-select"
                ref={ref}
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

SelectField.propTypes = {
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number, // Support both strings and numbers
            ]),
            label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        })
    ),
    value: PropTypes.oneOfType([
        valuePropType,
        PropTypes.arrayOf(valuePropType),
    ]).isRequired,
    setSelectedItem: PropTypes.func,
};

export default renderComponentField(SelectField);

// region STYLES

const defaultBg = "#DEEBFF";

const StyledSelect = styled(Select)`
    width: 100%;
    /* height: 40px; */
    height: ${({ value }) =>
        Array.isArray(value) && value.length > 0 ? "auto" : "40px"};
    font-size: 12px;

    .react-select__control {
        /* height: 32px; */
        height: ${({ value }) =>
            Array.isArray(value) && value.length > 0 ? "auto" : "32px"};
        border-radius: 0 !important;
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
        /* height: 30px; */
        height: auto;
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
    }

    .react-select__multi-value {
        background-color: transparent;
        border: 1px solid ${colorBlue};
        margin: 3px;

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

        //* thêm
        background-color: ${colorBackground};
    }

    .react-select__menu-list {
        top: calc(100% + 1px);
        border-radius: 0;
        box-shadow: none;
        font-size: 12px;
        overflow: auto;
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
        /* padding-top: 0;
        padding-bottom: 0; */
        padding-top: 8px;
        padding-bottom: 8px;

        & > div {
            margin-top: 0;
            margin-bottom: 0;
        }
    }

    //* thêm
    .react-select__option {
        color: ${({ theme }) =>
            colorBackground({ theme }) !== colorBlackBackground
                ? colorBlackBackground //* Nền trắng
                : colorText}; //* Nền đen

        background-color: ${colorBackground};

        &:hover:not(.react-select__option--is-selected) {
            background-color: ${defaultBg};
            color: ${({ theme }) =>
                colorBackground({ theme }) !== colorBlackBackground
                    ? colorBlackBackground //* Nền trắng
                    : colorBackground({ theme })}; //* Nền đen
        }
    }

    .react-select__option--is-selected {
        background-color: ${colorAccent};
        color: ${colorBackground};
    }
`;

// endregion
