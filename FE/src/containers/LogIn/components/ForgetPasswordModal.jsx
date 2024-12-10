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
import { fetchOrders } from "@/redux/actions/orderAction";
import { fetchVouchers } from "@/redux/actions/voucherAction";
import CustomForm from "@/shared/components/custom/form/CustomForm";
import { fetchCurrentUser } from "@/redux/actions/userAction";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/reducers/userSlice";
import { addFeedback, updateFeedback } from "@/redux/actions/feedbackAction";
import { updateResetUser } from "../../../redux/actions/userAction";
import emailjs from "emailjs-com";

const ForgetPasswordModal = ({ toggle, data, action }) => {
    const { t } = useTranslation(["common", "errors", "store"]);
    const dispatch = useDispatch();

    const user = useSelector(selectUser);

    const enter = t("action.enter");

    const [formData, setFormData] = useState(data);

    const submitForm = async (values) => {
        // console.log("Default values", values);
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

        try {
            let response = await dispatch(updateResetUser(processedValues));
            const newPassword = response.data;
            // console.log("newPassword", newPassword);

            if (response) {
                const result = await emailjs.send(
                    "service_lz9qqeo", // Service ID của bạn từ EmailJS
                    "template_iz9m6kv", // Template ID của bạn từ EmailJS
                    {
                        to_email: values.email, // Email người nhận từ form
                        from_name: "Mac Tiem",
                        to_name: values.username,
                        subject: "Password Reset", // Tiêu đề email
                        message: `Hi, your reset password request has been processed. New password is: ${newPassword}`, // Nội dung email
                    },
                    "UHloJ4h97IWTL8ZJR" // User ID của bạn từ EmailJS
                );

                toast.info(
                    t("common:action.success", {
                        type: t("store:forgetPassword.modalTitle"),
                    }),
                    {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    }
                );
                toggle();
            }
        } catch (e) {
            // console.log(e);
            toast.error(
                t("common:action.fail", {
                    type: t("store:forgetPassword.modalTitle"),
                }),
                {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                }
            );
        }
    };

    const validate = (values, t) => {
        // console.log("validate", values);
        const errors = {};

        const requiredFields = ["username", "email"];

        requiredFields.forEach((field) => {
            if (!values[field]) {
                errors[field] = t("errors:validation.required");
            }
        });

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
            errors.email = t("errors:validation.invalidEmail");
        }

        return errors;
    };

    const leftFields = [
        {
            label: t("store:user.username"),
            name: "username",
            type: "text",
            placeholder: `${enter} ${t("store:user.username")}...`,
        },
    ];

    const rightFields = [
        {
            label: t("store:user.email"),
            name: "email",
            type: "text",
            placeholder: `${enter} ${t("store:user.email")}...`,
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
                                        min={5}
                                        max={5}
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
                                    {/*//* Cancel  */}
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
                                        // onClick={() => console.log("submit")}
                                        style={{ margin: "0px" }}
                                    >
                                        {t("action.confirm")}
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

ForgetPasswordModal.propTypes = {
    toggle: PropTypes.func,
    action: PropTypes.string,
    data: PropTypes.object,
};

export default ForgetPasswordModal;
