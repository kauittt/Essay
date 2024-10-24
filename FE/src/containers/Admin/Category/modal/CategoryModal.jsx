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
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { addCategory, updateCategory } from "@/redux/actions/categoryAction";
import FormInput from "@/shared/components/custom/form/FormInput";
import { fetchProducts } from "@/redux/actions/productAction";

const CategoryModal = ({ toggle, data, action }) => {
    const { t } = useTranslation(["common", "errors", "store"]);
    const dispatch = useDispatch();

    const enter = t("action.enter");
    const [formData, setFormData] = useState(data);

    const submitForm = async (values) => {
        console.log("Default values", values);

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

        console.log("Processed values", processedValues);

        const actionText =
            action === "new" ? t("common:action.add") : t("common:action.edit");

        try {
            let response;

            if (action === "new") {
                response = await dispatch(addCategory(processedValues));
            } else if (action === "edit") {
                response = await dispatch(
                    updateCategory(processedValues.id, processedValues)
                );
            } else {
                throw new Error("Error: No matching action");
            }

            if (response) {
                dispatch(fetchProducts());
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

        if (!values.name) {
            errors.name = t("errors:validation.empty");
        }

        return errors;
    };

    const fields = [
        {
            label: t("store:category.name"),
            name: "name",
            type: "text",
            placeholder: `${enter} ${t("store:category.name")}...`,
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
                                    <FormInput data={nameField}></FormInput>
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

CategoryModal.propTypes = {
    toggle: PropTypes.func,
    action: PropTypes.string,
    data: PropTypes.object,
};

export default CategoryModal;
