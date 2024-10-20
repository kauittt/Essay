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
import { Button } from "@/shared/components/Button";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import CustomModal from "@/shared/components/custom/modal/CustomModal";
import CustomReactTableBase from "@/shared/components/custom/table/CustomReactTableBase";
import CreateVoucherHeader from "./CreateVoucherHeader";
import { selectVouchers } from "@/redux/reducers/voucherSlice";
import { removeVoucher } from "@/redux/actions/voucherAction";
import { selectProducts } from "@/redux/reducers/productSlice";
import { selectCategories } from "@/redux/reducers/categorySlice";

//!!!!!! Check endDate/ Quantity
const VoucherPage = () => {
    const { t } = useTranslation(["common", "errors", "store"]);
    const reactTableData = CreateVoucherHeader(t);

    const [withPagination, setWithPaginationTable] = useState(true);
    const [isSortable, setIsSortable] = useState(false);
    const [withSearchEngine, setWithSearchEngine] = useState(false);

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
        t("tables.customizer.search.search") + " " + t("store:voucher.titles");

    const tableConfig = {
        isSortable,
        isResizable: false,
        withPagination,
        withSearchEngine,
        manualPageSize: [10, 20, 30, 40],
        placeholder: mapPlaceholder,
    };

    const dbProducts = useSelector(selectProducts);
    const categories = useSelector(selectCategories);

    //* Process
    let vouchers = useSelector(selectVouchers);

    vouchers = vouchers?.map((voucher, index) => {
        let voucherProductIds =
            voucher.products?.map((product) => product?.id) || [];
        let newProducts = [];
        let joinProductsName = [];
        let matchedProductIds = []; // save to delete later

        //* Xử lý select ở modal
        if (voucherProductIds?.length === dbProducts?.length) {
            newProducts = ["all"];
        } else {
            categories?.forEach((category) => {
                const categoryProductIds =
                    category?.products?.map((product) => product?.id) || [];

                // Check if all category products are included in the voucher
                const allProductsInCategory = categoryProductIds.every((id) =>
                    voucherProductIds.includes(id)
                );

                if (allProductsInCategory) {
                    newProducts = [...newProducts, category?.name];
                    joinProductsName = [
                        ...joinProductsName,
                        t("store:category.title") + ": " + category?.name,
                    ];

                    matchedProductIds = [
                        ...matchedProductIds,
                        ...categoryProductIds,
                    ];
                }
            });

            // Filter out matched products after processing all categories
            voucherProductIds = voucherProductIds.filter(
                (id) => !matchedProductIds.includes(id)
            );

            const remainingProductNames =
                voucher.products
                    ?.filter((product) =>
                        voucherProductIds.includes(product?.id)
                    )
                    .map((product) => product?.name) || [];

            //* Set các product còn lại
            joinProductsName = [...joinProductsName, ...remainingProductNames];
            newProducts = [...newProducts, ...voucherProductIds];
        }

        return {
            ...voucher,
            no: index + 1,
            products: newProducts, //* Modal
            convertedProduct:
                newProducts[0] === "all"
                    ? t("store:voucher.all")
                    : joinProductsName.join(", "), //* Table
            discountPercentage: voucher.discountPercentage * 100,
        };
    });

    //* Add edit/delete Button
    const data = useMemo(() => {
        return vouchers?.map((item, index) => ({
            ...item,
            action: (
                <Col
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                    }}
                    key={index}
                >
                    <CustomModal
                        color="warning"
                        title={
                            t("action.edit") + " " + t("store:voucher.title")
                        }
                        btn={t("action.edit")}
                        action="edit"
                        component="voucher"
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
    }, [vouchers, t]);

    const handleDelete = async (id) => {
        try {
            const response = await dispatch(removeVoucher(id));
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
            console.error(error);
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
                            <CardTitle>{t("store:voucher.titles")}</CardTitle>
                        </CardTitleWrap>

                        {/*//* Customizer  */}
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
                                    t("store:voucher.title")
                                }
                                btn={t("action.add")}
                                action="new"
                                component="voucher"
                            />
                        </div>

                        {/*//* Table  */}
                        <CustomReactTableBase
                            key={withSearchEngine ? "searchable" : "common"}
                            columns={reactTableData.tableHeaderData}
                            data={data}
                            tableConfig={tableConfig}
                            component="voucher"
                        />
                    </CardBody>
                </Card>
            </Col>
        </Container>
    );
};

VoucherPage.propTypes = {};

export default VoucherPage;
