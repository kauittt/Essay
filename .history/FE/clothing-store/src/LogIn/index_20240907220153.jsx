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
import { useDispatch } from "react-redux";
import LogInForm from "./components/LogInForm";
import { useTranslation } from "react-i18next";

import TopbarLanguage from "./../containers/Layout/topbar/TopbarLanguage";

const LogIn = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const handleError = (error) => {
        let message = "An unexpected error occurred. Please try again.";

        if (error.code) {
            switch (error.code) {
                case "ERR_BAD_REQUEST":
                    message = "Incorrect username or password.";
                    break;
                case "ERR_NETWORK":
                    message =
                        "Service temporarily unavailable. Please try again later.";
                    break;
                default:
                    message = `An unexpected error occurred with code: ${error.code}`;
                    break;
            }
        } else if (error.response) {
            switch (error.response.status) {
                case 401:
                    message = "Unauthorized. Please login again.";
                    break;
                case 404:
                    message = "Requested resource not found.";
                    break;
                case 500:
                    message = "Internal server error. Please try again later.";
                    break;
                default:
                    message = error.response.data.message || message;
                    break;
            }
        }

        return message;
    };

    const handleFormSubmit = async (values) => {
        history.push("/pages/one");
        // try {
        //     const response = await AuthService.postLogin(values);
        //     const accessToken = response.data.accessToken || null;
        //     if (accessToken) {
        //         const decoded = jwtDecode(accessToken);
        //         localStorage.setItem(
        //             "accessToken",
        //             JSON.stringify(accessToken)
        //         );
        //         localStorage.setItem("user", JSON.stringify(decoded.user));
        //         dispatch(getUserSuccess(decoded.user));
        //         history.push("/pages/purchase/order");
        //     }
        // } catch (error) {
        //     alert(`Login failed: ${handleError(error)}`);
        // }
    };

    const { t } = useTranslation("common");
    // <h3 className="page-title">{t("forms.basic_form.title")}</h3>;

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
                                Easy
                                <AccountLogoAccent>DEV</AccountLogoAccent>
                            </AccountLogo>
                        </AccountTitle>
                        <h4 className="subhead">{t("login.subTitle")}</h4>

                        <TopbarLanguage />
                    </AccountHead>

                    {/*//* Form  */}
                    <LogInForm onSubmit={handleFormSubmit} />

                    {/*//* Text Direction  */}
                    {/* <AccountOr>
                        <p>Or Easily Using</p>
                    </AccountOr> */}

                    {/*//* Other option */}
                    {/* <AccountSocial>
                        <AccountSocialButtonFacebook
                            as={Link}
                            className="account__social-btn account__social-btn--facebook"
                            to="/pages/one"
                        >
                            <FacebookIcon />
                        </AccountSocialButtonFacebook>
                        <AccountSocialButtonGoogle as={Link} to="/pages/one">
                            <GooglePlusIcon />
                        </AccountSocialButtonGoogle>
                    </AccountSocial> */}
                </AccountCard>
            </AccountContent>
        </AccountWrap>
    );
};

export default LogIn;
