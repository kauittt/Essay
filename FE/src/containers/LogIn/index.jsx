import React, { useEffect, useState } from "react";
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
import AuthService from "@/services/AuthService";
import { toast } from "react-toastify";
import { getUserSuccess } from "@/redux/reducers/userSlice";
import { fetchProducts } from "@/redux/actions/productAction";
import { fetchCategories } from "@/redux/actions/categoryAction";
import { fetchVouchers } from "@/redux/actions/voucherAction";
import {
    addUser,
    fetchCurrentUser,
    fetchUsers,
} from "../../redux/actions/userAction";
import { fetchOrders } from "../../redux/actions/orderAction";
import RegisterForm from "./components/RegisterForm";
import UserService from "../../services/UserService";
import { fetchBanners } from "../../redux/actions/bannerAction";

const LogIn = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { t } = useTranslation(["common", "errors", "store"]);
    const [purpose, setPurpose] = useState("login");

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            const decoded = jwtDecode(token);
            const isStaff = decoded.user.roles[0] !== "ROLE_USER";
            if (isStaff) {
                history.push("/pages/admin/dashboard");
                window.location.reload();
            } else {
                history.push("/pages/client/home");
                window.location.reload();
            }
        }
    }, [history]);

    const handleLoginFormSubmit = async (values) => {
        // console.log("Submitted Values:", values);
        try {
            const response = await AuthService.postLogin(values);
            const accessToken = response.data.accessToken || null;
            if (accessToken) {
                localStorage.setItem(
                    "accessToken",
                    JSON.stringify(accessToken)
                );

                const decoded = jwtDecode(accessToken);
                const roles = decoded.user.roles;
                localStorage.setItem("user", JSON.stringify(decoded.user));

                // console.log("decoded", decoded);
                // console.log("ROLE", roles[0]);
                // console.log("Fetch login");
                //! Redux
                dispatch(fetchCurrentUser(accessToken));
                dispatch(fetchProducts(accessToken));
                dispatch(fetchVouchers(accessToken));
                dispatch(fetchCategories(accessToken));
                dispatch(fetchBanners(accessToken));

                if (roles[0] == "ROLE_USER") {
                    history.push("/pages/client/home");
                } else {
                    dispatch(fetchUsers(accessToken));
                    dispatch(fetchOrders(accessToken));
                    history.push("/pages/admin/dashboard");
                }

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
            }
        } catch (error) {
            // console.log(error);
            // const message = error.response.data.message;
            // console.log("message", message);
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

    const handleRegisterFormSubmit = async (values) => {
        // console.log("Hello register");
        const request = { ...values, authorities: ["ROLE_USER"] };
        console.log("request", request);
        try {
            let response = await UserService.postUser(request);

            if (response) {
                toast.info(
                    t("common:action.success", {
                        type: t("common:action.register"),
                    }),
                    {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    }
                );
                setPurpose("login");
            }
        } catch (error) {
            // console.log(error);
            const message = error.response.data.message;
            // console.log("message", message);

            const field = message.includes("Email")
                ? t("store:user.email")
                : message.includes("Username")
                ? t("store:user.username")
                : message.includes("Phone")
                ? t("store:user.phone")
                : null;

            const action = t("common:action.register");

            const myError = field
                ? t("errors:validation.fieldExisted", { field: field })
                : t("common:action.fail", { type: action });
            toast.error(myError),
                {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                };
        }
    };

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
                    {purpose == "login" ? (
                        <LogInForm
                            onSubmit={handleLoginFormSubmit}
                            setPurpose={setPurpose}
                        />
                    ) : (
                        <RegisterForm
                            onSubmit={handleRegisterFormSubmit}
                            setPurpose={setPurpose}
                        />
                    )}

                    {/*//* Text Direction  */}
                    {/* <AccountOr>
                        <p>{t("login.direction")}</p>
                    </AccountOr> */}

                    {/*//* Other option */}
                    {/* <AccountSocial>
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
                    </AccountSocial> */}
                </AccountCard>
            </AccountContent>
        </AccountWrap>
    );
};

export default LogIn;
