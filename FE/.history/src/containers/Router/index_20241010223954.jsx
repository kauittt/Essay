import { useEffect } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import styled from "styled-components";
import { colorBackgroundBody } from "@/utils/palette";
import { paddingLeft } from "@/utils/directions";
import Layout from "../Layout/index";
import MainWrapper from "./components/MainWrapper";
import LogIn from "../LogIn/index";
import ProductPage from "../Customer/ProductPage";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { useDispatch } from "react-redux";

const Pages = () => (
    <Switch>
        <Route path="/pages/test" component={() => <h1>Test</h1>} />
        <Route path="/pages/products" component={ProductPage} />
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

    const user = useSelector(selectUser);

    useEffect(() => {
        console.log("Fetch again");
        if (user) {
            dispatch(fetchCustomers());
            dispatch(fetchTotalUsers());
            dispatch(fetchItems());
            dispatch(fetchSaleQuoteHeaders());
        } else {
            console.log("No user found in localStorage");
        }
    }, []);
    // dispatch, user

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