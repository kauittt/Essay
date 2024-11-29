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
// import ClientProductPage from "../client/product/ClientProductPage";
import InvoicePage from "../client/invoice/InvoicePage";
import ProfilePage from "../client/profile/ProfilePage";
import HomePage from "../client/home/HomePage";
import ProtectedRoute from "./ProtectedRoute";
import NotFoundPage from "../NotFoundPage";
import BannerPage from "../Admin/Banner/BannerPage";
import { fetchBanners } from "../../redux/actions/bannerAction";
import FeedbackPage from "../client/Feeback/FeedbackPage";

const Pages = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const isStaff = user?.roles[0] !== "ROLE_USER"; // Xác định vai trò

    return (
        <Switch>
            {/*//* Admin Routes */}
            <ProtectedRoute
                path="/pages/admin/dashboard"
                component={DashboardPage}
                isAllowed={isStaff}
                redirectTo="/pages/client/home"
            />
            <ProtectedRoute
                path="/pages/admin/products"
                component={ProductPage}
                isAllowed={isStaff}
                redirectTo="/pages/client/home"
            />
            <ProtectedRoute
                path="/pages/admin/categories"
                component={CategoryPage}
                isAllowed={isStaff}
                redirectTo="/pages/client/home"
            />
            <ProtectedRoute
                path="/pages/admin/vouchers"
                component={VoucherPage}
                isAllowed={isStaff}
                redirectTo="/pages/client/home"
            />
            <ProtectedRoute
                path="/pages/admin/users"
                component={UserPage}
                isAllowed={isStaff}
                redirectTo="/pages/client/home"
            />
            <ProtectedRoute
                path="/pages/admin/orders"
                component={OrderPage}
                isAllowed={isStaff}
                redirectTo="/pages/client/home"
            />
            <ProtectedRoute
                path="/pages/admin/banners"
                component={BannerPage}
                isAllowed={isStaff}
                redirectTo="/pages/client/home"
            />

            {/*//! ------------------------------------------------------ */}

            {/*//* Client Routes */}
            <ProtectedRoute
                path="/pages/client/home"
                component={HomePage}
                isAllowed={!isStaff}
                redirectTo="/pages/admin/dashboard"
            />
            <ProtectedRoute
                path="/pages/client/product-detail/:id"
                component={DetailPage}
                isAllowed={!isStaff}
                redirectTo="/pages/admin/dashboard"
            />
            <ProtectedRoute
                path="/pages/client/cart"
                component={CartPage}
                isAllowed={!isStaff}
                redirectTo="/pages/admin/dashboard"
            />
            <ProtectedRoute
                path="/pages/client/invoice"
                component={InvoicePage}
                isAllowed={!isStaff}
                redirectTo="/pages/admin/dashboard"
            />
            <ProtectedRoute
                path="/pages/client/orders"
                component={OrderPage}
                isAllowed={!isStaff}
                redirectTo="/pages/admin/dashboard"
            />
            <ProtectedRoute
                path="/pages/client/feedbacks"
                component={FeedbackPage}
                isAllowed={!isStaff}
                redirectTo="/pages/admin/dashboard"
            />

            {/*//* Shared Route */}
            {/* <Route path="/pages/profile" component={ProfilePage} /> */}
            <ProtectedRoute
                path="/pages/profile"
                component={ProfilePage}
                isAllowed={true}
                redirectTo={
                    isStaff ? "/pages/admin/dashboard" : "/pages/client/home"
                }
            />

            <Route path="*" component={NotFoundPage} />
        </Switch>
    );
};

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
            // Nếu không có accessToken, chuyển hướng về trang đăng nhập
            history.push("/log_in");
        } else {
            // Nếu có accessToken, tiếp tục fetch dữ liệu cần thiết
            const user = JSON.parse(localStorage.getItem("user"));
            const isStaff = user?.roles[0] !== "ROLE_USER";

            dispatch(fetchCurrentUser(tokenUpdate));
            dispatch(fetchProducts(tokenUpdate));
            dispatch(fetchVouchers(tokenUpdate));
            dispatch(fetchCategories(tokenUpdate));
            dispatch(fetchBanners(tokenUpdate));

            if (isStaff) {
                dispatch(fetchUsers(tokenUpdate));
                dispatch(fetchOrders(tokenUpdate));
            }
        }
    }, []);

    // useEffect(() => {
    //     const tokenUpdate = JSON.parse(localStorage.getItem("accessToken"));
    //     if (!tokenUpdate) {
    //         history.push("/log_in");
    //     }
    // }, []);

    // let accessToken = JSON.parse(localStorage.getItem("accessToken"));

    // useEffect(() => {
    //     console.log("Fetch again");
    //     if (accessToken) {
    //         const user = JSON.parse(localStorage.getItem("user"));
    //         const isStaff = user.roles[0] != "ROLE_USER";

    //         dispatch(fetchCurrentUser(accessToken));
    //         dispatch(fetchProducts(accessToken));
    //         dispatch(fetchVouchers(accessToken));
    //         dispatch(fetchCategories(accessToken));
    //         dispatch(fetchBanners(accessToken));

    //         if (isStaff) {
    //             dispatch(fetchUsers(accessToken));
    //             dispatch(fetchOrders(accessToken));
    //         } else {
    //         }
    //     } else {
    //         console.log("No accessToken found in localStorage");
    //     }
    // }, []);

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
