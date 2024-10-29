import React from "react";
import { Col } from "react-bootstrap";
import SearchResult from "./SearchResult";
import {
    Card,
    CardBody,
    CardTitleWrap,
    CardTitle,
} from "@/shared/components/Card";
import {
    FormContainer,
    FormGroup,
    FormGroupField,
    FormGroupIcon,
} from "@/shared/components/form/FormElements";
import { FaMagnifyingGlass } from "react-icons/fa6";
import results from "./results";

const Feedback = ({ product = {} }) => (
    <Col md={12} lg={12}>
        <Card>
            <CardBody>
                <CardTitleWrap>
                    <CardTitle>Feedbacks</CardTitle>
                </CardTitleWrap>
                <FormContainer>
                    <FormGroup>
                        <FormGroupField>
                            <input
                                name="search"
                                type="text"
                                placeholder="Search..."
                                defaultValue=""
                            />
                            <FormGroupIcon>
                                <FaMagnifyingGlass />
                            </FormGroupIcon>
                        </FormGroupField>
                    </FormGroup>
                </FormContainer>

                <div>
                    {product.feedBacks.map((feedback) => (
                        <SearchResult key={feedback.id} data={feedback} />
                    ))}
                </div>
            </CardBody>
        </Card>
    </Col>
);

export default Feedback;
