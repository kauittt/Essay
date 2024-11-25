import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { colorWhite } from "@/utils/palette";
import { Button } from "@/shared/components/Button";
import { useTranslation } from "react-i18next";

const NotFoundPage = () => {
    const { t, i18n } = useTranslation(["common", "errors", "store"]);
    let language = i18n.language;

    const user = JSON.parse(localStorage.getItem("user"));
    const isStaff = user.roles[0] !== "ROLE_USER"; // Xác định vai trò
    return (
        <NotFoundContainer>
            <NotFountContent>
                <NotFoundImage
                    src={`${import.meta.env.BASE_URL}img/404/404.png`}
                    alt="404"
                />

                <NotFoundInfo>
                    {language == "en"
                        ? "Ooops! The page you are looking for could not be found"
                        : "Rất tiếc! Trang bạn đang tìm kiếm không thể được tìm thấy."}
                </NotFoundInfo>
                <Button
                    as={Link}
                    variant="primary"
                    to={
                        isStaff
                            ? "/pages/admin/dashboard"
                            : "/pages/client/home"
                    }
                >
                    {language == "en" ? "Back" : "Trở về"}
                </Button>
            </NotFountContent>
        </NotFoundContainer>
    );
};

export default NotFoundPage;

// region STYLES

const NotFoundContainer = styled.div`
    text-align: center;
    height: 100vh;
    overflow: auto;
    display: flex;
    background: url(${import.meta.env.BASE_URL}img/404/bg_404.jpeg) no-repeat
        center;
    background-size: cover;

    button {
        margin: 0;
    }
`;

const NotFountContent = styled.div`
    margin: auto;
    padding: 10px;
`;

const NotFoundImage = styled.img`
    max-width: 500px;
    width: 100%;
`;

const NotFoundInfo = styled.h3`
    color: ${colorWhite};
    margin-bottom: 20px;
    margin-top: 90px;
`;

// endregion
