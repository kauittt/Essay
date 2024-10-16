import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { Modal as BootstrapModal } from "react-bootstrap";
import { right } from "@/utils/directions";
import { colorIcon, colorText, colorBackground } from "@/utils/palette";

const SimpleModal = ({ isActive, onClose, children, title }) => (
    <StyledModal show={isActive} onHide={onClose}>
        <ModalCloseButton
            className="lnr lnr-cross"
            aria-label="close-btn"
            type="button"
            onClick={onClose}
        />
        {title && (
            <ModalTitle>
                <ModalTitleIcon className="lnr lnr-pushpin" />
                <ModalTitleText>{title}</ModalTitleText>
            </ModalTitle>
        )}
        {children}
    </StyledModal>
);

SimpleModal.propTypes = {
    isActive: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    title: PropTypes.string, // Thêm title là tùy chọn
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

const ModalTitle = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
`;

const ModalTitleIcon = styled.span`
    font-size: 24px;
    margin-bottom: 10px;
    color: #B2D8E0;
`;

const ModalTitleText = styled.h2`
    font-size: 18px;
    font-weight: bold;
    color: ${colorText};
`;


const StyledModal = styled(BootstrapModal)`
    .modal-dialog {
        max-width: 98%;
        top: 20px;
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
        padding: 50px 8% 50px 8%;
        text-align: center;
        background-color: ${colorBackground};
        color: ${colorText};

        overflow-y: auto;

        @media (max-width: 800px) {
            height: 100%;
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
