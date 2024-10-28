import React from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "./ProductCard";
import { Col, Container, Row } from "react-bootstrap";
import RelatedItems from "./RelatedItems";
import { useSelector } from "react-redux";
import { selectProducts } from "@/redux/reducers/productSlice";
import { useParams } from "react-router-dom/cjs/react-router-dom";

const DetailPage = () => {
    const { id } = useParams();
    const products = useSelector(selectProducts);
    const product = products?.filter((product) => product.id == id)[0];

    if (!product) {
        return <div>No product data available.</div>;
    }

    return (
        <Container>
            <Row>
                <ProductCard product={product}></ProductCard>
            </Row>

            <Row>
                <Col md={12}>
                    <h3 className="page-title page-title--not-last">
                        Related Items
                    </h3>
                </Col>
            </Row>

            <Row>
                <RelatedItems />
            </Row>
        </Container>
    );
};

export default DetailPage;
