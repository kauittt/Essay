import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { Field, Form } from "react-final-form";
import AccountOutlineIcon from "mdi-react/AccountOutlineIcon";
import renderCheckBoxField from "@/shared/components/form/CheckBox";
import PasswordField from "@/shared/components/form/Password";
import FormField from "@/shared/components/custom/form/FormField";

import {
    FormGroup,
    FormGroupField,
    FormGroupIcon,
    FormGroupLabel,
} from "@/shared/components/form/FormElements";
import {
    AccountButton,
    AccountForgotPassword,
    LoginForm,
} from "@/shared/components/account/AccountElements";
import { useTranslation } from "react-i18next";
import CustomModal from "./../../../shared/components/custom/modal/CustomModal";

const LogInForm = ({ onSubmit, setPurpose }) => {
    const { t } = useTranslation(["common", "errors", "store"]);

    const validate = (values, t) => {
        const errors = {};
        if (!values.username) {
            errors.username = t("errors:validation.required");
        }
        if (!values.password) {
            errors.password = t("errors:validation.required");
        }
        return errors;
    };

    return (
        <Form onSubmit={onSubmit} validate={(values) => validate(values, t)}>
            {({ handleSubmit }) => (
                <LoginForm onSubmit={handleSubmit}>
                    {/*//* Username  */}
                    <FormGroup>
                        <FormGroupLabel>{t("login.username")}</FormGroupLabel>
                        <FormGroupField>
                            <FormGroupIcon>
                                <AccountOutlineIcon />
                            </FormGroupIcon>
                            <Field
                                name="username"
                                component={FormField}
                                type="text"
                                placeholder={t("login.username")}
                            />
                        </FormGroupField>
                    </FormGroup>

                    {/*//* Password */}
                    <FormGroup>
                        <FormGroupLabel>{t("login.password")}</FormGroupLabel>
                        <FormGroupField>
                            <Field
                                name="password"
                                component={PasswordField}
                                placeholder={t("login.username")}
                                className="input-without-border-radius"
                                keyIcon
                            />
                        </FormGroupField>
                    </FormGroup>

                    {/*//* Forgot password  */}
                    <div className="tw-w-[100%] tw-flex tw-justify-end">
                        <CustomModal
                            color="secondary"
                            title={t("store:forgetPassword.modalTitle")}
                            btn={t("store:forgetPassword.title")}
                            action="new"
                            component="forgetPassword"
                        />
                    </div>

                    {/*//* Sign in  */}
                    <AccountButton
                        className="tw-mt-[15px]"
                        as="button"
                        variant="primary"
                        type="submit"
                    >
                        {t("login.sign_in")}
                    </AccountButton>

                    {/*//* Register */}
                    <AccountButton
                        as="button"
                        variant="outline-primary"
                        onClick={(e) => {
                            e.preventDefault();
                            setPurpose("register");
                        }}
                    >
                        {t("login.create_account")}
                    </AccountButton>
                </LoginForm>
            )}
        </Form>
    );
};

LogInForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
};

export default LogInForm;
