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

const ProductModal = ({ toggle, data, action }) => {
    {
        /* <div
                                        style={{
                                            maxHeight: "304px", //! edit here
                                            overflowY: "auto",
                                        }}
                                    >
                                        
                                    </div> */
    }

    const { t } = useTranslation(["common", "errors", "store"]);
    const dispatch = useDispatch();

    const [formData, setFormData] = useState(data);

    const submitForm = async (values) => {
        console.log("Root -----------");
        console.log(values);

        // Process values before dispatching
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
        // processedValues = { ...processedValues, user: user.id };

        try {
            let response;

            if (action === "new") {
                response = await dispatch(addCustomer(processedValues));
            } else if (action === "edit") {
                response = await dispatch(
                    updateCustomer(processedValues.no, processedValues)
                );
            } else {
                throw new Error("Error: No matching action");
            }

            if (response) {
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

    const validate = (values, t) => {
        const errors = {};
        const errorFields = [];
        if (!values.no) {
            errors.no = t("errors:validation.emptyId");
            errorFields.push("[General].no");
        }

        bigDecimalFields.forEach((field) => {
            const value = values[field];
            if (value !== undefined && value !== null && value !== "") {
                const error = validateBigDecimal(value, t);
                if (error) {
                    errors[field] = error;
                    errorFields.push(field);
                }
            }
        });

        integerFields.forEach((field) => {
            const value = values[field];
            if (value !== undefined && value !== null && value !== "") {
                const error = validateInteger(value, t);
                if (error) {
                    errors[field] = error;
                    errorFields.push(field);
                }
            }
        });

        console.log("Thiếu các fields sau: \n", errorFields.join("\n "));

        return errors;
    };

    const leftFields = [
        {
            label: t("store:product.name"),
            name: "name",
            type: "text",
            placeholder: `${enter} ${t("store:product.name")}...`,
            // disabled: true,
        },
        {
            label: t("store:product.description"),
            name: "description",
            type: "text",
            placeholder: `${enter} ${t("store:product.description")}...`,
            disabled: action === "edit",
        },
        {
            label: t("store:product.name"),
            name: "password",
            type: "text",
            placeholder: `${update} ${t("store:product.name")}...`,
        },
        {
            label: t("store:product.name"),
            name: "authorities",
            type: "multiSelect",
            options: [
                { value: "ROLE_USER", label: "User" },
                { value: "ROLE_ADMIN", label: "Admin" },
            ],
        },
    ];

    const rightFields = [
        {
            label: t("store:product.name"),
            name: "email",
            type: "text",
            placeholder: `${enter} ${t("store:product.name")}...`,
        },
        {
            label: t("store:product.name"),
            name: "name",
            type: "text",
            placeholder: `${enter} ${t("store:product.name")}...`,
        },
        {
            label: t("store:product.name"),
            name: "phone",
            type: "text",
            placeholder: `${enter} ${t("store:product.name")}...`,
        },
        {
            label: t("store:product.name"),
            name: "address",
            type: "text",
            placeholder: `${enter} ${t("store:product.name")}...`,
        },
    ];

    return (
        <Container>
            <Form
                onSubmit={submitForm}
                initialValues={formData}
                validate={(values) => validate(values, t)}
            >
                {({ handleSubmit, form }) => (
                    <FormContainer onSubmit={handleSubmit}>
                        <Col md={12} lg={12}>
                            <Card style={{ marginBottom: "0px" }}>
                                <CardBody>
                                    <General action={action} />
                                    <AddressContact />
                                    <Invoicing />
                                    <Payments />
                                    <Shipping />
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

                                    {/*//* Submit */}
                                    <Button
                                        variant="success"
                                        type="submit"
                                        onClick={() => console.log("submit")}
                                        style={{ margin: "0px" }}
                                    >
                                        {t("action.save")}
                                    </Button>
                                </FormButtonToolbar>
                            </Card>
                        </Col>
                    </FormContainer>
                )}
            </Form>
        </Container>
    );
};

ProductModal.propTypes = {
    toggle: PropTypes.func,
    action: PropTypes.string,
    data: PropTypes.object,
};

export default ProductModal;
