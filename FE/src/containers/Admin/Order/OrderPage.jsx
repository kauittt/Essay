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
import { fetchVouchers } from "@/redux/actions/voucherAction";
import { removeOrder } from "../../../redux/actions/orderAction";
import CreateOrderHeader from "./CreateOrderHeader";
import { selectOrders } from "@/redux/reducers/orderSlice";

//! Check stock
const OrderPage = () => {
    const { t } = useTranslation(["common", "errors", "store"]);
    const reactTableData = CreateOrderHeader(t);

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
        t("tables.customizer.search.search") + " " + t("store:order.titles");

    const tableConfig = {
        isSortable,
        isResizable: false,
        withPagination,
        withSearchEngine,
        manualPageSize: [10, 20, 30, 40],
        placeholder: mapPlaceholder,
    };

    let orders = useSelector(selectOrders);
    console.log("Order before", orders);

    orders = orders?.map((order) => ({
        ...order,
        invoiceId: order.invoice.id,
        invoiceCreateDate: order.invoice.createDate,
        invoiceTotalAmount: `${order.invoice?.totalAmount.toLocaleString()} VNĐ`,
        invoiceDiscountAmount: `${order.invoice?.discountAmount.toLocaleString()} VNĐ`,
        invoiceTotalDue: `${(
            order.invoice?.totalAmount - order.invoice?.discountAmount
        ).toLocaleString()} VNĐ`,
        invoicePaymentMethod: order.invoice?.paymentMethod,
    }));
    console.log("orders", orders);

    //* Add edit/delete Button
    const data = useMemo(() => {
        return orders?.map((item, index) => ({
            ...item,
            no: index + 1,
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
                            t("action.detail") + " " + t("store:order.title")
                        }
                        btn={t("action.detail")}
                        action="edit"
                        component="order"
                        data={item}
                    />

                    {/* <Button
                        variant="danger"
                        onClick={() => handleDelete(item.id)}
                        style={{ margin: "0" }}
                    >
                        <span>{t("action.delete")}</span>
                    </Button> */}
                </Col>
            ),
        }));
    }, [orders, t]);

    const handleDelete = async (id) => {
        try {
            const response = await dispatch(removeOrder(id));
            const action = t("common:action.delete");

            if (response) {
                dispatch(fetchVouchers());
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
                            <CardTitle>{t("store:order.titles")}</CardTitle>
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
                            {/* <CustomModal
                                color="primary"
                                title={
                                    t("action.add") +
                                    " " +
                                    t("store:order.title")
                                }
                                btn={t("action.add")}
                                action="new"
                                component="order"
                            /> */}
                        </div>

                        {/*//* Table  */}
                        <CustomReactTableBase
                            key={withSearchEngine ? "searchable" : "common"}
                            columns={reactTableData.tableHeaderData}
                            data={data}
                            tableConfig={tableConfig}
                            component="order"
                        />
                    </CardBody>
                </Card>
            </Col>
        </Container>
    );
};

OrderPage.propTypes = {};

export default OrderPage;
