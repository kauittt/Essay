import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import {
    colorAccent,
    colorAccentHover,
    colorAdditional,
    colorBlue,
    colorBorder,
} from "@/utils/palette";
import { left } from "@/utils/directions";
import { useSelector } from "react-redux";
import { selectTotalUsers } from "../../../../redux/reducers/userSlice";
import { use } from "i18next";
import UserInfo from "./UserInfo";
import { FaStar } from "react-icons/fa";
import ProductGallery from "../ProductGallery";
import { useTranslation } from "react-i18next";
import StarRating from "../../StarRating";

//* Dùng nếu muốn link tới user đánh giá
{
    /* <FeedbackListLink>
    <a href={link}>{link}</a>
</FeedbackListLink>; */
}

const FeedbackList = ({ data = {} }) => {
    const { t, i18n } = useTranslation(["common", "errors", "store"]);
    const users = useSelector(selectTotalUsers);

    const user = users?.filter((user) => user.id == data.user)[0];

    if (!user) {
        console.log("User data not loaded or user not found");
        return <div>Loading user data...</div>;
    }

    // console.log("Found User", user);
    // console.log("Feed back", data);
    return (
        <FeedbackListWrap>
            <FeedbackListTitle>
                <UserInfo user={user}></UserInfo>

                <div className="tw-mt-[10px]">
                    <p>{`${t("store:size.title")}: ${data.size}`}</p>
                    <StarRating rating={data.point} />
                </div>
            </FeedbackListTitle>

            <div className="tw-flex tw-flex-col tw-gap-[10px]">
                <FeedbackListPreview>{data.description}</FeedbackListPreview>

                <ProductGallery
                    image={data.image}
                    alt="feedback-image"
                ></ProductGallery>
            </div>
        </FeedbackListWrap>
    );
};

FeedbackList.propTypes = {
    data: PropTypes.object,
};

export default FeedbackList;

// region STYLES

const FeedbackListWrap = styled.div`
    text-align: ${left};
    padding: 10px 0;
    /* border-bottom: solid 1px #e7e7e7; */
    border-bottom: 1px solid ${colorBorder};

    &:last-child {
        margin-bottom: 25px;
    }

    &:first-child {
        margin-top: 10px;
    }
`;

const FeedbackListTitle = styled.div`
    font-size: 16px;
    font-weight: 500;
    color: ${colorBlue};
`;

const FeedbackListLink = styled.p`
    margin: 0;

    a {
        color: ${colorAccent};

        &:hover {
            color: ${colorAccentHover};
        }
    }
`;

const FeedbackListPreview = styled.div`
    max-width: 980px;
    margin-top: 5px;
    color: ${colorAdditional};
`;

// endregion
