// StarRating.js
import React from "react";
import PropTypes from "prop-types";
import { FaStar } from "react-icons/fa";

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
            ({Number.isInteger(rating) ? rating : rating.toFixed(2)})
        </div>
    );
};

StarRating.propTypes = {
    rating: PropTypes.number.isRequired,
};

export default StarRating;
