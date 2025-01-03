import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Link } from "react-router-dom";
import DotsHorizontalIcon from "mdi-react/DotsHorizontalIcon";
import ChevronDownIcon from "mdi-react/ChevronDownIcon";
import { NewOrderTableProps } from "@/shared/prop-types/TablesProps";
import Panel from "@/shared/components/Panel";
import { Table } from "@/shared/components/TableElements";
import { marginLeft, marginRight } from "@/utils/directions";
import {
    colorYellow,
    colorRed,
    colorAccent,
    colorAdditional,
} from "@/utils/palette";
import {
    DropdownMenu,
    Dropdown,
    DropdownItem,
    DropdownToggle,
} from "@/shared/components/Dropdown";
import { useSelector } from "react-redux";
import { selectProducts } from "@/redux/reducers/productSlice";
import { selectOrders } from "../../../../redux/reducers/orderSlice";

const DropDownMore = ({ index, handleDeleteRow }) => (
    <MoreDropdown>
        <MoreDropdownToggle>
            <DotsHorizontalIcon />
        </MoreDropdownToggle>
        <DropdownMenu>
            <DropdownItem as={Link} to={`/e_commerce_dashboard/edit/${index}`}>
                Edit
            </DropdownItem>
            <DropdownItem onClick={handleDeleteRow}>Delete</DropdownItem>
        </DropdownMenu>
    </MoreDropdown>
);

DropDownMore.propTypes = {
    index: PropTypes.number.isRequired,
    handleDeleteRow: PropTypes.func.isRequired,
};

const NewOrderAmount = ({ quantity = 0 }) => (
    <DashboardOrdersAmount amount={quantity}>
        <div />
        {quantity > 20 && <div />}
        {quantity > 50 && <div />}
        {quantity > 100 && <div />}
        {quantity > 150 && <div />}
        <span>{quantity}</span>
    </DashboardOrdersAmount>
);

NewOrderAmount.propTypes = {
    quantity: PropTypes.number,
};

const NewOrders = () => {
    const { t, i18n } = useTranslation(["common", "errors", "store"]);
    let language = i18n.language;
    const products = useSelector(selectProducts);
    const orders = useSelector(selectOrders);
    let newOrder = [];

    //* sửa nè

    //* Xử lý data
    const productSalesMap = products?.reduce((acc, product) => {
        product.sizeProducts.forEach((sizeProduct) => {
            let key = `${product.id}-${sizeProduct.size.name}`;
            acc[key] = {
                id: product.id,
                name: language === "en" ? product.enName : product.name,
                size: sizeProduct.size.name,
                stock: sizeProduct.stock,
                sold: 0,
                total: 0,
                latestCreateDate: "",
                price: product.price,
                image: product.image,
            };
        });
        return acc;
    }, {});

    orders?.forEach((order) => {
        order.orderProducts.forEach((item) => {
            let key = `${item.product.id}-${item.size}`;
            const product = productSalesMap[key];
            if (product) {
                product.sold += item.quantity;
                product.total += item.quantity * item.product.price;
                const productDate = product.latestCreateDate
                    ? new Date(product.latestCreateDate)
                    : new Date(0);
                const orderDate = new Date(order.createDate);
                if (orderDate > productDate) {
                    product.latestCreateDate = order.createDate;
                }
            }
        });
    });

    //* Convert field name cho giống mẫu
    if (productSalesMap) {
        newOrder = Object.values(productSalesMap)
            ?.filter((product) => product.sold > 0)
            .sort(
                (a, b) =>
                    new Date(b.latestCreateDate) - new Date(a.latestCreateDate)
            )
            // .slice(0, 7)
            .map((product) => ({
                id: product.id,
                title: product.name,
                quantity: product.stock,
                size: product.size,
                sold: product.sold,
                total: `${product.total.toLocaleString()} VNĐ`,
                img: product.image,
            }));
    }

    // console.log("newOrder", newOrder);

    return (
        <Panel
            xl={6}
            lg={12}
            md={12}
            title={t("dashboard_commerce.new_orders")}
            // subhead="Top sales of the last week"
        >
            <DashboardOrdersTable responsive striped>
                <thead>
                    <tr className="">
                        <th>{t("store:product.title")}</th>
                        <th className="stock">{t("store:product.stock")}</th>
                        <th className="size">{t("store:size.title")}</th>
                        <th className="sold">{t("store:product.sold")}</th>
                        {/* <th>{t("store:product.totalPrice")}</th> */}
                        <th>{t("store:dashboard.chart.totalRevenue")}</th>
                        {/* <th aria-label="dashboard__table" /> */}
                    </tr>
                </thead>
                <tbody>
                    {newOrder.map((order, index) => {
                        return (
                            <tr key={index}>
                                <td>
                                    <DashboardOrdersTitle>
                                        <DashboardOrdersImageWrap>
                                            <DashboardOrdersImage
                                                img={order.img}
                                            />
                                        </DashboardOrdersImageWrap>
                                        {order.title}
                                    </DashboardOrdersTitle>
                                </td>

                                <td className="stock">
                                    <NewOrderAmount quantity={order.quantity} />
                                </td>

                                <td className="size">{order.size}</td>

                                <td className="sold">{order.sold}</td>

                                <DashboardOrdersTotalCell dir="ltr">
                                    {`${order.total}`}
                                </DashboardOrdersTotalCell>
                            </tr>
                        );
                    })}
                </tbody>
            </DashboardOrdersTable>
        </Panel>
    );
};

NewOrders.propTypes = {};

export default NewOrders;

// region

const DashboardOrdersTable = styled(Table)`
    overflow: hidden;
    min-width: 410px;

    tbody {
        max-height: 336px;
        overflow-y: auto;
        display: block;
    }

    thead th.size,
    tbody td.size {
        width: 60px;
    }

    thead th.stock,
    tbody td.stock {
        width: 120px;
    }

    thead th.sold,
    tbody td.sold {
        width: 80px;
    }

    thead,
    tbody tr {
        display: table;
        width: 100%;
        table-layout: fixed;
    }

    tbody td {
        padding: 8px 10px; //* 10
        vertical-align: middle;
    }
`;

const DashboardOrdersTitle = styled.div`
    position: relative;
    display: flex;
    line-height: 15px;
    align-items: center;
`;

const DashboardOrdersImageWrap = styled.div`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 10px;
    flex-shrink: 0;
`;

const DashboardOrdersTotalCell = styled.td`
    white-space: nowrap;
`;

const DashboardOrdersImage = styled.div`
    width: 100%;
    height: 100%;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    background-image: url(${(props) => props.img});
`;

const DashboardOrdersLink = styled(Link)`
    font-size: 12px;
    margin-top: 20px;
    display: block;

    svg {
        height: 12px;
        width: 12px;
    }
`;

const getAmountColor = (amount) => {
    switch (true) {
        case amount <= 20:
            return colorRed;
        case amount <= 100:
            return colorYellow;

        default:
            return colorAccent;
    }
};

const DashboardOrdersAmount = styled.div`
    display: flex;

    div {
        width: 3px;
        height: 14px;
        display: inline-block;
        background-color: ${(props) => getAmountColor(props.amount)};
        border-radius: 3px;
        ${marginRight}: 3px;
        ${marginLeft}: 0;
        margin-top: auto;
        margin-bottom: auto;
    }

    span {
        color: ${colorAdditional};
        ${marginRight}: 0;
        ${marginLeft}: 5px;
        margin-top: auto;
        margin-bottom: auto;
    }
`;

const MoreDropdown = styled(Dropdown)`
    display: flex;

    & > div {
        min-width: 90px;
        width: 100%;
    }

    button {
        font-size: 13px;
    }
`;

const MoreDropdownToggle = styled(DropdownToggle)`
    margin: 0;
    padding: 0 5px;
    border: none;
    background-color: transparent;
    ${marginLeft}: auto;

    &:before {
        display: none;
    }

    svg {
        margin: 0;
        height: 20px;
        width: 20px;
        fill: ${colorAdditional};
        transition: all 0.3s;
    }

    &:hover,
    &:not([disabled]):not(.disabled):active,
    &:focus {
        background: transparent;

        svg {
            fill: ${colorAccent};
        }
    }
`;

// endregion
