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
import CustomForm from "@/shared/components/custom/form/CustomForm";
import { addProduct, updateProduct } from "@/redux/actions/productAction";
import { createGlobalStyle } from "styled-components";
import { fetchVouchers } from "@/redux/actions/voucherAction";
import { addUser, updateUser } from "../../../../redux/actions/userAction";

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

const UserModal = ({ toggle, data, action }) => {
    const { t } = useTranslation(["common", "errors", "store"]);
    const enter = t("action.enter");
    const update = t("action.update");

    const dispatch = useDispatch();

    const [formData, setFormData] = useState(data);

    const submitForm = async (values) => {
        // console.log("Root -----------");
        // console.log(values);

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

        if (typeof processedValues.authorities === "string") {
            processedValues.authorities = [processedValues.authorities];
        }

        // console.log("process -----------");
        // console.log(processedValues);

        const actionText =
            action === "new" ? t("common:action.add") : t("common:action.edit");

        try {
            let response;

            if (action === "new") {
                response = await dispatch(addUser(processedValues));
            } else if (action === "edit") {
                response = await dispatch(
                    updateUser(processedValues.id, processedValues)
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
            // console.log(e);
            const message = e.response.data.message;
            // console.log("message", message);

            const field = message.includes("Email")
                ? t("store:user.email")
                : message.includes("Username")
                ? t("store:user.username")
                : message.includes("Phone")
                ? t("store:user.phone")
                : null;

            const myError = field
                ? t("errors:validation.fieldExisted", { field: field })
                : t("common:action.fail", { type: actionText });

            toast.error(myError, {
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
        // console.log("Validate values", values);
        const errors = {};

        const requiredFields = [
            "username",

            "email",
            "name",
            "phone",
            "address",
        ];
        //* Empty
        requiredFields.forEach((field) => {
            if (!values[field]) {
                errors[field] = t("errors:validation.required");
            }
        });

        if (action == "new" && !values.password) {
            errors.password = t("errors:validation.empty");
        }

        if (!values.authorities || values.authorities.length === 0) {
            errors.authorities = t("errors:validation.empty");
        }

        //* Validate
        if (!/^0\d{9}$/.test(values.phone)) {
            errors.phone = t("errors:validation.invalidPhone");
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
            errors.email = t("errors:validation.invalidEmail");
        }

        const passwordPattern =
            /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}$/;
        if (values.password && !passwordPattern.test(values.password)) {
            errors.password = t("errors:validation.invalidFormatPassword");
        }

        // console.log("Erros", errors);
        return errors;
    };

    const leftFields = [
        {
            label: t("store:user.username"),
            name: "username",
            type: "text",
            placeholder: `${enter} ${t("store:user.username")}`,
        },
        {
            label: t("store:user.password"),
            name: "password",
            type: "text",
            placeholder: `${update} ${t("store:user.password")}`,
        },
        {
            label: t("store:user.authorities"),
            name: "authorities",
            type: "select",
            options: [
                { value: "ROLE_STAFF", label: t("store:user.staff") },
                { value: "ROLE_ADMIN", label: t("store:user.admin") },
                { value: "ROLE_USER", label: t("store:user.user") },
            ],
        },
    ];

    const rightFields = [
        {
            label: t("store:user.email"),
            name: "email",
            type: "text",
            placeholder: `${enter} ${t("store:user.email")}`,
        },
        {
            label: t("store:user.name"),
            name: "name",
            type: "text",
            placeholder: `${enter} ${t("store:user.name")}`,
        },
        {
            label: t("store:user.phone"),
            name: "phone",
            type: "text",
            placeholder: `${enter} ${t("store:user.phone")}`,
        },
        {
            label: t("store:user.address"),
            name: "address",
            type: "text",
            placeholder: `${enter} ${t("store:user.address")}`,
        },
    ];

    return (
        <Container>
            <Form
                onSubmit={submitForm}
                initialValues={formData}
                validate={(values) => validate(values, t)}
            >
                {({ handleSubmit, form }) => {
                    return (
                        <FormContainer onSubmit={handleSubmit}>
                            <Col md={12} lg={12}>
                                <Card style={{ marginBottom: "0px" }}>
                                    <CardBody>
                                        <CustomForm
                                            leftFields={leftFields}
                                            rightFields={rightFields}
                                            min={4}
                                            max={4}
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
                                            // onClick={() =>
                                            //     console.log("submit")
                                            // }
                                            style={{ margin: "0px" }}
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

UserModal.propTypes = {
    toggle: PropTypes.func,
    action: PropTypes.string,
    data: PropTypes.object,
};

export default UserModal;
