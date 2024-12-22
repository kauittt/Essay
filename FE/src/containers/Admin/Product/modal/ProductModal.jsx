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
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import CustomForm from "@/shared/components/custom/form/CustomForm";
import { selectCategories } from "@/redux/reducers/categorySlice";
import { addProduct, updateProduct } from "@/redux/actions/productAction";
import { createGlobalStyle } from "styled-components";
import { fetchVouchers } from "@/redux/actions/voucherAction";
import { fetchCategories } from "@/redux/actions/categoryAction";
import { fetchOrders } from "../../../../redux/actions/orderAction";
import CreateTableSizeHeader from "./table/CreateTableSizeHeader";
import Collapse from "@/shared/components/Collapse";
import EditableReactTable from "./table/EditableReactTable";
import { selectSizes } from "../../../../redux/reducers/sizeSlice";
import {
    fetchCurrentUser,
    fetchUsers,
} from "../../../../redux/actions/userAction";

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

const ProductModal = ({ toggle, data, action }) => {
    const { t, i18n } = useTranslation(["common", "errors", "store"]);
    let language = i18n.language;
    const dispatch = useDispatch();
    const reactTableData = CreateTableSizeHeader(t);
    const enter = t("action.enter");

    // console.log("product in modal", data);

    let categories = useSelector(selectCategories);
    let sizes = useSelector(selectSizes);

    //* Từ form
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

        // console.log("process -----------");
        processedValues = {
            ...processedValues,
            sizes: sizes,
            quantities: tableData.map((row) => row.stock),
        };
        // console.log(processedValues);

        const actionText =
            action === "new" ? t("common:action.add") : t("common:action.edit");

        try {
            let response;

            if (action === "new") {
                response = await dispatch(addProduct(processedValues));
            } else if (action === "edit") {
                response = await dispatch(
                    updateProduct(processedValues.id, processedValues)
                );
            } else {
                throw new Error("Error: No matching action");
            }

            if (response) {
                dispatch(fetchVouchers());
                dispatch(fetchCategories());
                dispatch(fetchOrders());
                dispatch(fetchUsers());
                dispatch(fetchCurrentUser());

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
        // console.log("Validate values", values);
        // console.log("Table", tableData);
        const errors = {};

        const requiredFields = [
            "name",
            "description",
            "enName",
            "enDescription",

            "price",
            // "stock",
            "image",
        ];

        requiredFields.forEach((field) => {
            if (!values[field]) {
                errors[field] = t("errors:validation.required");
            }
        });

        if (!values.categories || values.categories.length === 0) {
            errors.categories = t("errors:validation.required");
        }

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

        //* Table
        const requiredTableFields = ["stock"];

        tableData.map((row, index) => {
            //* Empty
            requiredTableFields.forEach((field) => {
                if (row[field] == null) {
                    // console.log("row[field]", row[field]);
                    errors[`${index}-${field}`] = t(
                        "errors:validation.required"
                    );
                }
            });

            //* Number
            const numericFields = ["stock"];
            numericFields.forEach((field) => {
                const error = validateInteger(row[field], t);
                if (error) {
                    errors[`${index}-${field}`] = error;
                }
            });
        });

        // console.log("Erros", errors);
        return errors;
    };

    const leftFields = [
        {
            label: t("store:product.name"),
            name: "name",
            type: "text",
            placeholder: `${enter} ${t("store:product.name")}`,
        },
        {
            label: t("store:product.enName"),
            name: "enName",
            type: "text",
            placeholder: `${enter} ${t("store:product.enName")}`,
        },
        {
            label: t("store:product.description"),
            name: "description",
            type: "text",
            placeholder: `${enter} ${t("store:product.description")}`,
        },
        {
            label: t("store:product.enDescription"),
            name: "enDescription",
            type: "text",
            placeholder: `${enter} ${t("store:product.enDescription")}`,
        },
    ];

    const rightFields = [
        {
            label: t("store:product.price"),
            name: "price",
            type: "text",
            placeholder: `${enter} ${t("store:product.price")}`,
        },
        // {
        //     label: t("store:product.stock"),
        //     name: "stock",
        //     type: "text",
        //     placeholder: `${enter} ${t("store:product.stock")}`,
        // },
        {
            label: t("store:product.category"),
            name: "categories",
            type: "multiSelect",
            options: categories.map((category) => ({
                value: category.name,
                label: language == "en" ? category.enName : category.name,
            })),
        },
        {
            label: t("store:product.image"),
            name: "image",
            type: "importFile",
            placeholder: `${enter} ${t("store:product.image")}`,
        },
    ];

    //* Dữ liệu từ table
    const [tableData, setTableData] = useState([]);

    const handleTableData = (dataFromTable) => {
        // console.log("invoke update data table");
        setTableData(dataFromTable);
    };

    // console.log("Data to load modal", formData);
    // console.log("Categories to load Modal", categories);

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
                                            min={5}
                                            max={5}
                                            isButton={false}
                                        ></CustomForm>

                                        <Collapse
                                            title={t(
                                                "store:product.manageStock"
                                            )}
                                            className="with-shadow"
                                        >
                                            <EditableReactTable
                                                reactTableData={reactTableData}
                                                onTableDataUpdate={
                                                    handleTableData
                                                } // Sử dụng callback này để cập nhật dữ liệu
                                                data={data}
                                            />
                                        </Collapse>
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

ProductModal.propTypes = {
    toggle: PropTypes.func,
    action: PropTypes.string,
    data: PropTypes.object,
};

export default ProductModal;
