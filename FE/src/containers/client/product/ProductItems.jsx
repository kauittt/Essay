import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Card, CardBody } from "@/shared/components/Card";
import {
    colorAccent,
    colorBlue,
    colorAdditional,
    colorBackground,
} from "@/utils/palette";
import { right, left, marginRight } from "@/utils/directions";
import { Button } from "@/shared/components/Button";
import { FaStar } from "react-icons/fa";
import StarRating from "../StarRating";
import { useTranslation } from "react-i18next";
import CartService from "../../../services/CartService";
import {
    fetchCurrentUser,
    fetchUsers,
} from "../../../redux/actions/userAction";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/reducers/userSlice";
import { useDispatch } from "react-redux";

//! Hết hàng -> thêm style
const ProductItems = ({ items = [] }) => {
    const { t, i18n } = useTranslation(["common", "errors", "store"]);
    let language = i18n.language;
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    console.log("User", user);

    const addToCart = async (product) => {
        console.log("Add to cart", product);

        const size = product.sizeProducts.filter(
            (sizeProduct) => sizeProduct.stock > 0
        );

        console.log("size", size);
        if (size.length === 0) {
            toast.warn(t("errors:validation.outOfStock"), {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return; // Kết thúc hàm nếu không có size khả dụng
        }

        const cartRequest = {
            products: [product.id],
            sizes: [size[0].size.name],
            quantities: [1],
        };

        console.log("cartRequest", cartRequest);

        // console.log("cartRequest", cartRequest);
        try {
            let response = await CartService.putCart(user.id, cartRequest);

            // console.log("response", response);

            if (response) {
                // dispatch(fetchUsers());
                toast.info(
                    t("common:action.success", {
                        type: t("common:action.add"),
                    }),
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
            toast.error(t("common:action.fail", { type: "Add" }), {
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

    return (
        <ProductItemsWrap>
            <ProductItemsList>
                {items?.map((item) => (
                    <ProductCard key={item.id}>
                        <ProductItem>
                            <ProductItemLink
                                to={{
                                    pathname: `/pages/client/product-detail/${item.id}`,
                                }}
                            >
                                {/*//* Image  */}
                                <ProductItemImageWrap>
                                    <ProductItemImage
                                        src={item.image}
                                        alt="catalog-item-img"
                                    />
                                </ProductItemImageWrap>

                                {/*//* Info */}
                                <div
                                    className="tw-flex tw-flex-col tw-items-center tw-gap-[5px]
                                    bg-gradient-to-r from-green-400 to-blue-500
                                 "
                                >
                                    {/*//* Title/Name  */}
                                    <ProductItemTitle
                                        className="tw-text-xl tw-font-medium"
                                        style={{}}
                                    >
                                        {language == "vn"
                                            ? item.name
                                            : item.enName}
                                    </ProductItemTitle>

                                    {/*//* Description  */}
                                    <div
                                        className="tw-flex tw-items-center tw-justify-center
                                    tw-min-h-[34px] tw-max-h-[34px]"
                                    >
                                        <ProductItemDescription className="">
                                            {language == "vn"
                                                ? item.description
                                                : item.enDescription}
                                        </ProductItemDescription>
                                    </div>

                                    {/*//* Price  */}
                                    <ProductItemPrice
                                        className="tw-text-2xl tw-font-semibold tw-mt-[10px] 
                                        tw-flex tw-items-center tw-justify-center"
                                        style={{}}
                                    >
                                        {`${item.price.toLocaleString()} VNĐ`}
                                    </ProductItemPrice>

                                    {/*//* Star  */}
                                    <StarRating rating={item.star} />
                                </div>
                            </ProductItemLink>

                            {/*//* Button  */}
                            <div className="tw-flex tw-flex-col tw-items-center tw-mt-[-7px]">
                                <Button
                                    variant="primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        addToCart(item);
                                    }}
                                    style={{ margin: "0" }}
                                >
                                    <span>{t("action.addToCart")}</span>
                                </Button>
                            </div>
                        </ProductItem>
                    </ProductCard>
                ))}
            </ProductItemsList>
        </ProductItemsWrap>
    );
};

ProductItems.propTypes = {
    items: PropTypes.array,
    // items: PropTypes.arrayOf(
    //     PropTypes.shape({
    //         src: PropTypes.string,
    //         title: PropTypes.string,
    //         price: PropTypes.string,
    //         description: PropTypes.string,
    //         colors: PropTypes.arrayOf(PropTypes.string),
    //         new: PropTypes.bool,
    //     })
    // ),
};

export default ProductItems;

// region STYLES
const ProductItemsWrap = styled.div`
    overflow: hidden;
    padding: 10px 0;
    width: 100%;
    /* background-color: red; */
`;

const ProductItemsList = styled.div`
    width: calc(100% + 20px);
    display: flex;
    flex-wrap: wrap;
    margin-right: -20px;
`;

const ProductCard = styled(Card)`
    padding: 0;
    width: 25%;

    @media screen and (max-width: 1500px) {
        width: 33.3333%;
    }

    @media screen and (max-width: 1200px) {
        width: 50%;
    }

    @media screen and (max-width: 992px) {
        width: 100%;
        height: auto;
    }
`;

const ProductItem = styled(CardBody)`
    margin-bottom: 30px;
    height: 440px;
    /* ${marginRight}: 30px; */
    ${marginRight}: 20px;
    position: relative;
    background-color: ${colorBackground};
    transition: all 0.3s;

    &:hover {
        transform: translateY(-8px); /* Move the card up by 10px on hover */
        box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1); /* Slight shadow effect for a raised look */
    }

    /* Pseudo-element to create a gap filler on hover */
    &:hover:after {
        content: "";
        display: block;
        height: 35px; /* The same height as the transform */
        width: calc(100% + 40px);
        transform: translateX(-20px);
        /* background-color: red; */
    }

    /* Hide the pseudo-element when not hovering */
    &:after {
        content: "";
        display: none; /* Hidden by default */
        transition: height 0.3s ease; /* Smooth height transition */
    }
`;

const ProductItemImageWrap = styled.div`
    width: 100%;
    height: 200px;
    display: flex;
    justify-content: center;
    /* margin-bottom: 30px; */
    margin-bottom: 10px;
    overflow: hidden;

    //* Thêm
    border-radius: 5px;
    /* box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -2px rgba(0, 0, 0, 0.1); */
`;

const ProductItemImage = styled.img`
    height: 100%;
    /* width: auto; */

    //* Thêm
    width: 200px;
    border-radius: 5px;
    object-fit: cover;
    /* box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -2px rgba(0, 0, 0, 0.1); */
`;

const ProductItemInfo = styled.div`
    text-align: ${left};
    position: relative;
    width: calc(100% - 90px);
`;

const ProductItemTitle = styled.h4`
    font-weight: 500;
    transition: all 0.3s;
    display: -webkit-box;
    -webkit-line-clamp: 1; /* Giới hạn số dòng hiển thị */
    -webkit-box-orient: vertical; /* Hướng của box */
    overflow: hidden; /* Ẩn nội dung vượt quá khung */
    text-overflow: ellipsis; /* Hiển thị dấu "..." */
`;

const ProductItemLink = styled(Link)`
    /* padding: 40px 30px; */
    padding: 15px 11.25px;
    display: block;
    padding-top: 0;

    //! hover title
    &:hover {
        text-decoration: none;

        ${ProductItemTitle} {
            /* color: ${colorAccent}; */
            color: ${colorBlue};
        }
    }
`;

const ProductItemDescription = styled.p`
    margin: 0;
    color: ${colorAdditional};
    line-height: 17px;

    //* thêm
    display: -webkit-box;
    -webkit-line-clamp: 2; // Giới hạn số dòng hiển thị
    -webkit-box-orient: vertical; // Hướng của box
    overflow: hidden; // Ẩn nội dung vượt quá khung
    text-overflow: ellipsis; // Hiển thị dấu "..."
    /* min-height: 34px; */
    text-align: center;
`;

// const ProductItemPrice = styled.p`
//     position: absolute;
//     top: 0;
//     ${right}: -90px;
//     line-height: 36px;
// `;

const ProductItemPrice = styled.p`
    display: -webkit-box;
    -webkit-line-clamp: 1; /* Giới hạn số dòng hiển thị */
    -webkit-box-orient: vertical; /* Hướng của box */
    overflow: hidden; /* Ẩn nội dung vượt quá khung */
    text-overflow: ellipsis; /* Hiển thị dấu "..." */
`;

const ProductItemOldPrice = styled.p`
    position: absolute;
    ${right}: -90px;
    top: 36px;
    line-height: 28px;
    color: ${colorAdditional};
    margin: 0;
    text-decoration: line-through;
`;

const ProductItemColor = styled.span`
    height: 10px;
    width: 10px;
    ${marginRight}: 8px;
    display: inline-block;
    border-radius: 50%;
    margin-top: 10px;
`;

const ProductItemLabel = styled.img`
    position: absolute;
    top: -2px;
    ${right}: 20px;
    width: 50px;
`;

// endregion
