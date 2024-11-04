import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styled from "styled-components";
import EmailOutlineIcon from "mdi-react/EmailOutlineIcon";
import { colorAdditional, colorBorder } from "@/utils/palette";
import { right, marginRight, left } from "@/utils/directions";
import { Button } from "@/shared/components/Button";

const UserInfo = ({ user = {} }) => {
    const Ava = `/img/topbar/ava.png`;

    return (
        <UserInfoWrap>
            <UserInfoAvatarWrap>
                <img
                    src={user.image || Ava}
                    alt="Avatar"
                    className="tw-object-cover"
                />
            </UserInfoAvatarWrap>
            <div className="tw-flex tw-flex-col tw-gap-[5px]">
                <UserInfoName>{user.name}</UserInfoName>
                <UserInfoPost>{user.username}</UserInfoPost>
            </div>
        </UserInfoWrap>
    );
};

UserInfo.propTypes = {
    user: PropTypes.object,
};

export default UserInfo;

// region STYLES

const UserInfoWrap = styled.div`
    display: flex;
    position: relative;
    padding: 10px 0;
    text-align: ${left};
    border-bottom: 1px solid ${colorBorder};

    &:last-child {
        border-bottom: none;
    }
`;

const UserInfoLink = styled(Button)`
    margin-top: 3px;
    position: absolute;
    ${right}: 0;
    padding: 5px 10px;
    line-height: 16px;

    svg {
        ${marginRight}: 0;
        margin-top: 2px;
        height: 16px;
        width: 16px;
    }
`;

const UserInfoAvatarWrap = styled.div`
    width: 40px;
    min-width: 40px;
    height: 40px;
    overflow: hidden;
    border-radius: 50%;
    object-fit: cover;
    ${marginRight}: 10px;

    img {
        height: 100%;
        min-width: 100%;
    }
`;

const UserInfoName = styled.p`
    font-weight: 500;
    line-height: 18px;
    margin-bottom: 0;
    margin-top: 3px;
`;

const UserInfoPost = styled.p`
    color: ${colorAdditional};
    line-height: 15px;
    font-size: 11px;
    margin: 0;

    @media (max-width: 1100px) and (min-width: 990px) {
        font-size: 10px;
    }
`;

// endregion
