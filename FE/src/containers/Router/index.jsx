import { useEffect } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import styled from "styled-components";
import { colorBackgroundBody } from "@/utils/palette";
import { paddingLeft } from "@/utils/directions";
import Layout from "../Layout/index";
import MainWrapper from "./components/MainWrapper";
import LogIn from "../LogIn/index";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { useDispatch } from "react-redux";
import { selectUser } from "@/redux/reducers/userSlice";
import { fetchProducts } from "@/redux/actions/productAction";
import { useSelector } from "react-redux";
import { fetchCategories } from "@/redux/actions/categoryAction";
import { fetchVouchers } from "@/redux/actions/voucherAction";
import ProductPage from "./../Admin/Product/ProductPage";
import CategoryPage from "./../Admin/Category/CategoryPage";
import VoucherPage from "./../Admin/Voucher/VoucherPage";
import { fetchUsers, fetchCurrentUser } from "./../../redux/actions/userAction";
import UserPage from "../Admin/User/UserPage";
import OrderPage from "../Admin/Order/OrderPage";
import { fetchOrders } from "./../../redux/actions/orderAction";
import DashboardPage from "../Admin/Dashboard/DashboardPage";
import DetailPage from "../client/product-detail/DetailPage";
import CartPage from "../client/cart/CartPage";
import ClientProductPage from "../client/product/ClientProductPage";
import InvoicePage from "../client/invoice/InvoicePage";
import ProfilePage from "../client/profile/ProfilePage";

const Pages = () => (
    <Switch>
        <Route path="/pages/admin/test" component={() => <h1>Test</h1>} />
        <Route path="/pages/admin/products" component={ProductPage} />
        <Route path="/pages/admin/categories" component={CategoryPage} />
        <Route path="/pages/admin/vouchers" component={VoucherPage} />
        <Route path="/pages/admin/users" component={UserPage} />
        <Route path="/pages/admin/orders" component={OrderPage} />
        <Route path="/pages/admin/dashboard" component={DashboardPage} />

        <Route path="/pages/client/product" component={ClientProductPage} />
        <Route path="/pages/client/product-detail/:id" component={DetailPage} />
        <Route path="/pages/client/cart" component={CartPage} />
        <Route path="/pages/client/invoice" component={InvoicePage} />
        <Route path="/pages/profile" component={ProfilePage} />
    </Switch>
);

const wrappedRoutes = () => (
    <div>
        <Layout />
        <ContainerWrap>
            <Route path="/pages" component={Pages} />
        </ContainerWrap>
    </div>
);

const Router = () => {
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        const tokenUpdate = JSON.parse(localStorage.getItem("accessToken"));
        if (!tokenUpdate) {
            history.push("/log_in");
        }
    }, []);

    let accessToken = JSON.parse(localStorage.getItem("accessToken"));

    useEffect(() => {
        console.log("Fetch again");
        if (accessToken) {
            dispatch(fetchCurrentUser());
            dispatch(fetchProducts());
            dispatch(fetchCategories());
            dispatch(fetchVouchers());
            dispatch(fetchUsers());
            dispatch(fetchOrders());
        } else {
            console.log("No accessToken found in localStorage");
        }
    }, []);

    return (
        <MainWrapper>
            <main>
                <Switch>
                    <Route exact path="/" component={LogIn} />
                    <Route exact path="/log_in" component={LogIn} />
                    <Route path="/" component={wrappedRoutes} />
                </Switch>
            </main>
        </MainWrapper>
    );
};

export default Router;

// region STYLES

const ContainerWrap = styled.div`
    padding-top: 90px;
    min-height: 100vh;
    transition: padding-left 0.3s;

    ${paddingLeft}: 0;

    background: ${colorBackgroundBody};

    @media screen and (min-width: 576px) {
        ${paddingLeft}: 250px;
    }

    @media screen and (max-width: 576px) {
        padding-top: 150px;
    }
`;

// endregion
