import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { Modal as BootstrapModal } from "react-bootstrap";
import { right } from "@/utils/directions";
import { colorIcon, colorText } from "@/utils/palette";

const SimpleModal = ({ isActive, onClose, children }) => (
    <StyledModal show={isActive} onHide={onClose}>
        <ModalCloseButton
            className="lnr lnr-cross"
            aria-label="close-btn"
            type="button"
            onClick={onClose}
        />
        {children}
    </StyledModal>
);

SimpleModal.propTypes = {
    isActive: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};

export default SimpleModal;

// region STYLES

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

const StyledModal = styled(BootstrapModal)`
    .modal-dialog {
        max-width: 80%;
        top: 50%;
        transform: translateY(-50%) !important;

        @media (max-width: 767px) {
            max-width: 100%;
            height: 100%;
            top: 0;
            transform: translateY(0) !important;
            margin: 0;
        }
    }

    .modal-content {
        border-radius: 0;
        border: none;
        box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.1);
        position: relative;
        padding: 50px 40px 60px 40px;
        text-align: center;
        background-color: #1f1f1f;
        color: ${colorText};

        @media (max-width: 767px) {
            height: 100%;
            align-items: center;
            justify-content: center;
        }

        @media (max-width: 600px) {
            padding: 16px;

            .slick-slide {
                padding: 0;
            }
        }
    }
`;

// endregion
