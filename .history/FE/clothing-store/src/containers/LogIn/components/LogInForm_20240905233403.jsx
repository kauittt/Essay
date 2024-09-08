import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { Field, Form } from "react-final-form";
import AccountOutlineIcon from "mdi-react/AccountOutlineIcon";
import renderCheckBoxField from "@/shared/components/form/CheckBox";
import PasswordField from "@/shared/components/form/Password";
import FormField from "@/shared/components/form/FormField";

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
import validate from "./validate";
import { useTranslation } from "react-i18next";

const LogInForm = ({ onSubmit }) => {
    //! Đã chỉnh màu ở palette: colorDarkRed

    //* Khi có api thì để validate vào <Form>
    //* <Form onSubmit={onSubmit} validate={(values) => validate(values, t)}>

    const { t } = useTranslation(["common", "errors"]);

    return (
        <Form onSubmit={onSubmit}>
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

                            {/*//* Forgot password  */}
                            {/* <AccountForgotPassword>
                            <NavLink to="/">Forgot a password?</NavLink>
                        </AccountForgotPassword> */}
                        </FormGroupField>
                    </FormGroup>

                    {/*//* Checkbox: Remember me */}
                    <FormGroup>
                        <FormGroupField>
                            <Field
                                name="remember_me"
                                component={renderCheckBoxField}
                                label={t("login.remember_me")}
                                type="checkbox"
                            />
                        </FormGroupField>
                    </FormGroup>

                    {/*//* Sign in  */}
                    <AccountButton as="button" variant="primary" type="submit">
                        {t("login.sign_in")}
                    </AccountButton>

                    {/*//* Register */}
                    {/* <AccountButton
                    as={NavLink}
                    variant="outline-primary"
                    to="/pages/one"
                >
                    Create Account
                </AccountButton> */}
                </LoginForm>
            )}
        </Form>
    );
};

LogInForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
};

export default LogInForm;
