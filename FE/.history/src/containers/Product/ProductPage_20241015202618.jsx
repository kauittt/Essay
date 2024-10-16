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
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import CustomModal from "@/shared/components/custom/modal/CustomModal";
import CustomReactTableBase from "@/shared/components/custom/table/CustomReactTableBase";
import { selectProducts } from "@/redux/reducers/productSlice";
import { removeProduct } from "@/redux/actions/productAction";
import CreateProductHeader from "./CreateProductHeader";

const ProductPage = () => {
    const { t } = useTranslation(["common", "errors", "store"]);
    const reactTableData = CreateProductHeader(t);

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
        t("tables.customizer.search.search") + " " + t("store:product.titles");

    const tableConfig = {
        isSortable,
        isResizable: false,
        withPagination,
        withSearchEngine,
        manualPageSize: [10, 20, 30, 40],
        placeholder: mapPlaceholder,
    };

    let products = useSelector(selectProducts);
    products = products?.map((product) => ({
        ...product,
        convertedCategories: product.categories
            .map((category) => category.name)
            .join(", "),
    }));
    console.log("Products", products);

    //* Add edit/delete Button
    const data = useMemo(() => {
        return products?.map((item, index) => ({
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
                        title={
                            t("action.edit") + " " + t("store:product.title")
                        }
                        btn={t("action.edit")}
                        action="edit"
                        component="product"
                        data={item}
                    />

                    <Button
                        variant="danger"
                        onClick={() => handleDelete(item.id)}
                        style={{ margin: "0" }}
                    >
                        <span>{t("action.delete")}</span>
                    </Button>
                </Col>
            ),
        }));
    }, [products, t]);

    const handleDelete = async (id) => {
        try {
            const response = await dispatch(removeProduct(id));
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
                            <CardTitle>{t("store:product.titles")}</CardTitle>
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
                                    t("action.add") +
                                    " " +
                                    t("store:product.title")
                                }
                                btn={t("action.add")}
                                action="new"
                                component="product"
                            />
                        </div>

                        {/*//* Table  */}
                        <CustomReactTableBase
                            key={withSearchEngine ? "searchable" : "common"}
                            columns={reactTableData.tableHeaderData}
                            data={data}
                            tableConfig={tableConfig}
                            component="product"
                        />
                    </CardBody>
                </Card>
            </Col>
        </Container>
    );
};

ProductPage.propTypes = {};

export default ProductPage;
