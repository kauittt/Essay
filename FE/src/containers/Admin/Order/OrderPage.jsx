import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Col, Container, Row } from "react-bootstrap";
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
import { selectUser } from "../../../redux/reducers/userSlice";
import { current } from "@reduxjs/toolkit";
import { backgrounds } from "polished";

const formatDate = (date) => {
    const year = date.getFullYear(); // Gets the full year (e.g., 2024)
    const month = date.getMonth() + 1; // Gets the month (0-11, hence adding 1)
    const day = date.getDate(); // Gets the day of the month
    const hours = date.getHours(); // Gets the hours
    const minutes = date.getMinutes(); // Gets the minutes
    const seconds = date.getSeconds(); // Gets the seconds

    // Ensure the month, day, hours, minutes, and seconds are zero-padded
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${year}-${formattedMonth}-${formattedDay} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`; // Formats to yyyy-mm-dd hh:mm:ss
};

//! Check stock
const OrderPage = () => {
    const { t, i18n } = useTranslation(["common", "errors", "store"]);
    let language = i18n.language;

    const statusLabels = {
        CREATED: t("store:order.status.created"),
        CONFIRMED: t("store:order.status.confirmed"),
        DELIVERING: t("store:order.status.delivering"),
        DONE: t("store:order.status.done"),
        CANCEL: t("store:order.status.cancel"),
    };
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

    const userLocal = JSON.parse(localStorage.getItem("user")); //* Local
    const isStaff = userLocal.roles[0] !== "ROLE_USER";
    const isAdmin = userLocal.roles[0] == "ROLE_ADMIN";
    const currentUser = useSelector(selectUser);

    let orders = isStaff
        ? useSelector(selectOrders)
        : currentUser?.orders || [];
    // console.log("Order before", orders);

    orders = orders?.map((order) => {
        const name = order.voucher
            ? language == "en"
                ? order.voucher.enName
                : order.voucher.name
            : language == "en"
            ? "Not apply"
            : "Không áp dụng";
        return {
            ...order,
            voucherName: name,
            createDate: formatDate(new Date(order.createDate)),
            updateDate: formatDate(new Date(order.updateDate)),
            invoiceId: order.invoice.id,
            invoiceCreateDate: formatDate(new Date(order.invoice.createDate)),
            invoiceTotalAmount: `${order?.invoice?.totalAmount?.toLocaleString()} VNĐ`,
            invoiceDiscountAmount: `${order?.invoice?.discountAmount?.toLocaleString()} VNĐ`,
            invoiceTotalDue: `${(
                order.invoice?.totalAmount - order.invoice?.discountAmount
            ).toLocaleString()} VNĐ`,
            invoicePaymentMethod: order.invoice?.paymentMethod,
            tableStatus: statusLabels[order.status],
        };
    });
    // console.log("orders", orders);

    const statusPriority = {
        CREATED: 1,
        CONFIRMED: 2,
        DELIVERING: 3,
        DONE: 4,
        CANCEL: 5,
    };

    orders = orders.sort((a, b) => {
        const statusA = a.status;
        const statusB = b.status;

        return statusPriority[statusA] - statusPriority[statusB];
    });

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
                        // isDisabled={
                        //     item.status == "DONE" || item.status == "CANCEL"
                        // }
                    />

                    {/*//* Modal Feedback  */}
                    {/* {!isStaff && (
                        <CustomModal
                            color="primary"
                            title={
                                t("action.detail") +
                                " " +
                                t("store:feedback.title")
                            }
                            btn={t("store:feedback.title")}
                            action="new"
                            component="feedback"
                            data={item}
                            isDisabled={item.status != "DONE"}
                        />
                    )} */}

                    {isAdmin && (
                        <Button
                            variant="danger"
                            onClick={() => handleDelete(item.id)}
                            style={{ margin: "0" }}
                        >
                            <span>{t("action.delete")}</span>
                        </Button>
                    )}
                </Col>
            ),
        }));
    }, [orders, t]);

    const handleDelete = async (id) => {
        try {
            const response = await dispatch(removeOrder(id));
            const action = t("common:action.delete");

            if (response) {
                // dispatch(fetchVouchers());
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
            // console.log(error);
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
            <Row>
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
                                    handleClickIsSortable={
                                        handleClickIsSortable
                                    }
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
            </Row>
        </Container>
    );
};

OrderPage.propTypes = {};

export default OrderPage;
