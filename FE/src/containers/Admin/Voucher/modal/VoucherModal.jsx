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

const bigDecimalFields = ["discountPercentage"];
const integerFields = ["quantity"];

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

const VoucherModal = ({ toggle, data, action }) => {
    const { t } = useTranslation(["common", "errors", "store"]);
    const dispatch = useDispatch();

    const enter = t("action.enter");
    const [formData, setFormData] = useState(data);

    console.log("Form Data", formData);
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

        console.log("Processed values", values);

        //* More Process on Product
        let selectedProducts = [];

        processedValues.products.forEach((selectedItem) => {
            //* Xem có category' NAME nào trùng k
            const matchingCategory = categories.find(
                (category) => category.name === selectedItem
            );

            if (matchingCategory) {
                //* Lọc các product của category đó
                const productsInCategory = products.filter((product) =>
                    product.categories.some(
                        (cat) => cat.id === matchingCategory.id
                    )
                );

                console.log("productsInCategory", productsInCategory);

                //* Set
                selectedProducts = [
                    ...selectedProducts,
                    ...productsInCategory.map((product) => product.id),
                ];
            } else if (selectedItem !== "all") {
                //* không phải category và không phải all -> product
                selectedProducts.push(selectedItem);
            }
        });

        //* Deduplicate product IDs
        selectedProducts = [...new Set(selectedProducts)];

        if (processedValues.products.includes("all")) {
            processedValues.products = [];
        } else {
            processedValues.products = selectedProducts;
        }

        //* Process Date: + 1 (maybe timezone)
        processedValues.startDate = new Date(processedValues.startDate);
        processedValues.startDate.setDate(
            processedValues.startDate.getDate() + 1
        ); // +1 day

        processedValues.endDate = new Date(processedValues.endDate);
        processedValues.endDate.setDate(processedValues.endDate.getDate() + 1); // +1 day

        console.log("Processed more values", processedValues);

        const actionText =
            action === "new" ? t("common:action.add") : t("common:action.edit");

        try {
            let response;

            if (action === "new") {
                response = await dispatch(addVoucher(processedValues));
            } else if (action === "edit") {
                response = await dispatch(
                    updateVoucher(processedValues.id, processedValues)
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
        console.log("Values validate", values);

        //* Required
        const requiredFields = [
            "name",
            "discountPercentage",

            "quantity",
            "startDate",
            "endDate",
        ];
        requiredFields.forEach((field) => {
            if (!values[field]) {
                errors[field] = t("errors:validation.required");
            }
        });

        //* Number
        bigDecimalFields.forEach((field) => {
            const value = values[field];
            if (value !== undefined && value !== null && value !== "") {
                const error = validateBigDecimal(value, t);
                if (error) {
                    errors[field] = error;
                }
            }
        });

        integerFields.forEach((field) => {
            const value = values[field];
            if (value !== undefined && value !== null && value !== "") {
                const error = validateInteger(value, t);
                if (error) {
                    errors[field] = error;
                }
            }
        });

        //* Select multi Products
        if (!values.products || values.products.length === 0) {
            errors.products = t("errors:validation.required");
        }

        if (
            values.products &&
            values.products.length > 1 &&
            values.products.includes("all")
        ) {
            errors.products = t("store:voucher.invalidProducts");
        }

        //* Category and Product Duplication Validation
        let selectedCategories = values.products.filter((selectedItem) =>
            categories.some((category) => category.name === selectedItem)
        );
        let selectedProducts = values.products.filter((selectedItem) =>
            products.some((product) => product.id === selectedItem)
        );

        let categoryProductIds = [];

        selectedCategories.forEach((categoryName) => {
            // Find the category and get associated products
            const matchingCategory = categories.find(
                (category) => category.name === categoryName
            );
            if (matchingCategory) {
                const productsInCategory = products
                    .filter((product) =>
                        product.categories.some(
                            (cat) => cat.id === matchingCategory.id
                        )
                    )
                    .map((product) => product.id);

                categoryProductIds = [
                    ...categoryProductIds,
                    ...productsInCategory,
                ];
            }
        });

        const duplicateProducts = selectedProducts.filter((productId) =>
            categoryProductIds.includes(productId)
        );

        if (duplicateProducts.length > 0) {
            errors.products = t("store:voucher.invalidCategoryProduct");
        }

        //* Discount
        if (
            values.discountPercentage &&
            (values.discountPercentage <= 0 || values.discountPercentage > 100)
        ) {
            errors.discountPercentage =
                t("errors:validation.invalidNumber") + " (1 - 100)";
        }

        //* Quantity
        if (values.quantity && values.quantity == 0) {
            errors.quantity = t("errors:validation.invalidNumber") + " (> 0)";
        }

        //* End date
        let startDate = values.startDate ? formatDate(values.startDate) : null;
        let endDate = values.endDate ? formatDate(values.endDate) : null;
        if (startDate && endDate && endDate < startDate) {
            errors.endDate = t("errors:validation.invalidDate");
        }

        console.log("Errors", errors);

        return errors;
    };

    let products = useSelector(selectProducts);
    let categories = useSelector(selectCategories);

    console.log("Product", products);
    console.log("Categories to load voucher", categories);

    const categoryTitle = t("store:category.title");
    const leftFields = [
        {
            label: t("store:voucher.name"),
            name: "name",
            type: "text",
            placeholder: `${enter} ${t("store:voucher.name")}...`,
        },
        {
            label: t("store:voucher.discountPercentage"),
            name: "discountPercentage",
            type: "text",
            placeholder: `${enter} ${t("store:voucher.discountPercentage")}...`,
        },
        {
            label: t("store:voucher.products"),
            name: "products",
            type: "multiSelect",
            options: [
                {
                    value: "all",
                    label: `>> ${t("store:voucher.all")} <<`,
                },
                ...categories.map((category) => ({
                    value: category.name,
                    label: `${categoryTitle}: ${category.name}`,
                })),
                ...products.map((product) => ({
                    value: product.id,
                    label: product.name,
                })),
            ],
        },
    ];

    const rightFields = [
        {
            label: t("store:voucher.quantity"),
            name: "quantity",
            type: "text",
            placeholder: `${enter} ${t("store:voucher.quantity")}...`,
        },
        {
            label: t("store:voucher.startDate") + " (yyyy/MM/dd)",
            name: "startDate",
            type: "datepicker",
            disabled: action === "edit",
        },
        {
            label: t("store:voucher.endDate") + " (yyyy/MM/dd)",
            name: "endDate",
            type: "datepicker",
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

VoucherModal.propTypes = {
    toggle: PropTypes.func,
    action: PropTypes.string,
    data: PropTypes.object,
};

export default VoucherModal;
