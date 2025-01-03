import React from "react";
import PropTypes from "prop-types";
import Error from "@/shared/components/form/Error";
import styled from "styled-components";

const FormField = ({
    input = null,
    meta: { touched = false, error = "" } = {},
    component: Component = "input",
    isAboveError = false,
    wrapperClassName = "",
    myOnBlur,
    ...props
}) => (
    <FormInputWrap className={wrapperClassName}>
        <StyledSpan>
            <StyledComponent
                as={Component}
                {...props}
                {...input}
                // style={{ border: "0px", height: "40px" }}
                autoComplete="off"
                onBlur={(e) => {
                    // Gọi logic tùy chỉnh từ myOnBlur nếu được truyền
                    if (myOnBlur) {
                        myOnBlur(e);
                    }
                    // Gọi hàm onBlur mặc định từ react-final-form để cập nhật trạng thái
                    if (input && input.onBlur) {
                        input.onBlur(e);
                    }
                }}
            />
        </StyledSpan>
        {(myOnBlur || touched) && error && (
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
    //! Cần border thì sửa hết
    /* border: 2px solid lightgrey; */
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
