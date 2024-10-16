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
import { selectCategories } from "@/redux/reducers/categorySlice";

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
    const enter = t("action.enter");
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

    const categories = useSelector(selectCategories);
    console.log("Categories", categories);
    console.log(
        "Check",
        categories.map((category) => {
            return {
                value: category.id,
                label: category.name,
            };
        })
    );

    const leftFields = [
        {
            label: t("store:product.name"),
            name: "name",
            type: "text",
            placeholder: `${enter} ${t("store:product.name")}...`,
        },
        {
            label: t("store:product.description"),
            name: "description",
            type: "text",
            placeholder: `${enter} ${t("store:product.description")}...`,
        },
        {
            label: t("store:product.category"),
            name: "category",
            type: "multiSelect",
            option: [
                {
                    value: "bcba3276-a40d-494a-b9fc-18753f43cf21",
                    label: "Event",
                },
                {
                    value: "3ceb71a5-0d75-4f82-aef2-983f0298eb25",
                    label: "General",
                },
                {
                    value: "6c568b8f-f003-47f6-8dd8-d321bc133771",
                    label: "New Year",
                },
            ],
            // options: [
            //     { value: "ROLE_USER", label: "User" },
            //     { value: "ROLE_ADMIN", label: "Admin" },
            // ],
        },
    ];

    const rightFields = [
        {
            label: t("store:product.price"),
            name: "price",
            type: "text",
            placeholder: `${enter} ${t("store:product.price")}...`,
        },
        {
            label: t("store:product.stock"),
            name: "stock",
            type: "text",
            placeholder: `${enter} ${t("store:product.stock")}...`,
        },
        {
            label: t("store:product.image"),
            name: "image",
            type: "text",
            placeholder: `${enter} ${t("store:product.image")}...`,
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
                                    <CustomForm
                                        leftFields={leftFields}
                                        rightFields={rightFields}
                                        min={3}
                                        max={3}
                                        isButton={false}
                                    ></CustomForm>
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
