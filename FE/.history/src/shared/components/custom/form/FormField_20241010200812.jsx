import React from "react";
import PropTypes from "prop-types";
import Error from "@/shared/components/form/Error";
import styled from "styled-components";

const FormField = ({
    input,
    meta: { touched, error },
    component: Component,
    isAboveError,
    wrapperClassName,
    ...props
}) => (
    <FormInputWrap className={wrapperClassName}>
        <StyledSpan>
            <StyledComponent
                as={Component}
                {...props}
                {...input}
                style={{ border: "0px", height: "40px" }}
            />
        </StyledSpan>
        {touched && error && (
            <Error error={error} top={isAboveError} style={{ color: "red" }} />
        )}
    </FormInputWrap>
);

FormField.propTypes = {
    input: PropTypes.shape(),
    meta: PropTypes.shape({
        touched: PropTypes.bool,
        error: PropTypes.string,
    }),
    component: PropTypes.elementType,
    isAboveError: PropTypes.bool,
    wrapperClassName: PropTypes.string,
};

FormField.defaultProps = {
    input: null,
    meta: {
        touched: false,
        error: "",
    },
    component: "input",
    isAboveError: false,
    wrapperClassName: "",
};

export const renderComponentField = (component) => (props) =>
    <FormField component={component} {...props} />;

export default FormField;

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
