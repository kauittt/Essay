import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import {
    colorAccent,
    colorAccentHover,
    colorAdditional,
    colorBlue,
} from "@/utils/palette";
import { left } from "@/utils/directions";
import { useSelector } from "react-redux";
import { selectTotalUsers } from "./../../../../redux/reducers/userSlice";
import { use } from "i18next";
import UserInfo from "./UserInfo";
import { FaStar } from "react-icons/fa";
import ProductGallery from "./../ProductGallery";

//* Dùng nếu muốn link tới user đánh giá
{
    /* <SearchResultLink>
    <a href={link}>{link}</a>
</SearchResultLink>; */
}

const StarRating = ({ rating }) => {
    const MAX_STARS = 5;

    // Function to get the fill style for each star
    const getStarFill = (index) => {
        if (rating >= index + 1) {
            // Fully yellow star
            return "#f6da6e";
        } else if (index < rating && rating < index + 1) {
            // Half yellow star using gradient
            const percentage = (rating - index) * 100;
            return (
                <svg width="1em" height="1em">
                    <linearGradient
                        id={`yellow-gray-gradient-${index}`}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                    >
                        <stop stopColor="#f6da6e" offset={`${percentage}%`} />
                        <stop
                            stopColor="rgb(216, 223, 233)"
                            offset={`${percentage}%`}
                        />
                        <stop stopColor="rgb(216, 223, 233)" offset="100%" />
                    </linearGradient>
                    <FaStar
                        style={{ fill: `url(#yellow-gray-gradient-${index})` }}
                    />
                </svg>
            );
        } else {
            // Gray star
            return "rgb(216, 223, 233)";
        }
    };

    return (
        <div className="tw-flex tw-gap-[5px]">
            {Array.from({ length: MAX_STARS }).map((_, index) => (
                <div
                    key={index}
                    className="tw-flex tw-justify-center tw-items-center"
                >
                    {typeof getStarFill(index) === "string" ? (
                        <FaStar style={{ fill: getStarFill(index) }} />
                    ) : (
                        getStarFill(index)
                    )}
                </div>
            ))}
            ({rating?.toFixed(2)})
        </div>
    );
};

const SearchResult = ({ data = {} }) => {
    const users = useSelector(selectTotalUsers);

    const user = users?.filter((user) => user.id == data.user)[0];

    if (!user) {
        // Optional: You could show a loading spinner here or a placeholder component
        console.log("User data not loaded or user not found");
        return <div>Loading user data...</div>;
    }

    // console.log("Found User", user);
    console.log("Feed back", data);
    return (
        <SearchResultWrap>
            <SearchResultTitle>
                <UserInfo user={user}></UserInfo>

                <StarRating rating={data.point} />
            </SearchResultTitle>

            <div>
                <SearchResultPreview>{data.description}</SearchResultPreview>
                <ProductGallery
                    image="https://scontent.fsgn15-1.fna.fbcdn.net/v/t39.30808-6/464862613_952462516922529_316742674039388013_n.jpg?stp=cp6_dst-jpg&_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_ohc=E6OK9RFJzs8Q7kNvgG9GED9&_nc_zt=23&_nc_ht=scontent.fsgn15-1.fna&_nc_gid=AvaqXWR8JiHKC2ncLZ2DD57&oh=00_AYDQlRh7IQvm0WnHCen2CmZl2gNO_lYnll8Aniy3w--_XQ&oe=672661DC"
                    alt="feedback-image"
                ></ProductGallery>
            </div>
        </SearchResultWrap>
    );
};

SearchResult.propTypes = {
    data: PropTypes.object,
};

export default SearchResult;

// region STYLES

const SearchResultWrap = styled.div`
    text-align: ${left};
    padding: 10px 0;
    border-bottom: solid 1px #e7e7e7;

    &:last-child {
        margin-bottom: 25px;
    }

    &:first-child {
        margin-top: 10px;
    }
`;

const SearchResultTitle = styled.p`
    font-size: 16px;
    font-weight: 500;
    color: ${colorBlue};
`;

const SearchResultLink = styled.p`
    margin: 0;

    a {
        color: ${colorAccent};

        &:hover {
            color: ${colorAccentHover};
        }
    }
`;

const SearchResultPreview = styled.p`
    max-width: 980px;
    margin-top: 5px;
    color: ${colorAdditional};
`;

// endregion
