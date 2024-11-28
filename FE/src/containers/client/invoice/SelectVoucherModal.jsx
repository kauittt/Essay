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
import { toast, ToastContainer } from "react-toastify";
import FormInput from "@/shared/components/custom/form/FormInput";
import { fetchProducts } from "@/redux/actions/productAction";
import CustomForm from "@/shared/components/custom/form/CustomForm";
import { useSelector } from "react-redux";
import { selectProducts } from "@/redux/reducers/productSlice";
import { addVoucher, updateVoucher } from "@/redux/actions/voucherAction";
import { selectCategories } from "@/redux/reducers/categorySlice";
import CustomFormOneCol from "../../../shared/components/custom/form/CustomFormOneCol";
import { selectVouchers } from "../../../redux/reducers/voucherSlice";

//* Helper
//* Cần convert sang cùng loại trước khi check
//* Khi select là instanceof Date, khác nói String khi pass vào form
const formatDate = (dateString) => {
    if (!dateString) return "";

    let date;
    if (typeof dateString === "string" || dateString instanceof String) {
        return dateString;
    } else if (dateString instanceof Date) {
        date = dateString;
    }

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
};

const SelectVoucherModal = ({ toggle, data, action, myOnChange }) => {
    const { t, i18n } = useTranslation(["common", "errors", "store"]);
    let language = i18n.language;
    const dispatch = useDispatch();
    const [formData, setFormData] = useState(data);
    const enter = t("action.enter");

    console.log("Voucher in modal", data);
    const vouchers = useSelector(selectVouchers);

    const submitForm = async (values) => {
        toggle(); // Close modal
        myOnChange(vouchers.find((voucher) => voucher.id == values.voucher));
    };

    const validate = (values, t) => {
        const errors = {};
        console.log("Values validate", values);

        console.log("Errors:", errors);
        return errors;
    };

    const categoryTitle = "Ap dung voucher";

    const fields = data.map((voucher) => {
        return {
            label: language == "en" ? voucher.enName : voucher.name,
            name: "voucher",
            type: "voucherRadio",
            radioValue: voucher.id + "",
            voucher: voucher,
        };
    });

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
                                    <CustomFormOneCol
                                        fields={fields}
                                        min={5}
                                        max={5}
                                        isButton={false}
                                    />
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

SelectVoucherModal.propTypes = {
    toggle: PropTypes.func,
    action: PropTypes.string,
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default SelectVoucherModal;
