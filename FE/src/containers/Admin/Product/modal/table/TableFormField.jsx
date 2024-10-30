import React from "react";
import PropTypes from "prop-types";
import Error from "@/shared/components/form/Error";
import styled from "styled-components";

const TableFormField = ({
    input = null,
    meta: { touched, error },
    component: Component = "input",
    isAboveError = false,
    wrapperClassName = "",
    onCellChange,
    cellValue = "",
    ...props
}) => {
    const handleChange = (event) => {
        const newValue = event.target.value;

        if (onCellChange) {
            onCellChange(newValue);
        }

        if (input && input.onChange) {
            input.onChange(newValue);
        }
    };

    // const value = input && input.value !== undefined ? input.value : cellValue;
    // const value = !isNaN(cellValue) && cellValue !== undefined ? cellValue : "";

    return (
        <FormInputWrap className={wrapperClassName}>
            <StyledSpan>
                <StyledComponent
                    as={Component}
                    {...props}
                    {...input}
                    onChange={handleChange}
                    value={cellValue}
                    style={{ border: "0px", height: "40px" }}
                />
            </StyledSpan>
            {touched && error && (
                <Error
                    error={error}
                    top={isAboveError}
                    style={{ color: "red" }}
                />
            )}
        </FormInputWrap>
    );
};

TableFormField.propTypes = {
    input: PropTypes.shape(),
    meta: PropTypes.shape({
        touched: PropTypes.bool,
        error: PropTypes.string,
    }),
    component: PropTypes.elementType,
    isAboveError: PropTypes.bool,
    wrapperClassName: PropTypes.string,
};

export const renderComponentField = (component) => (props) =>
    <TableFormField component={component} {...props} />;

export default TableFormField;

// region STYLES

const FormInputWrap = styled.div`
    width: 100%;
`;

const StyledSpan = styled.span`
    display: inline-block;
    width: 100%;
    border: 2px solid lightgrey;
    border-radius: 5px;
    &:focus-within {
        border-color: #3d89f7;
    }
    &:hover {
        border-color: #3d89f7;
    }
`;
const StyledComponent = styled.div`
    border: 0px solid transparent;
`;

// endregion
