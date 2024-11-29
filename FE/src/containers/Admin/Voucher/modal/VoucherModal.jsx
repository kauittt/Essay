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
    const { t, i18n } = useTranslation(["common", "errors", "store"]);
    let language = i18n.language;
    const dispatch = useDispatch();
    const [formData, setFormData] = useState(data);

    const enter = t("action.enter");

    const submitForm = async (values) => {
        // console.log("Submitted values:", values);
        //
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

        // console.log(
        //     "Processed values before additional processing",
        //     processedValues
        // );

        //! Handle Products and Categories Processing
        let selectedProducts = [];

        processedValues.products?.forEach((selectedItem) => {
            //* If the selected item matches a category
            const matchingCategory = categories.find(
                (category) => category.name === selectedItem
            );

            if (matchingCategory) {
                // console.log("Matching category found:", matchingCategory);
                const productsInCategory = matchingCategory.products;

                selectedProducts = [
                    ...selectedProducts,
                    ...productsInCategory.map((product) => product.id),
                ];
            } else if (selectedItem !== "all") {
                //* If it's a product ID
                selectedProducts.push(selectedItem);
            }
        });

        //* Remove duplicates from selected products
        selectedProducts = [...new Set(selectedProducts)];

        //* Handle "all" selection
        if (processedValues.products.includes("all")) {
            processedValues.products = [];
        } else {
            processedValues.products = selectedProducts;
        }

        //* Adjust Dates (handle timezone issues)
        processedValues.startDate = new Date(processedValues.startDate);
        processedValues.startDate.setDate(
            processedValues.startDate.getDate() + 1
        );

        processedValues.endDate = new Date(processedValues.endDate);
        processedValues.endDate.setDate(processedValues.endDate.getDate() + 1);

        // console.log("Final processed values before dispatch:", processedValues);

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
                throw new Error("No matching action found");
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
                toggle(); // Close modal
            }
        } catch (e) {
            console.error(e);
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
        // console.log("Validate", values);
        const errors = {};

        //* Required Fields
        const requiredFields = [
            "name",
            "enName",
            "discountPercentage",
            "quantity",
            "startDate",
            "endDate",
        ];
        requiredFields.forEach((field) => {
            if (values[field] == null) {
                errors[field] = t("errors:validation.required");
            }
        });

        //* Validate BigDecimal Fields
        bigDecimalFields.forEach((field) => {
            const value = values[field];
            if (value !== undefined && value !== null && value !== "") {
                const error = validateBigDecimal(value, t);
                if (error) {
                    errors[field] = error;
                }
            }
        });

        //* Validate Integer Fields
        integerFields.forEach((field) => {
            const value = values[field];
            if (value !== undefined && value !== null && value !== "") {
                const error = validateInteger(value, t);
                if (error) {
                    errors[field] = error;
                }
            }
        });

        //! Handle Product Duplication and Invalid Combinations
        if (!values.products || values.products.length === 0) {
            errors.products = t("errors:validation.required");
        }

        if (values.products?.length > 1 && values.products.includes("all")) {
            errors.products = t("store:voucher.invalidProducts");
        }

        let selectedCategories = values?.products?.filter((item) =>
            categories.some((category) => category.name === item)
        );
        let selectedProducts = values?.products?.filter((item) =>
            products.some((product) => product.id === item)
        );

        let categoryProductIds = [];
        selectedCategories?.forEach((categoryName) => {
            const matchingCategory = categories.find(
                (category) => category.name === categoryName
            );
            if (matchingCategory) {
                const productsInCategory = matchingCategory.products.map(
                    (product) => product.id
                );
                categoryProductIds = [
                    ...categoryProductIds,
                    ...productsInCategory,
                ];
            }
        });

        // console.log("Products within selected categories:", categoryProductIds);
        const duplicateProducts = selectedProducts?.filter((productId) =>
            categoryProductIds.includes(productId)
        );

        duplicateProducts?.forEach((productId) => {
            const matchedProduct = products.find(
                (product) => product.id === productId
            );
            if (matchedProduct) {
                const otherCategories = matchedProduct.categories.filter(
                    (categoryName) => !selectedCategories.includes(categoryName)
                );
                if (otherCategories.length <= 0) {
                    errors.products = t("store:voucher.invalidCategoryProduct");
                }
            }
        });

        //* Discount Percentage Validation
        if (
            values.discountPercentage &&
            (values.discountPercentage <= 0 || values.discountPercentage > 100)
        ) {
            errors.discountPercentage =
                t("errors:validation.invalidNumber") + " (1 - 100)";
        }

        //* Quantity Validation
        if (values.quantity && values.quantity === 0) {
            errors.quantity = t("errors:validation.invalidNumber") + " (> 0)";
        }

        //* Date Validation (start date should not be greater than end date)
        let startDate = values.startDate ? formatDate(values.startDate) : null;
        let endDate = values.endDate ? formatDate(values.endDate) : null;
        if (startDate && endDate && endDate < startDate) {
            errors.endDate = t("errors:validation.invalidDate");
        }

        // console.log("Validation Errors:", errors);

        return errors;
    };

    const products = useSelector(selectProducts);
    const categories = useSelector(selectCategories);

    // console.log("Products List", products);
    // console.log("Categories to load for voucher", categories);

    const categoryTitle = t("store:category.title");
    const leftFields = [
        {
            label: t("store:voucher.name"),
            name: "name",
            type: "text",
            placeholder: `${enter} ${t("store:voucher.name")}...`,
        },
        {
            label: t("store:voucher.enName"),
            name: "enName",
            type: "text",
            placeholder: `${enter} ${t("store:voucher.enName")}...`,
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
                ...categories.map((category) => {
                    const modalName =
                        language == "en" ? category.enName : category.name;
                    return {
                        value: category.name,
                        label: `${categoryTitle}: ${modalName}`,
                    };
                }),
                ...products.map((product) => {
                    const productName =
                        language == "en" ? product.enName : product.name;
                    return {
                        value: product.id,
                        label: productName,
                    };
                }),
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

VoucherModal.propTypes = {
    toggle: PropTypes.func,
    action: PropTypes.string,
    data: PropTypes.object,
};

export default VoucherModal;
