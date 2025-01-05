import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useTranslation } from "react-i18next";
import { Col, Container, Row } from "react-bootstrap";
import TopSellingProducts from "./components/TopSellingProducts";
import NewOrders from "./components/NewOrders";
import { selectProducts } from "@/redux/reducers/productSlice";
import { selectOrders } from "../../../redux/reducers/orderSlice";
import ProductSalesAreaChart from "./components/ProductSalesAreaChart";
import { Card } from "@/shared/components/Card";
import { CardBody } from "@/shared/components/Card";
import moment from "moment";
import MonthlyInfo from "./components/info/MonthlyInfo";
import {
    selectTotalUsers,
    selectUser,
} from "./../../../redux/reducers/userSlice";

const currentMonth = moment().month() + 1;
const currentYear = moment().year();

const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;

const DashboardPage = () => {
    const { t } = useTranslation(["common", "errors", "store"]);

    const { rtl } = useSelector((state) => ({
        rtl: state.rtl,
    }));

    const products = useSelector(selectProducts);
    const orders = useSelector(selectOrders);
    const users = useSelector(selectTotalUsers);
    // console.log("order", orders);
    // console.log("Products", products);
    // console.log("Users", users);
    let currentRevenue = 0;
    let revenuePercent = 0;

    let currentActualRevenue = 0;
    let actualRevenuePercent = 0;

    let currentOrdersCount = 0;
    let orderPercent = 0;

    let currentMonthUsers = 0;
    let userPercent = 0;

    ///* Revenue
    const calculateRevenue = (month, year) => {
        return orders && orders.length > 0
            ? orders
                  .filter((order) => order.status === "DONE")
                  .reduce((total, order) => {
                      const orderMonth = moment(order.createDate).month() + 1;
                      const orderYear = moment(order.createDate).year();
                      if (orderMonth === month && orderYear === year) {
                          let totalAmount = 0;
                          order.orderProducts.map(
                              (orderProduct) =>
                                  (totalAmount +=
                                      orderProduct.quantity *
                                      orderProduct.product.price)
                          );
                          return (
                              total + totalAmount
                              //    - order.invoice.discountAmount
                          );
                      }
                      return total;
                  }, 0)
            : 0;
    };

    const getRevenuePercent = () => {
        currentRevenue = calculateRevenue(currentMonth, currentYear);
        const previousRevenue = calculateRevenue(previousMonth, previousYear);

        // console.log("currentRevenue", currentRevenue);
        // console.log("previousRevenue", previousRevenue);

        let percentageChange;
        if (previousRevenue == 0 && currentRevenue == 0) percentageChange = 0;
        else if (previousRevenue == 0) percentageChange = 100;
        else if (currentRevenue == 0) percentageChange = 0;
        else {
            percentageChange = (currentRevenue / previousRevenue) * 100;
            if (percentageChange % 10 != 0) {
                percentageChange = percentageChange.toFixed(2);
            }
        }

        currentRevenue = currentRevenue?.toLocaleString();
        revenuePercent = percentageChange;
    };

    //* Actual Revenue
    const calculateActualRevenue = (month, year) => {
        return orders && orders.length > 0
            ? orders
                  .filter((order) => order.status === "DONE")
                  .reduce((total, order) => {
                      const orderMonth = moment(order.createDate).month() + 1;
                      const orderYear = moment(order.createDate).year();
                      if (orderMonth === month && orderYear === year) {
                          let totalAmount = 0;
                          order.orderProducts.map(
                              (orderProduct) =>
                                  (totalAmount +=
                                      orderProduct.quantity *
                                      orderProduct.product.price)
                          );
                          return (
                              total + totalAmount - order.invoice.discountAmount
                          );
                      }
                      return total;
                  }, 0)
            : 0;
    };

    const getActualRevenuePercent = () => {
        currentActualRevenue = calculateActualRevenue(
            currentMonth,
            currentYear
        );
        const previousActualRevenue = calculateActualRevenue(
            previousMonth,
            previousYear
        );

        // console.log("currentActualRevenue", currentActualRevenue);
        // console.log("previousActualRevenue", previousActualRevenue);

        let percentageChange;
        if (previousActualRevenue == 0 && currentActualRevenue == 0)
            percentageChange = 0;
        else if (previousActualRevenue == 0) percentageChange = 100;
        else if (currentActualRevenue == 0) percentageChange = 0;
        else {
            percentageChange =
                (currentActualRevenue / previousActualRevenue) * 100;
            if (percentageChange % 10 != 0) {
                percentageChange = percentageChange.toFixed(2);
            }
        }

        currentActualRevenue = currentActualRevenue?.toLocaleString();
        actualRevenuePercent = percentageChange;
    };

    //* Orders
    const countOrders = (month, year) => {
        return orders?.filter((order) => {
            const orderDate = moment(order.createDate);
            return orderDate.month() + 1 === month && orderDate.year() === year;
        }).length;
    };

    const getOrdersPercent = () => {
        currentOrdersCount = countOrders(currentMonth, currentYear);
        const previousOrdersCount = countOrders(previousMonth, previousYear);

        // console.log("currentOrdersCount", currentOrdersCount);
        // console.log("previousOrdersCount", previousOrdersCount);

        let percentageChange;
        if (previousOrdersCount == 0 && currentOrdersCount == 0)
            percentageChange = 0;
        else if (previousOrdersCount == 0) percentageChange = 100;
        else if (currentOrdersCount == 0) percentageChange = 0;
        else {
            percentageChange = (currentOrdersCount / previousOrdersCount) * 100;
            if (percentageChange % 10 != 0) {
                percentageChange = percentageChange.toFixed(2);
            }
        }

        orderPercent = percentageChange;
    };

    //* Users
    const countUsersCreated = (month, year) => {
        return users?.filter((user) => {
            const userCreateDate = moment(user.createDate, "YYYY-MM-DD");

            const hasRoleUser = user.authorities.some(
                (auth) => auth.authority === "ROLE_USER"
            );

            return (
                hasRoleUser &&
                userCreateDate.month() + 1 === month &&
                userCreateDate.year() === year
            );
        }).length;
    };

    const getUsersPercent = () => {
        // Count new users for current and previous months
        currentMonthUsers = countUsersCreated(currentMonth, currentYear);
        const previousMonthUsers = countUsersCreated(
            previousMonth,
            previousYear
        );

        // console.log("currentMonthUsers", currentMonthUsers);
        // console.log("previousMonthUsers", previousMonthUsers);

        let percentageChange;
        if (previousMonthUsers == 0 && currentMonthUsers == 0)
            percentageChange = 0;
        else if (previousMonthUsers == 0) percentageChange = 100;
        else if (currentMonthUsers == 0) percentageChange = 0;
        else {
            percentageChange = (currentMonthUsers / previousMonthUsers) * 100;
            if (percentageChange % 10 != 0) {
                percentageChange = percentageChange.toFixed(2);
            }
        }

        userPercent = percentageChange;
    };

    getRevenuePercent();
    getActualRevenuePercent();
    getOrdersPercent();
    getUsersPercent();

    const dispatch = useDispatch();
    return (
        <Container className="dashboard">
            <Row>
                {/* <div className="tw-flex tw-gap-[15px]"> */}
                {/* Revenue */}
                <MonthlyInfo
                    title={currentRevenue}
                    description={t("store:dashboard.info.monthlyRevenue")}
                    percent={revenuePercent}
                    gradient="blue"
                    color="colorBlue"
                />

                {/* Actual Revenue */}
                <MonthlyInfo
                    title={currentActualRevenue}
                    description={t("store:dashboard.info.monthlyActualRevenue")}
                    percent={actualRevenuePercent}
                    gradient="yellow"
                    color="colorYellow"
                />

                {/* User */}
                <MonthlyInfo
                    title={currentMonthUsers}
                    description={t("store:dashboard.info.newCustomers")}
                    percent={userPercent}
                    // gradient="yellow"
                    // color="colorYellow"
                    color="colorRed"
                    gradient="pink"
                />

                {/* Order */}
                <MonthlyInfo
                    title={currentOrdersCount}
                    description={t("store:dashboard.info.monthlyOrders")}
                    percent={orderPercent}
                    color="colorAccent"
                    gradient="turquoise"
                />
            </Row>

            <Row>
                <TopSellingProducts dir={rtl.direction} />

                <NewOrders />
            </Row>

            <Row>
                <ProductSalesAreaChart
                    orders={orders}
                    products={products}
                ></ProductSalesAreaChart>
            </Row>
        </Container>
    );
};

export default DashboardPage;
