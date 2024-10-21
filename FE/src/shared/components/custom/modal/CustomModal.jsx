import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal as BootstrapModal } from "react-bootstrap";
import { Button, ButtonToolbar } from "@/shared/components/Button";
import styled from "styled-components";
import {
    colorAccent,
    colorBackground,
    colorBlue,
    colorIcon,
    colorRed,
    colorText,
    colorWhite,
    colorYellow,
} from "@/utils/palette";
import {
    flexFlow,
    left,
    paddingLeft,
    paddingRight,
    right,
} from "@/utils/directions";
import VoucherModal from "@/containers/Admin/Voucher/modal/VoucherModal";
import CategoryModal from "@/containers/Admin/Category/modal/CategoryModal";
import ProductModal from "@/containers/Admin/Product/modal/ProductModal";
import UserModal from "../../../../containers/Admin/User/modal/UserModal";
import OrderModal from "../../../../containers/Admin/Order/modal/OrderModal";

const CustomModal = ({
    color,
    btn,
    title = "",
    action = "",
    colored = false,
    header = false,
    data = {},
    component,
}) => {
    const [modal, setModal] = useState(false);

    const toggle = () => {
        setModal((prevState) => !prevState);
    };

    let Icon;
    switch (color) {
        case "primary":
            Icon = <ModalTitleIcon className="lnr lnr-pushpin" />;
            break;
        case "success":
            Icon = <ModalTitleIcon className="lnr lnr-thumbs-up" />;
            break;
        case "warning":
            Icon = <ModalTitleIcon className="lnr lnr-flag" />;
            break;
        case "danger":
            Icon = <ModalTitleIcon className="lnr lnr-cross-circle" />;
            break;
        default:
            break;
    }

    const buttonVariant = colored ? `outline-${color}` : color;

    return (
        <div>
            <Button variant={color} onClick={toggle} style={{ margin: "0" }}>
                {btn}
            </Button>
            <StyledModal
                show={modal}
                onHide={toggle}
                color={color}
                colored={colored}
                header={header}
            >
                <ModalHeader>
                    <ModalCloseButton
                        className="lnr lnr-cross"
                        aria-label="close-btn"
                        type="button"
                        onClick={toggle}
                    />
                    {header ? "" : Icon}
                    <ModalTitle>{title}</ModalTitle>
                </ModalHeader>

                <ModalBody>
                    {component == "product" && (
                        <ProductModal
                            action={action}
                            toggle={toggle}
                            data={data}
                        ></ProductModal>
                    )}

                    {component == "category" && (
                        <CategoryModal
                            action={action}
                            toggle={toggle}
                            data={data}
                        ></CategoryModal>
                    )}

                    {component == "voucher" && (
                        <VoucherModal
                            action={action}
                            toggle={toggle}
                            data={data}
                        ></VoucherModal>
                    )}

                    {component == "user" && (
                        <UserModal
                            action={action}
                            toggle={toggle}
                            data={data}
                        ></UserModal>
                    )}

                    {component == "order" && (
                        <OrderModal
                            action={action}
                            toggle={toggle}
                            data={data}
                        ></OrderModal>
                    )}
                </ModalBody>
            </StyledModal>
        </div>
    );
};

CustomModal.propTypes = {
    title: PropTypes.string,
    action: PropTypes.string,
    color: PropTypes.string.isRequired,
    colored: PropTypes.bool,
    header: PropTypes.bool,
    btn: PropTypes.string.isRequired,
    data: PropTypes.object,
    component: PropTypes.string,
};

export default CustomModal;

// region STYLES

const ModalFooter = styled(ButtonToolbar)`
    margin-top: 20px;
    display: flex;
    justify-content: center;
    margin-bottom: 0;

    button {
        min-width: 100px;
        padding: 4px 25px;
        margin-bottom: 0;
        display: inline-block;
    }

    flex-flow: ${flexFlow} !important;
`;

const ModalTitle = styled.h4`
    margin-top: 10px;
    margin-bottom: 15px;
    font-weight: 700;

    &:first-child {
        margin-top: 0;
    }
`;

const ModalCloseButton = styled.button`
    position: absolute;
    top: 15px;
    ${right}: 15px;
    font-size: 14px;
    width: 14px;
    height: 14px;
    cursor: pointer;
    padding: 0;
    border: none;
    background: transparent;
    color: ${colorIcon};
`;

const ModalTitleIcon = styled.span`
    width: 24px;
    height: 24px;
    font-size: 24px;
`;

const ModalHeader = styled.div``;
const ModalBody = styled.div``;

const getColor = (color) => {
    switch (color) {
        case "primary":
            return colorBlue;
        case "success":
            return colorAccent;
        case "warning":
            return colorYellow;
        case "danger":
            return colorRed;

        default:
            return colorText;
    }
};

const StyledModal = styled(BootstrapModal).withConfig({
    shouldForwardProp: (prop) => !["colored", "header"].includes(prop),
})`
    .modal-dialog {
        display: flex;
        align-items: center;
        justify-content: center;
        max-width: 90%; //! Adjust this to set the new width of the modal
        /* margin: 45px auto; //! This ensures that the modal is centered horizontally */
        height: 100%;
        margin-top: 0px;
        margin-bottom: 0px;
    }

    .modal-content {
        border-radius: 0;
        border: none;
        box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.1);
        position: relative;
        padding: 40px 40px;
        text-align: center;
        background-color: ${colorBackground};
        color: ${colorText};
        width: 100%; //! Use 100% to ensure it expands to fill the .modal-dialog,
        max-height: 90%;
        overflow-y: auto;
    }

    ${ModalTitleIcon} {
        color: ${(props) => getColor(props.color)};
    }

    ${(props) =>
        props.colored &&
        `
    color: ${colorWhite};

    ${ModalTitle},
    ${ModalTitleIcon},
    ${ModalCloseButton} {
      color: ${colorWhite};
    }

    ${ModalFooter} {

      button:first-child {
        color: ${colorWhite};
        background-color: rgba(255, 255, 255, 0.3);
        border-color: ${colorWhite};

        &:before {
          background-color: rgba(255, 255, 255, 0.2);
        }
      }

      button:last-child {
        border-color: white;
        color: ${colorWhite};
      }
    }

    .modal-content {
      color: ${colorWhite};
      background-color: ${getColor(props.color)};
    }
  `}

    ${(props) =>
        props.header &&
        `
    
    .modal-dialog {
      max-width: 520px;
    }

    .modal-content {
      padding: 0;
      text-align: ${left(props)};
    }
    
    ${ModalTitle} {
      color: ${colorWhite};
    }

    ${ModalHeader} {
      color: ${colorWhite};
      padding: 15px 20px;
      position: relative;
    }

    ${ModalTitle} {
      margin: 0;
      font-weight: 300;
    }

    ${ModalCloseButton} {
      color: ${colorWhite};
      top: calc(50% - 8px);
    }

    ${ModalBody} {
      padding-top: 25px;
      padding-bottom: 20px;
      ${paddingRight(props)}: 40px;
      ${paddingLeft(props)}: 20px;
    }

    ${ModalFooter} {
      margin-bottom: 40px;
      justify-content: flex-end;
      ${paddingRight(props)}: 20px;
    }

    ${ModalHeader} {
      background-color: ${getColor(props.color)};
    }
  `}
`;

// endregion
