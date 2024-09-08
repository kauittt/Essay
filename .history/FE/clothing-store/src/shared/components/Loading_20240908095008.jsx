import React from "react";
import PropTypes from "prop-types";
import { twMerge } from "tailwind-merge";

const Loading = ({ loading = false }) => (
    <div
        className={twMerge(
            `h-screen w-screen flex items-center fixed bg-white z-[1000] ${
                !loading ? "animate-loaded" : ""
            }`
        )}
    >
        <div className="m-auto">
            <svg
                className="animate-load m-auto w-8 h-8"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
            >
                <path
                    fill="#4ce1b6"
                    d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"
                />
            </svg>
        </div>
    </div>
);

Loading.propTypes = {
    loading: PropTypes.bool,
};

export default Loading;
