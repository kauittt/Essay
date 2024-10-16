import React from "react";
import { useHistory, Link } from "react-router-dom";
import FacebookIcon from "mdi-react/FacebookIcon";
import GooglePlusIcon from "mdi-react/GooglePlusIcon";
import {
    AccountCard,
    AccountContent,
    AccountHead,
    AccountLogo,
    AccountLogoAccent,
    AccountOr,
    AccountSocial,
    AccountSocialButtonFacebook,
    AccountSocialButtonGoogle,
    AccountTitle,
    AccountWrap,
} from "@/shared/components/account/AccountElements";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import LogInForm from "./components/LogInForm";
import { useTranslation } from "react-i18next";
import TopbarLanguage from "./../Layout/topbar/TopbarLanguage";
import {
    getTotalBookSuccess,
    selectBook,
    selectTotalBook,
} from "@/redux/reducers/bookSlice";
import AuthService from "@/services/AuthService";

const LogIn = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { t } = useTranslation(["common", "errors", "store"]);

    const handleFormSubmit = async (values) => {
        console.log("Submitted Values:", values);
        try {
            const response = await AuthService.postLogin(values);
            const accessToken = response.data.accessToken || null;
            if (accessToken) {
                const decoded = jwtDecode(accessToken);
                localStorage.setItem(
                    "accessToken",
                    JSON.stringify(accessToken)
                );
                localStorage.setItem("user", JSON.stringify(decoded.user));

                //! Redux
                dispatch(getUserSuccess(decoded.user));
                dispatch(fetchCustomers(accessToken));
                dispatch(fetchTotalUsers(accessToken));
                dispatch(fetchItems(accessToken));
                dispatch(fetchSaleQuoteHeaders(accessToken));

                const action = t("common:action.login");
                toast.info(t("common:action.success", { type: action }), {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                history.push("/pages/customers");
            }
        } catch (error) {
            console.log(error);
            const action = t("common:action.login");
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

    // <h3 className="page-title">{t("forms.basic_form.title")}</h3>;

    //! Test redux
    dispatch(getTotalBookSuccess("hehe"));
    const books = useSelector(selectTotalBook);
    console.log(books);

    return (
        <AccountWrap>
            <AccountContent>
                <AccountCard>
                    {/*//* Header */}
                    <AccountHead>
                        <AccountTitle>
                            {t("login.title")}
                            <AccountLogo>
                                {" "}
                                Mặc
                                <AccountLogoAccent> Tiệm</AccountLogoAccent>
                            </AccountLogo>
                        </AccountTitle>
                        <h4 className="subhead">{t("login.subTitle")}</h4>

                        <TopbarLanguage />
                    </AccountHead>

                    {/*//* Form  */}
                    <LogInForm onSubmit={handleFormSubmit} />

                    {/*//* Text Direction  */}
                    <AccountOr>
                        <p>Or Easily Using</p>
                    </AccountOr>

                    {/*//* Other option */}
                    <AccountSocial>
                        <AccountSocialButtonFacebook
                            as={Link}
                            className="account__social-btn account__social-btn--facebook"
                            to="/pages/test"
                        >
                            <FacebookIcon />
                        </AccountSocialButtonFacebook>
                        <AccountSocialButtonGoogle as={Link} to="/pages/test">
                            <GooglePlusIcon />
                        </AccountSocialButtonGoogle>
                    </AccountSocial>
                </AccountCard>
            </AccountContent>
        </AccountWrap>
    );
};

export default LogIn;
