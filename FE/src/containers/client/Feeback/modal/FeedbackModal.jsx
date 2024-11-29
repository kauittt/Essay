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
import CustomForm from "../../../../shared/components/custom/form/CustomForm";
import StarRating from "../../StarRating";
import { fetchCurrentUser } from "../../../../redux/actions/userAction";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../redux/reducers/userSlice";
import {
    addFeedback,
    updateFeedback,
} from "../../../../redux/actions/feedbackAction";

const FeedbackModal = ({ toggle, data, action }) => {
    const { t } = useTranslation(["common", "errors", "store"]);
    const dispatch = useDispatch();

    const user = useSelector(selectUser);

    const enter = t("action.enter");
    // console.log("Data", data);
    //! Handle load feedback
    const currentFeedback = data.feedBacks.find(
        (feedback) => feedback.user == user.id
    );
    const apiAction = currentFeedback ? "edit" : "new";

    // console.log("currentFeedback", currentFeedback);
    const [formData, setFormData] = useState(currentFeedback);

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

        processedValues = {
            ...processedValues,
            size: data.size,
            product: data.id,
            user: user.id,
        };
        // console.log("Processed values", processedValues);

        try {
            let response = null;

            if (apiAction == "new") {
                response = await dispatch(addFeedback(processedValues));
            } else {
                response = await dispatch(
                    updateFeedback(currentFeedback.id, processedValues)
                );
            }

            if (response) {
                // dispatch(fetchProducts());
                dispatch(fetchCurrentUser());
                toast.info(
                    t("common:action.success", {
                        type: t("store:feedback.title"),
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
                t("common:action.fail", { type: t("store:feedback.title") }),
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

        const requiredFields = ["image", "description", "point"];

        requiredFields.forEach((field) => {
            if (!values[field]) {
                errors[field] = t("errors:validation.required");
            }
        });

        return errors;
    };

    const leftFields = [
        {
            label: t("store:feedback.description"),
            name: "description",
            type: "text",
            placeholder: `${enter} ${t("store:feedback.description")}...`,
        },
        {
            label: t("store:feedback.image"),
            name: "image",
            type: "importFile",
            placeholder: `${enter} ${t("store:feedback.image")}...`,
        },
    ];

    const [selectedStar, setSelectedStar] = useState(0);
    const handleStarSelect = (value) => {
        // console.log("Star selected:", value);
        setSelectedStar(value);
    };
    const rightFields = [
        {
            label: t("store:feedback.point"),
            name: "point",
            type: "select",
            options: Array.from({ length: 6 }, (_, i) => ({
                value: i,
                label: <StarRating rating={i} />,
            })),
            myOnChange: handleStarSelect,
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
                                        // onClick={() => console.log("submit")}
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

FeedbackModal.propTypes = {
    toggle: PropTypes.func,
    action: PropTypes.string,
    data: PropTypes.object,
};

export default FeedbackModal;
