import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styled from "styled-components";
import { Card, CardBody } from "@/shared/components/Card";
import { Button, ButtonToolbar } from "@/shared/components/Button";
import { Table } from "@/shared/components/TableElements";
import { colorAdditional, colorBackground, logoImg } from "@/utils/palette";
import { marginRight, marginLeft, left, right } from "@/utils/directions";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    selectTotalUsers,
    selectUser,
} from "../../../redux/reducers/userSlice";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { CardTitleWrap, CardTitle } from "@/shared/components/Card";
import {
    FormContainer,
    FormButtonToolbar,
} from "@/shared/components/form/FormElements";
import { Form } from "react-final-form";
import { useTranslation } from "react-i18next";
import CustomForm from "./../../../shared/components/custom/form/CustomForm";
import { current } from "@reduxjs/toolkit";
import { CREATED } from "./../../ConstKey";
import OrderService from "./../../../services/OrderService";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import InvoiceService from "../../../services/InvoiceService";
import { fetchOrders } from "../../../redux/actions/orderAction";

const formatDate = (date) => {
    const year = date.getFullYear(); // Gets the full year (e.g., 2024)
    const month = date.getMonth() + 1; // Gets the month (0-11, hence adding 1)
    const day = date.getDate(); // Gets the day of the month
    const hours = date.getHours(); // Gets the hours
    const minutes = date.getMinutes(); // Gets the minutes
    const seconds = date.getSeconds(); // Gets the seconds

    // Ensure the month, day, hours, minutes, and seconds are zero-padded
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    // return `${year}-${formattedMonth}-${formattedDay} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`; // Formats to yyyy-mm-dd hh:mm:ss
    return `${year}-${formattedMonth}-${formattedDay}`; // Formats to yyyy-mm-dd hh:mm:ss
};

const InvoicePage = () => {
    const { t } = useTranslation(["common", "errors", "store"]);
    const enter = t("action.enter");
    const update = t("action.update");
    const dispatch = useDispatch();

    const user = useSelector(selectUser);
    const totalUsers = useSelector(selectTotalUsers);
    const location = useLocation();
    const history = useHistory();

    useEffect(() => {}, [totalUsers]);

    const { selectedProducts, subTotal, shippingFee } = location.state || {};
    const currentUser = totalUsers?.find((u) => u.username === user.username);

    //* Navigate Cart
    if (!selectedProducts) {
        history.push("/pages/client/cart");
    }

    console.log("currentUser", currentUser);
    console.log("selectedProducts at Invoice", selectedProducts);
    console.log("shippingFee", shippingFee);

    //* Form
    const leftFields = [
        {
            label: "Create Date",
            name: "createDate",
            type: "text",
            placeholder: `Enter create date...`,
            disabled: true,
        },
        {
            label: t("store:user.email"),
            name: "email",
            type: "text",
            placeholder: `${enter} ${t("store:user.email")}...`,
        },
    ];

    const rightFields = [
        {
            label: "Name",
            name: "name",
            type: "text",
            placeholder: "Enter name",
        },
        {
            label: t("store:user.phone"),
            name: "phone",
            type: "text",
            placeholder: `${enter} ${t("store:user.phone")}...`,
        },
        {
            label: t("store:user.address"),
            name: "address",
            type: "text",
            placeholder: `${enter} ${t("store:user.address")}...`,
        },
    ];

    const submitForm = async (values) => {
        values.status = CREATED;
        values.user = currentUser.id;
        values.quantities = selectedProducts.map((product) => product.quantity);
        values.sizes = selectedProducts.map((product) => product.size);
        values.products = selectedProducts.map((product) => product.product.id);

        console.log("Submit values");
        console.log("Information", values);
        console.log("Product list", selectedProducts);
        console.log("-----------");

        try {
            let response;

            const orderId = await OrderService.postOrder(values);
            console.log("orderId", orderId);

            const invoiceRequest = {
                order: orderId.data.id,
                createDate: createDate,
                discountAmount: discountAmount,
                totalAmount: subTotal + shippingFee,
                paymentMethod: paymentMethod,
            };

            console.log("invoiceRequest", invoiceRequest);
            response = await InvoiceService.postInvoice(invoiceRequest);

            if (response) {
                dispatch(fetchOrders());
                history.push("/pages/client/product");
                toast.info(t("common:action.success", { type: "Add" }), {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
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

    const createDate = new Date();
    const discountAmount = 0;
    const paymentMethod = "COD";
    const initValue = {
        createDate: formatDate(createDate),
        name: currentUser?.name,
        email: currentUser?.email,
        phone: currentUser?.phone,
        address: currentUser?.address,
    };

    const validate = (values, t) => {
        // console.log("Validate values", values);
        const errors = {};

        const requiredFields = ["email", "name", "phone", "address"];

        //* Required
        requiredFields.forEach((field) => {
            if (!values[field]) {
                errors[field] = t("errors:validation.required");
            }
        });

        //* Phone
        if (!/^0\d{9}$/.test(values.phone)) {
            errors.phone = t("errors:validation.invalidPhone");
        }

        //* Email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
            errors.email = t("errors:validation.invalidEmail");
        }

        // console.log("errors", errors);
        return errors;
    };

    // <InvoiceLogo />

    // <InvoiceHeadRight>
    //     <InvoiceLogo />
    //     <h4>Invoice #2308</h4>
    //     <InvoiceDate>{formatDate()}</InvoiceDate>
    //     <p className="tw-text-sm">{currentUser?.name}</p>
    //     <p className="tw-text-sm">{currentUser?.address}</p>
    //     <p className="tw-text-sm">{currentUser?.phone}</p>
    //     <p className="tw-text-sm">{currentUser?.email}</p>
    // </InvoiceHeadRight>;
    return (
        <Container>
            <Form
                onSubmit={submitForm}
                initialValues={initValue}
                validate={(values) => validate(values, t)}
            >
                {({ handleSubmit, form }) => {
                    return (
                        <FormContainer onSubmit={handleSubmit}>
                            <Col md={12} lg={12}>
                                <Row>
                                    <Card style={{ marginBottom: "0px" }}>
                                        <InvoiceCardBody>
                                            <Button
                                                variant="secondary"
                                                onClick={() =>
                                                    history.push(
                                                        "/pages/client/cart"
                                                    )
                                                }
                                                style={{
                                                    margin: "0px",
                                                    marginBottom: "20px",
                                                }}
                                            >
                                                Back
                                            </Button>
                                            <div className="tw-flex tw-justify-between tw-items-center">
                                                <CardTitleWrap>
                                                    <CardTitle>
                                                        Information
                                                    </CardTitle>
                                                </CardTitleWrap>
                                            </div>

                                            <CustomForm
                                                leftFields={leftFields}
                                                rightFields={rightFields}
                                                min={4}
                                                max={4}
                                                isButton={false}
                                            ></CustomForm>

                                            <CardTitleWrap>
                                                <CardTitle>Products</CardTitle>
                                            </CardTitleWrap>
                                            <Table bordered responsive>
                                                {/*//* Header  */}
                                                <thead>
                                                    <tr>
                                                        <th>No</th>
                                                        <th>Item Name</th>
                                                        <th>Size</th>
                                                        <th>Quantity</th>
                                                        <th>Price</th>
                                                        <th>Total</th>
                                                    </tr>
                                                </thead>

                                                {/*//* Prodct List  */}
                                                <tbody>
                                                    {selectedProducts.map(
                                                        (item, index) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    {index + 1}
                                                                </td>
                                                                <td>
                                                                    {
                                                                        item
                                                                            .product
                                                                            .name
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {item.size}
                                                                </td>
                                                                <td>
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {`${item.product.price.toLocaleString()} VNĐ`}
                                                                </td>
                                                                <td>
                                                                    {`${(
                                                                        item.quantity *
                                                                        item
                                                                            .product
                                                                            .price
                                                                    ).toLocaleString()} VNĐ`}
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </Table>

                                            {/*//* Total  */}
                                            <InvoiceTotal>
                                                <Subtotal>
                                                    Sub-total:
                                                    <span className="tw-font-semibold">
                                                        {subTotal.toLocaleString()}{" "}
                                                        VNĐ
                                                    </span>
                                                </Subtotal>
                                                <p>
                                                    Shipping fee:{" "}
                                                    <span className="tw-font-semibold">
                                                        {shippingFee.toLocaleString()}{" "}
                                                        VNĐ
                                                    </span>
                                                </p>
                                                <InvoiceGrandTotal>
                                                    Total Price:{" "}
                                                    <span className="tw-font-semibold">
                                                        {(
                                                            subTotal +
                                                            shippingFee
                                                        ).toLocaleString()}{" "}
                                                        VNĐ
                                                    </span>
                                                </InvoiceGrandTotal>
                                                <InvoiceToolbar>
                                                    {/*//* Button  */}
                                                    <FormButtonToolbar
                                                        style={{
                                                            width: "100%",
                                                            display: "flex",
                                                            justifyContent:
                                                                "flex-end",
                                                            alignItems:
                                                                "center",
                                                            gap: "20px",
                                                        }}
                                                    >
                                                        {/*//* Submit */}
                                                        <Button
                                                            variant="primary"
                                                            type="submit"
                                                            onClick={() =>
                                                                console.log(
                                                                    "submit"
                                                                )
                                                            }
                                                            style={{
                                                                margin: "0px",
                                                            }}
                                                        >
                                                            Confirm
                                                        </Button>
                                                    </FormButtonToolbar>
                                                </InvoiceToolbar>
                                            </InvoiceTotal>
                                        </InvoiceCardBody>
                                    </Card>
                                </Row>
                            </Col>
                        </FormContainer>
                    );
                }}
            </Form>
        </Container>
    );
};

export default InvoicePage;

// region STYLES

const Subtotal = styled.p`
    margin-bottom: 10px;
`;

const InvoiceCardBody = styled(CardBody)`
    padding: 35px;
    text-align: ${left};
    background-color: ${colorBackground};

    @media screen and (min-width: 768px) {
        padding: 50px;
    }
`;

const InvoiceHead = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
    flex-wrap: wrap;

    p {
        color: ${colorAdditional};
    }
`;

const InvoiceHeadRight = styled.div`
    width: 100%;
    margin-top: 30px;

    @media screen and (min-width: 768px) {
        width: auto;
        text-align: ${right};
        margin-top: 0;
    }
`;

const InvoiceDate = styled.h3`
    margin-bottom: 10px;
`;

const InvoiceTotal = styled.div`
    text-align: ${right};
    margin-top: 15px;
`;

const InvoiceGrandTotal = styled.p`
    font-weight: 500;
    font-size: 20px;
    margin-top: 15px;
    margin-bottom: 30px;
`;

const InvoiceToolbar = styled(ButtonToolbar)`
    justify-content: flex-end;

    button {
        ${marginLeft}: 15px;
        ${marginRight}: 0;
    }
`;

const InvoiceLogo = styled.div`
    /* width: 120px;
    height: 16px; */
    width: 240px;
    height: 32px;
    /* margin-bottom: 10px; */
    background-repeat: no-repeat;
    background-position-y: center;
    background-position-x: left;
    background-size: contain;
    background-image: ${logoImg};
`;

// endregion
