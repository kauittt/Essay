import styled from "styled-components";
import Slider from "react-slick";
import {
    colorAdditional,
    colorBackground,
    colorDustyWhite,
    colorBackgroundBody,
    colorText,
} from "@/utils/palette";
import { paddingRight } from "@/utils/directions";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const StyledSlider = styled(Slider)`
    width: calc(100% + 10px);
    margin-bottom: 24px;

    .slick-slide {
        overflow: hidden;
        ${paddingRight}: 15px;
        position: relative;

        img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            /* min-height: 100%; */
        }
    }

    .slick-list {
        width: 100%;
    }

    .slick-arrow {
        height: 100%;
        width: 100px;
        z-index: 1;

        &:before {
            color: ${colorDustyWhite};
            font-weight: 500;
            position: absolute;
            top: calc(50% - 15px);
            /* font-size: 30px; */
            font-size: 60px;
            line-height: 30px;
            font-family: inherit;
            width: 30px;
            transition: all 0.3s;
        }

        &:hover {
            color: ${colorAdditional};
        }

        @media screen and (max-width: 750px) {
            display: none !important;
        }
    }

    .slick-arrow.slick-next {
        left: auto;
        background: ${(props) =>
            props.multiple
                ? `linear-gradient(90deg, transparent, ${colorBackground})`
                : "none"};
        right: 0;

        &:before {
            content: "\\203A";
            /* right: 15px; */
            right: 10px;
        }
    }

    .slick-arrow.slick-prev {
        background: ${(props) =>
            props.multiple
                ? `linear-gradient(-90deg, transparent, ${colorBackground})`
                : "none"};
        left: 0;

        &:before {
            content: "\\2039";
            /* left: 5px; */
            left: 0px;
        }
    }

    .slick-dots {
        li {
            width: 10px;

            button {
                padding: 0;
                width: 10px;

                &:before {
                    font-size: 10px;
                    width: 10px;
                    height: 10px;
                    color: ${colorDustyWhite};
                    opacity: 1;
                    transition: all 0.3s;
                }
            }

            &.slick-active {
                button:before {
                    /* color: ${colorBackgroundBody}; */
                    color: ${colorText};
                }
            }

            &:hover {
                button:before {
                    color: ${colorAdditional};
                }
            }
        }
    }

    /* Breakpoints for image height */
    @media screen and (max-width: 768px) {
        .slick-slide img {
            height: 150px; /* Height for small screens (mobile) */
        }
    }

    @media screen and (max-width: 992px) {
        .slick-slide img {
            height: 180px; /* Height for medium screens (tablets) */
        }
    }

    @media screen and (min-width: 1200px) {
        .slick-slide img {
            height: 230px; /* Height for larger screens */
        }
    }
`;

export const SingleSlider = styled(StyledSlider)`
    .slick-arrow {
        background: transparent;
    }
`;

export const SliderCaption = styled.div`
    position: absolute;
    bottom: 20px;
    left: 30px;
    width: calc(100% - 50px);
`;

export const SliderCaptionTitle = styled.p`
    font-size: 16px;
    font-weight: 500;
    color: white;
    line-height: 20px;
`;

export const SliderCaptionDescription = styled.p`
    font-size: 12px;
    color: ${colorAdditional};
    margin: 0;
    line-height: 16px;
`;
