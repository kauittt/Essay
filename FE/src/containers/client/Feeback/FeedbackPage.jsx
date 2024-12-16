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
import CreateCategoryHeader from "./CreateFeedbackHeader";
import { selectCategories } from "@/redux/reducers/categorySlice";
import { removeCategory } from "@/redux/actions/categoryAction";
import { fetchProducts } from "@/redux/actions/productAction";
import { fetchOrders } from "@/redux/actions/orderAction";
import { fetchVouchers } from "@/redux/actions/voucherAction";
import CreateFeedbackHeader from "./CreateFeedbackHeader";
import { selectOrders } from "@/redux/reducers/orderSlice";
import { selectUser } from "../../../redux/reducers/userSlice";

const FeedbackPage = () => {
    const { t, i18n } = useTranslation(["common", "errors", "store"]);
    let language = i18n.language;
    const reactTableData = CreateFeedbackHeader(t);
    const userLocal = JSON.parse(localStorage.getItem("user")); //* Local
    const isStaff = userLocal.roles[0] !== "ROLE_USER";

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
        t("tables.customizer.search.search") + " " + t("store:feedback.titles");

    const tableConfig = {
        isSortable,
        isResizable: false,
        withPagination,
        withSearchEngine,
        manualPageSize: [10, 20, 30, 40],
        placeholder: mapPlaceholder,
    };

    let currentUser = useSelector(selectUser);
    let orders = currentUser?.orders;

    orders = orders?.filter((order) => order.status === "DONE"); // Lọc các đơn hàng đã hoàn thành
    // console.log("Before", orders);

    orders = orders
        ?.map((order) =>
            order.orderProducts.map((orderProduct) => ({
                ...orderProduct,
                orderId: order.id, // Thêm orderId vào mỗi orderProduct
            }))
        )
        .flat();
    orders = orders?.map((order, index) => ({
        ...order,
        ...order.product,
        no: index + 1,
        tableName: language == "en" ? order.product.enName : order.product.name,
        totalPrice: order.product.price * order.quantity,
    }));
    // console.log("orders", orders);

    //* Add edit/delete Button
    const data = useMemo(() => {
        return orders?.map((item, index) => ({
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
                        color="success"
                        title={t("store:feedback.title")}
                        btn={t("store:feedback.title")}
                        action="new"
                        component="feedback"
                        data={item}
                    />
                </Col>
            ),
        }));
    }, [orders, t]);

    // console.log("-----");
    return (
        <Container>
            <Row>
                <Col md={12} lg={12}>
                    <Card>
                        <CardBody>
                            {/*//* Title  */}
                            <CardTitleWrap>
                                <CardTitle>
                                    {t("store:feedback.titles")}
                                </CardTitle>
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
                                component="feedback"
                            />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

FeedbackPage.propTypes = {};

export default FeedbackPage;
