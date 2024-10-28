import React, { useState } from "react";
import { Col } from "react-bootstrap";
import styled from "styled-components";
import HeartIcon from "mdi-react/HeartIcon";
import StarIcon from "mdi-react/StarIcon";
import StarOutlineIcon from "mdi-react/StarOutlineIcon";
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/Button";
import { Card, CardBody } from "@/shared/components/Card";
import {
    colorAdditional,
    colorBlue,
    colorBlueHover,
    colorYellow,
} from "@/utils/palette";
import { left, paddingLeft, marginLeft } from "@/utils/directions";
import {
    FormButtonToolbar,
    FormContainer,
    FormGroup,
    FormGroupField,
    FormGroupLabel,
} from "@/shared/components/form/FormElements";
import ProductGallery from "./ProductGallery";
import images from "./imgs";
import ProductTabs from "./ProductTabs";
import ColorSelect from "./ColorSelect";
import { FaStar } from "react-icons/fa";

const ProductCard = ({ product = {} }) => {
    if (!product || Object.keys(product).length === 0) {
        return <div>No product data available.</div>;
    }

    const [color, setColor] = useState("white");

    const onLike = () => {
        if (color === "white") {
            setColor("#70bbfd");
        } else {
            setColor("white");
        }
    };

    console.log("Product at detail", product);

    return (
        <Col md={12} lg={12}>
            <Card>
                <CardBody>
                    <ProductCardContent>
                        {/*//* Image  */}
                        <ProductGallery image={product?.image} />

                        <ProductCardInfo>
                            {/*//* Name  */}
                            <ProductCardTitle>{product.name}</ProductCardTitle>

                            {/*//* Star */}
                            <ProductCardRate>
                                <StarRating rating={product.star} />
                            </ProductCardRate>

                            {/*//* Price  */}
                            <ProductCardPrice>
                                {`${product.price.toLocaleString()} VNĐ`}
                                {/* <ProductCardOldPrice>$23</ProductCardOldPrice> */}
                            </ProductCardPrice>

                            {/*//* Description  */}
                            <p className="typography-message">
                                {product.description}
                            </p>

                            {/*//* Button  */}
                            <ProductCardForm>
                                <FormButtonToolbar>
                                    <Button
                                        as={Link}
                                        variant="primary"
                                        to="/e-commerce/cart"
                                    >
                                        Add to cart
                                    </Button>
                                </FormButtonToolbar>
                            </ProductCardForm>

                            {/*//* Tabs  */}
                            <ProductTabs />
                        </ProductCardInfo>
                    </ProductCardContent>
                </CardBody>
            </Card>
        </Col>
    );
};

export default ProductCard;

const StarRating = ({ rating }) => {
    const MAX_STARS = 5;

    // Function to get the fill style for each star
    const getStarFill = (index) => {
        if (rating >= index + 1) {
            // Fully yellow star
            return "#f6da6e";
        } else if (index < rating && rating < index + 1) {
            // Half yellow star using gradient
            const percentage = (rating - index) * 100;
            return (
                <svg width="1em" height="1em">
                    <linearGradient
                        id={`yellow-gray-gradient-${index}`}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                    >
                        <stop stopColor="#f6da6e" offset={`${percentage}%`} />
                        <stop
                            stopColor="rgb(216, 223, 233)"
                            offset={`${percentage}%`}
                        />
                        <stop stopColor="rgb(216, 223, 233)" offset="100%" />
                    </linearGradient>
                    <FaStar
                        style={{ fill: `url(#yellow-gray-gradient-${index})` }}
                    />
                </svg>
            );
        } else {
            // Gray star
            return "rgb(216, 223, 233)";
        }
    };

    return (
        <div className="tw-flex tw-gap-[5px]">
            {Array.from({ length: MAX_STARS }).map((_, index) => (
                <div
                    key={index}
                    className="tw-flex tw-justify-center tw-items-center"
                >
                    {typeof getStarFill(index) === "string" ? (
                        <FaStar style={{ fill: getStarFill(index) }} />
                    ) : (
                        getStarFill(index)
                    )}
                </div>
            ))}
            ({rating.toFixed(2)})
        </div>
    );
};

// region STYLES

const ProductCardForm = styled(FormContainer)`
    margin-top: 20px;
    margin-bottom: 20px;
`;

const ProductCardLabel = styled(FormGroupLabel)`
    font-weight: 500;
`;

const ProductCardContent = styled.div`
    display: flex;
    flex-wrap: wrap;

    .product-card__btn-toolbar {
        margin-bottom: 10px;
    }
`;

const ProductCardInfo = styled.div`
    width: calc(100% - 440px);
    ${paddingLeft}: 42px;

    @media screen and (max-width: 1199px) {
        width: 100%;
        ${paddingLeft}: 0;
        padding-top: 35px;
    }
`;

const ProductCardTitle = styled.h3`
    text-align: ${left};
    font-weight: 700;
    margin-bottom: 10px;
`;

const ProductCardRate = styled.div`
    display: flex;
    margin-bottom: 30px;

    svg {
        fill: ${colorYellow};
        height: 14px;
        width: 14px;
    }
`;

const ProductCardLink = styled.a`
    font-size: 12px;
    color: ${colorBlue};
    line-height: 16px;
    display: block;
    ${marginLeft}: 5px;

    &:hover {
        color: ${colorBlueHover};
        text-decoration: none;
    }
`;

const ProductCardPrice = styled.h1`
    margin-bottom: 25px;
    text-align: ${left};
`;

const ProductCardOldPrice = styled.span`
    font-size: 24px;
    color: ${colorAdditional};
    text-decoration: line-through;
`;

const ProductCArdWishButton = styled.button`
    display: block;
    padding: 10px 0;
    font-size: 14px;
    color: ${colorBlue};
    height: 42px;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.3s;

    svg {
        height: 14px;
        transition: all 0.3s;
        stroke: ${colorBlue};
    }

    &:hover {
        color: ${colorBlueHover};

        svg {
            fill: ${colorBlueHover};
        }
    }
`;

//
