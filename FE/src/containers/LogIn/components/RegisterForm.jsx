import React, { useState } from "react";
import {
    FormContainer,
    FormButtonToolbar,
} from "@/shared/components/form/FormElements";
import { Col, Container, Row } from "react-bootstrap";
import { Form } from "react-final-form";
import { Card, CardBody } from "@/shared/components/Card";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import CustomForm from "@/shared/components/custom/form/CustomForm";
import { AccountButton } from "@/shared/components/account/AccountElements";

const RegisterForm = ({ onSubmit, setPurpose }) => {
    const { t } = useTranslation(["common", "errors", "store"]);
    const enter = t("action.enter");
    const update = t("action.update");
    const action = "new";

    const dispatch = useDispatch();

    const validate = (values, t) => {
        // console.log("Validate values", values);
        const errors = {};

        const requiredFields = [
            "username",
            "password",
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
            label: t("store:user.email"),
            name: "email",
            type: "text",
            placeholder: `${enter} ${t("store:user.email")}`,
        },
    ];

    const rightFields = [
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
                onSubmit={onSubmit}
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
                                            // gap: "20px",
                                        }}
                                    >
                                        {/*//* Register */}
                                        <AccountButton
                                            className="tw-mt-[15px]"
                                            type="submit"
                                            variant="primary"
                                            as="button"
                                        >
                                            {t("login.create_account")}
                                        </AccountButton>

                                        {/*//* Sign in  */}
                                        <AccountButton
                                            as="button"
                                            variant="outline-primary"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setPurpose("login");
                                            }}
                                        >
                                            {t("login.sign_in")}
                                        </AccountButton>
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

RegisterForm.propTypes = {
    onSubmit: PropTypes.func,
};

export default RegisterForm;
