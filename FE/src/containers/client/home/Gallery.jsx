import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import "@brainhubeu/react-carousel/lib/style.css";
import {
    colorAccent,
    colorAdditional,
    colorAdditionalHover,
    colorBackground,
} from "@/utils/palette";
import { marginRight, left } from "@/utils/directions";
import ProductItems from "./ProductItems";

const Gallery = ({ products, tags }) => {
    const [renderProduct, setRenderProduct] = useState(products);
    const [currentTag, setCurrentTag] = useState("all");
    // const [tag] = useState(tags);

    useEffect(() => {
        setRenderProduct(products);
    }, [products]);

    const onFilter = (item) => {
        if (item === "all") {
            setRenderProduct(products);
            setCurrentTag("all");
        } else {
            setRenderProduct(
                products.filter((t) =>
                    t.categories.some((category) => category === item)
                )
            );
            setCurrentTag(item);
        }
    };

    console.log("products", products);
    console.log("tags", tags);
    console.log("renderProduct", renderProduct);

    return (
        <GalleryWrap>
            <GalleryButtons>
                {/*//* Button  */}
                <GalleryButton
                    type="button"
                    active={currentTag === "all"}
                    onClick={() => onFilter("all")}
                >
                    all
                </GalleryButton>
                {tags?.map((btn) => (
                    <GalleryButton
                        className="tw-text-2xl"
                        key={`index_${btn.tag}`}
                        type="button"
                        active={btn.tag === currentTag}
                        onClick={() => onFilter(btn.tag)}
                    >
                        {btn.title}
                    </GalleryButton>
                ))}
            </GalleryButtons>

            {/*//* List */}
            <ProductItems items={renderProduct}></ProductItems>
        </GalleryWrap>
    );
};

Gallery.propTypes = {
    products: PropTypes.array,
    tags: PropTypes.arrayOf(
        PropTypes.shape({
            tag: PropTypes.string,
            title: PropTypes.string,
        })
    ),
};

export default Gallery;

// region

const GalleryWrap = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    img {
        width: 100%;
    }
`;

const GalleryButtons = styled.div`
    width: 100%;
    margin-bottom: 20px;
    text-align: ${left};

    //* Thêm
    padding: 15px 10px;
    border-radius: 5px;
    background-color: ${colorBackground};
`;

const GalleryButton = styled.button`
    background: transparent;
    padding: 0;
    text-transform: uppercase;
    color: ${(props) => (props.active ? colorAccent : colorAdditional)};
    font-size: 14px;
    border: none;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
    ${marginRight}: 20px;

    &:focus,
    &:active {
        outline: none;
    }

    &:hover {
        color: ${colorAdditionalHover};
    }
`;

const GalleryImageButton = styled.button`
    width: 100%;
    overflow: hidden;
    cursor: pointer;
    border: none;
    padding: 0;

    @media screen and (min-width: 768px) {
        width: 50%;
    }

    @media screen and (min-width: 992px) {
        width: 25%;
    }
`;

// endregion
