import React, { useEffect, useState } from "react";
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
import ProductTabs from "./ProductTabs";
import StarRating from "../StarRating";
import { Form } from "react-final-form";
import FormInput from "./../../../shared/components/custom/form/FormInput";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import CartService from "../../../services/CartService";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/reducers/userSlice";
import { useDispatch } from "react-redux";
import {
    fetchCurrentUser,
    fetchUsers,
} from "../../../redux/actions/userAction";

const ProductCard = ({ product = {} }) => {
    const { t, i18n } = useTranslation(["common", "errors", "store"]);
    let language = i18n.language;
    const history = useHistory();
    const user = useSelector(selectUser);
    const dispatch = useDispatch();

    if (!product || Object.keys(product).length === 0) {
        return <div>No product data available.</div>;
    }

    const inputSie = {
        label: t("store:size.title"), // "Customer Name"
        name: "size",
        type: "expandSelect",
        options: product.sizeProducts.map((item) => ({
            value: item.size.name,
            label: item.size.name,
            render: [item.size.name, item.stock],
            isDisabled: item.stock === 0,
        })),
        menuList: [t("store:size.title"), t("store:product.stock")],
    };

    //* Validate
    const validate = (values, t) => {
        const errors = {};

        if (!values.size) {
            errors.size = t("errors:validation.required");
        }
        return errors;
    };

    const submitForm = async (values) => {
        console.log("Add to cart");
        console.log("Submit values", values);

        const cartRequest = {
            products: [product.id],
            sizes: [values.size],
            quantities: [1],
        };

        console.log("cartRequest", cartRequest);

        // console.log("cartRequest", cartRequest);
        try {
            let response = await CartService.putCart(user.id, cartRequest);

            // console.log("response", response);

            if (response) {
                dispatch(fetchUsers());
                toast.info(
                    t("common:action.success", { type: t("action.add") }),
                    {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    }
                );
            }
        } catch (e) {
            console.log(e);
            toast.error(t("common:action.fail", { type: t("action.add") }), {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    //* Fetch lại users
    useEffect(() => {
        return () => {
            // dispatch(fetchUsers());
            dispatch(fetchCurrentUser());
        };
    }, []);

    // console.log("Product at detail ", product);

    return (
        <Col md={12} lg={12}>
            <Card>
                <CardBody>
                    <Button
                        variant="secondary"
                        onClick={() => history.push("/pages/client/home")}
                        style={{
                            margin: "0px",
                            marginBottom: "20px",
                        }}
                    >
                        {t("action.back")}
                    </Button>

                    <ProductCardContent>
                        {/*//* Image  */}
                        <ProductGallery image={product?.image} />

                        <ProductCardInfo>
                            {/*//* Name  */}
                            <ProductCardTitle>
                                {language == "vn"
                                    ? product.name
                                    : product.enName}
                            </ProductCardTitle>

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
                                {language == "vn"
                                    ? product.description
                                    : product.enDescription}
                            </p>

                            {/*//* Button  */}
                            <Form
                                onSubmit={submitForm}
                                validate={(values) => validate(values, t)}
                            >
                                {({ handleSubmit, form }) => {
                                    //* Handle việc select No/Name
                                    return (
                                        <FormContainer onSubmit={handleSubmit}>
                                            <Col md={12} lg={12}>
                                                <Card
                                                    style={{
                                                        marginBottom: "0px",
                                                        paddingBottom: "0px",
                                                    }}
                                                >
                                                    <div className="tw-my-[20px]">
                                                        <FormInput
                                                            data={inputSie}
                                                        ></FormInput>

                                                        <FormButtonToolbar>
                                                            <Button
                                                                type="submit"
                                                                variant="primary"
                                                            >
                                                                {t(
                                                                    "action.addToCart"
                                                                )}
                                                            </Button>
                                                        </FormButtonToolbar>
                                                    </div>
                                                </Card>
                                            </Col>
                                        </FormContainer>
                                    );
                                }}
                            </Form>

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
    margin-bottom: 25px;

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
