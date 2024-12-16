import React from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "./ProductCard";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { selectProducts } from "@/redux/reducers/productSlice";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { Card, CardBody } from "@/shared/components/Card";
import Feedback from "./feedback/Feedback";
import Loading from "../../../shared/components/Loading";

const DetailPage = () => {
    const { id } = useParams();
    const products = useSelector(selectProducts);
    const product = products?.filter((product) => product.id == id)[0];

    if (!product) {
        return <Loading></Loading>;
    }

    return (
        <Container>
            <Row>
                <ProductCard product={product}></ProductCard>
            </Row>

            <Row>
                <Feedback product={product} />
            </Row>
        </Container>
    );
};

export default DetailPage;
