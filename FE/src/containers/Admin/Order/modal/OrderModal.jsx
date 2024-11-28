import React, { useState } from "react";
import {
    FormContainer,
    FormButtonToolbar,
} from "@/shared/components/form/FormElements";
import { Col, Container, Row } from "react-bootstrap";
import { Button } from "@/shared/components/Button";
import { Form } from "react-final-form";
import { Card, CardBody } from "@/shared/components/Card";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import CustomForm from "@/shared/components/custom/form/CustomForm";
import { addProduct, updateProduct } from "@/redux/actions/productAction";
import { createGlobalStyle } from "styled-components";
import { fetchVouchers } from "@/redux/actions/voucherAction";
import OrderDetail from "./OrderDetail";
import InvoiceDetail from "./InvoiceDetail";
import ListProduct from "./ListProduct";
import {
    updateCurrentUserOrder,
    updateOrder,
} from "../../../../redux/actions/orderAction";
import { fetchProducts } from "./../../../../redux/actions/productAction";
import { fetchCategories } from "./../../../../redux/actions/categoryAction";
import { CANCEL, CREATED, DONE } from "../../../ConstKey";
import { fetchCurrentUser } from "../../../../redux/actions/userAction";

const bigDecimalFields = ["price"];
const integerFields = ["stock"];

const bigDecimalRegex = /^\d+(\.\d{1,20})?$/;

const validateBigDecimal = (value, t) => {
    if (!bigDecimalRegex.test(value)) {
        return t("errors:validation.invalidNumber");
    }
    if (parseFloat(value) < 0) {
        return t("errors:validation.negativeNumber");
    }
    return undefined;
};

const validateInteger = (value, t) => {
    if (!Number.isInteger(Number(value))) {
        return t("errors:validation.invalidNumber");
    }
    if (parseInt(value) < 0) {
        return t("errors:validation.negativeNumber");
    }
    return undefined;
};

const OrderModal = ({ toggle, data, action }) => {
    const { t } = useTranslation(["common", "errors", "store"]);
    const enter = t("action.enter");
    const dispatch = useDispatch();

    const [formData, setFormData] = useState(data);

    const submitForm = async (values) => {
        console.log("Root -----------");
        console.log(values);

        //* Process values before dispatching
        let processedValues = Object.keys(values).reduce((acc, key) => {
            if (
                typeof values[key] === "object" &&
                values[key] !== null &&
                "value" in values[key]
            ) {
                acc[key] = values[key].value;
            } else {
                if (typeof values[key] === "boolean") {
                    acc[key] = values[key] ? 1 : 0;
                } else {
                    acc[key] = values[key];
                }
            }
            return acc;
        }, {});

        console.log("process -----------");
        console.log(processedValues);

        const actionText =
            action === "new" ? t("common:action.add") : t("common:action.edit");

        try {
            let response;
            if (action === "edit") {
                if (isStaff) {
                    response = await dispatch(
                        updateOrder(processedValues.id, processedValues)
                    );
                } else {
                    response = await dispatch(
                        updateCurrentUserOrder(
                            processedValues.id,
                            processedValues
                        )
                    );
                }
            } else {
                throw new Error("Error: No matching action");
            }

            if (response) {
                dispatch(fetchVouchers());
                dispatch(fetchProducts());
                dispatch(fetchCategories());
                toast.info(t("common:action.success", { type: actionText }), {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                toggle();
            }
        } catch (e) {
            console.log(e);
            toast.error(t("common:action.fail", { type: actionText }), {
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

    console.log("Form data", formData);

    const flattenedData = formData.orderProducts
        ?.map(({ product, quantity, size }) => ({
            ...product,
            quantity,
            size,
        }))
        .flat();

    console.log("flattenedData", flattenedData);

    const handleCancelOrder = async () => {
        const actionText = t("common:action.cancel");

        try {
            let response = await dispatch(
                updateCurrentUserOrder(formData.id, {
                    status: CANCEL,
                })
            );

            //! Hoàn lại stock (Bên OrderDetail nữa)

            if (response) {
                dispatch(fetchVouchers());
                dispatch(fetchProducts());
                dispatch(fetchCategories());
                dispatch(fetchCurrentUser());
                toast.info(t("common:action.success", { type: actionText }), {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                toggle();
            }
        } catch (e) {
            console.log(e);
            toast.error(t("common:action.fail", { type: actionText }), {
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

    const userLocal = JSON.parse(localStorage.getItem("user")); //* Local
    const isStaff = userLocal.roles[0] !== "ROLE_USER";
    const isAdmin = userLocal.roles[0] == "ROLE_ADMIN";
    const isEditAble = formData.status == CREATED;
    const isCompleted = formData.status == DONE || formData.status == CANCEL;

    return (
        <Container>
            <Form onSubmit={submitForm} initialValues={formData}>
                {({ handleSubmit, form }) => {
                    return (
                        <FormContainer onSubmit={handleSubmit}>
                            <Col md={12} lg={12}>
                                <Card style={{ marginBottom: "0px" }}>
                                    <CardBody>
                                        <OrderDetail
                                            order={formData}
                                        ></OrderDetail>
                                        <ListProduct
                                            data={flattenedData}
                                        ></ListProduct>
                                        <InvoiceDetail></InvoiceDetail>
                                    </CardBody>

                                    {/*//* Button  */}
                                    <FormButtonToolbar
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            gap: "20px",
                                        }}
                                    >
                                        {/*//* Cancle  */}
                                        <Button
                                            variant="secondary"
                                            onClick={toggle}
                                            style={{ margin: "0px" }}
                                        >
                                            {t("action.cancel")}
                                        </Button>

                                        {/*//* Hủy đơn khi là user  */}
                                        {!isStaff && isEditAble && (
                                            <Button
                                                variant="danger"
                                                onClick={handleCancelOrder}
                                                style={{ margin: "0px" }}
                                            >
                                                {`${t("action.cancel")} ${t(
                                                    "store:order.title"
                                                )}`}
                                            </Button>
                                        )}

                                        {/*//* Submit */}
                                        <Button
                                            variant="success"
                                            type="submit"
                                            onClick={() =>
                                                console.log("submit")
                                            }
                                            style={{ margin: "0px" }}
                                            disabled={
                                                (!isEditAble && !isStaff) ||
                                                isCompleted
                                            }
                                        >
                                            {t("action.save")}
                                        </Button>
                                    </FormButtonToolbar>
                                </Card>
                            </Col>
                        </FormContainer>
                    );
                }}
            </Form>
        </Container>
    );
};

OrderModal.propTypes = {
    toggle: PropTypes.func,
    action: PropTypes.string,
    data: PropTypes.object,
};

export default OrderModal;
