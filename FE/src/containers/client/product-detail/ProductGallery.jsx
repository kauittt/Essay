import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Carousel from "@brainhubeu/react-carousel";
import ChevronLeftIcon from "mdi-react/ChevronLeftIcon";
import ChevronRightIcon from "mdi-react/ChevronRightIcon";
import "@brainhubeu/react-carousel/lib/style.css";
import { colorBorder } from "@/utils/palette";
import { marginRight } from "@/utils/directions";

//* Có thể mở rộng thành nhiều image
const ProductGallery = ({ image }) => {
    return (
        <ProductGalleryWrap>
            <ProductGalleryImageButton
                type="button"
                onClick={() => console.log("Click image detail")}
            >
                <img src={image} alt="product-img" />
            </ProductGalleryImageButton>
        </ProductGalleryWrap>
    );
};

ProductGallery.propTypes = {
    image: PropTypes.string.isRequired,
};

export default ProductGallery;

// region STYLES

const ProductGalleryWrap = styled.div`
    max-width: 440px;
    width: 100%;

    @media screen and (max-width: 1199px) {
        margin: auto;
    }
`;

const ProductGalleryImageButton = styled.button`
    width: 440px;
    height: 440px;
    display: flex;
    justify-content: center;
    align-items: stretch;
    overflow: hidden;
    margin-bottom: 10px;
    border: 1px solid ${colorBorder};
    padding: 0;
    border-radius: 5px;

    @media screen and (max-width: 568px) {
        max-width: 350px;
        height: 250px;
    }

    img {
        width: 100%;
        height: auto;
        border-radius: 5px;
    }
`;

const ProductGalleryImages = styled.div`
    display: flex;
`;

const ProductGalleryPreviewButton = styled.button`
    width: 80px;
    height: 80px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    cursor: pointer;
    ${marginRight}: 10px;
    padding: 0;
    background: transparent;
    border: 1px solid ${colorBorder};

    &:last-child {
        ${marginRight}: 0;
    }

    img {
        height: 80px;
    }

    @media screen and (max-width: 568px) {
        ${marginRight}: 5px;
        width: 50px;
        height: 50px;

        img {
            height: 60px;
        }
    }
`;

// endregion
