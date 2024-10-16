import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Col, Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import ReactTableBase from "@/shared/components/table/ReactTableBase";
import ReactTableCustomizer from "@/shared/components/table/components/ReactTableCustomizer";
import {
    Card,
    CardBody,
    CardTitleWrap,
    CardTitle,
} from "@/shared/components/Card";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";
import CustomerModal from "./modal/CustomerModal";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import CreateCustomerHeader from "./CreateCustomerHeader";
import CustomModal from "@/shared/components/custom/modal/CustomModal";
import CustomReactTableBase from "@/shared/components/custom/table/CustomReactTableBase";
import { selectProducts } from "@/redux/reducers/productSlice";

const ProductPage = () => {
    const { t } = useTranslation(["common", "errors"]);
    const reactTableData = CreateCustomerHeader(t);

    const [withPagination, setWithPaginationTable] = useState(true);
    const [isSortable, setIsSortable] = useState(false);
    const [withSearchEngine, setWithSearchEngine] = useState(false);

    const location = useLocation();
    const history = useHistory();
    const dispatch = useDispatch();

    const handleClickIsSortable = () => {
        setIsSortable(!isSortable);
    };

    const handleClickWithPagination = () => {
        setWithPaginationTable(!withPagination);
    };

    const handleClickWithSearchEngine = () => {
        setWithSearchEngine(!withSearchEngine);
    };

    const mapPlaceholder =
        t("tables.customizer.search.search") + " " + t("customer.titles");

    const tableConfig = {
        isSortable,
        isResizable: false,
        withPagination,
        withSearchEngine,
        manualPageSize: [10, 20, 30, 40],
        placeholder: mapPlaceholder,
    };

    const customers = useSelector(selectProducts);
    console.log(customers);

    //* Add edit/delete Button
    const data = useMemo(() => {
        //! Truyền item ở đây vào method edit/remove
        return customers?.map((item, index) => ({
            ...item,
            action: (
                <Col
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                    }}
                >
                    <CustomModal
                        color="warning"
                        title={t("action.edit") + " " + t("customer.title")}
                        btn={t("action.edit")}
                        action="edit"
                        component="customer"
                        data={item}
                    />

                    <Button
                        variant="danger"
                        onClick={() => handleDelete(item.no)}
                        style={{ margin: "0" }}
                    >
                        <span>{t("action.delete")}</span>
                    </Button>
                </Col>
            ),
        }));
    }, [customers, t]);

    const handleDelete = async (no) => {
        try {
            const response = await dispatch(removeCustomer(no));
            const action = t("common:action.delete");

            if (response) {
                toast.info(t("common:action.success", { type: action }), {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            console.log(error);
            const action = t("common:action.delete");
            toast.error(t("common:action.fail", { type: action }), {
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

    return (
        <Container>
            <Col md={12} lg={12}>
                <Card>
                    <CardBody>
                        {/*//* Title  */}
                        <CardTitleWrap>
                            <CardTitle>{t("customer.titles")}</CardTitle>
                        </CardTitleWrap>

                        {/*//*Customizer   */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <ReactTableCustomizer
                                handleClickIsSortable={handleClickIsSortable}
                                handleClickWithPagination={
                                    handleClickWithPagination
                                }
                                handleClickWithSearchEngine={
                                    handleClickWithSearchEngine
                                }
                                isSortable={isSortable}
                                withPagination={withPagination}
                                withSearchEngine={withSearchEngine}
                            />

                            {/*//* Button: New  */}
                            <CustomModal
                                color="primary"
                                title={
                                    t("action.add") + " " + t("customer.title")
                                }
                                btn={t("action.add")}
                                action="new"
                                component="customer"
                            />
                        </div>

                        {/*//* Table  */}
                        <CustomReactTableBase
                            key={withSearchEngine ? "searchable" : "common"}
                            columns={reactTableData.tableHeaderData}
                            data={data}
                            tableConfig={tableConfig}
                            component="customer"
                        />
                    </CardBody>
                </Card>
            </Col>
        </Container>
    );
};

ProductPage.propTypes = {};

export default ProductPage;
