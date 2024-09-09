import { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Provider, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import "bootstrap/dist/css/bootstrap.min.css";
import Loading from "@/shared/components/Loading";
import Router from "../Router/index";
import store from "./store";
import ScrollToTop from "./ScrollToTop";
import GlobalStyles from "./globalStyles";
// import { config as i18nextConfig } from "../../translations";
// import i18n from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import i18n from "../../translations";

// i18n.use(initReactI18next).init(i18nextConfig);

const App = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        window.addEventListener("load", () => {
            setIsLoading(false);
            setTimeout(() => setIsLoaded(true), 500);
        });
    }, []);

    return (
        <Provider store={store}>
            <BrowserRouter>
                <I18nextProvider i18n={i18n}>
                    <ScrollToTop>
                        <Fragment>
                            {!isLoaded && isLoading && <Loading />}
                            <ConnectedThemeComponent>
                                <Router />
                            </ConnectedThemeComponent>
                        </Fragment>
                    </ScrollToTop>
                </I18nextProvider>
            </BrowserRouter>
        </Provider>
    );
};

export default App;

//* ThemeComponent
const ThemeComponent = ({ children }) => {
    const mode = useSelector((state) => state.theme.className);
    const direction = useSelector((state) => state.rtl.direction);

    return (
        <ThemeProvider
            theme={{
                mode,
                direction,
            }}
        >
            <GlobalStyles />
            {children}
        </ThemeProvider>
    );
};

ThemeComponent.propTypes = {
    children: PropTypes.node.isRequired,
};

const ConnectedThemeComponent = ThemeComponent;
