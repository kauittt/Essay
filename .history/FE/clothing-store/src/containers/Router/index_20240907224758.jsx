import { useEffect } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import styled from "styled-components";
// eslint-disable-next-line
import { colorBackgroundBody } from "@/utils/palette";
// eslint-disable-next-line
import { paddingLeft } from "@/utils/directions";
import Layout from "../Layout/index";
import MainWrapper from "./comonents/MainWrapper";
import LogIn from "../LogIn/index";
import PurchaseOrderCreate from "../Purchase/PurchaseOrderCreate/index";
import PurchaseOrdersList from "../Purchase/PurchaseOrdersList/index";

const Pages = () => (
    <Switch>
        <Route path="/pages/purchase/order" component={PurchaseOrdersList} />
        <Route
            path="/pages/purchase/new_order"
            component={PurchaseOrderCreate}
        />
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
    // const location = useLocation();

    useEffect(() => {
        const tokenUpdate = JSON.parse(localStorage.getItem("accessToken"));
        if (!tokenUpdate) {
            history.push("/log_in");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
