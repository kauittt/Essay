import React from "react";
import { Col } from "react-bootstrap";
import {
    Card,
    CardBody,
    CardTitleWrap,
    CardTitle,
} from "@/shared/components/Card";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectProducts } from "@/redux/reducers/productSlice";
import { selectCategories } from "@/redux/reducers/categorySlice";
import Gallery from "./Gallery";
import styled from "styled-components";
import { colorBackground } from "@/utils/palette";
import { borderRadius, shadow } from "@/utils/styles";

const HomePage = () => {
    const { t, i18n } = useTranslation(["common", "errors", "store"]);
    let language = i18n.language;

    const products = useSelector(selectProducts);
    const categories = useSelector(selectCategories);
    // console.log("Products", products);
    // console.log("categories", categories);
    const tags = categories?.map((category) => {
        return {
            tag: category.name,
            title: language == "en" ? category.enName : category.name,
        };
    });

    // console.log("Tag", tags);

    return (
        <Col md={12} lg={12}>
            <Card>
                <MyCardBody>
                    <Gallery products={products || []} tags={tags || []} />
                </MyCardBody>
            </Card>
        </Col>
    );
};

const MyCardBody = styled(Card.Body)`
    height: 100%;
    /* background-color: ${colorBackground}; */
    /* border-radius: ${borderRadius}; */ //!
    border-radius: 5px;
    box-shadow: ${shadow};
    padding: 0 12px;
`;

export default HomePage;
