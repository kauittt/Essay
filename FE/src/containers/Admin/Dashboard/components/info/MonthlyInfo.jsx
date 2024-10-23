import React from "react";
import { Col } from "react-bootstrap";
import TrendingDownIcon from "mdi-react/TrendingDownIcon";
import TrendingUpIcon from "mdi-react/TrendingUpIcon";
import ProgressBar from "@/shared/components/ProgressBar";
import { Card } from "@/shared/components/Card";
import { useSelector } from "react-redux";
import { selectOrders } from "../../../../../redux/reducers/orderSlice";
import moment from "moment";
import { colorGreen } from "@/utils/palette";
import { colorBlue } from "@/utils/palette";
import { colorRed } from "@/utils/palette";
import { colorAccent } from "@/utils/palette";
import { colorYellow } from "@/utils/palette";

import {
    DashboardBookingCard,
    DashboardBookingDescription,
    DashboardBookingTitle,
    DashboardBookingTotalWrap,
} from "./BookingCardDashboardElements";
import PropTypes from "prop-types";

const MonthlyInfo = ({
    title = "",
    percent = "",
    description = "",
    color = "",
    noPercent = false,
    gradient,
}) => {
    const colorMappings = {
        colorRed: colorRed,
        colorAccent: colorAccent,
        colorBlue: colorBlue,
        colorYellow: colorYellow,
    };

    const handleColor = (color) => {
        return colorMappings[color];
    };

    return (
        <Col md={12} xl={3} lg={6} xs={12}>
            <Card>
                <DashboardBookingCard>
                    <div className="tw-h-[100%] tw-flex tw-flex-col tw-justify-between tw-bg-gray-500">
                        <DashboardBookingTotalWrap>
                            <DashboardBookingTitle color={handleColor(color)}>
                                {title}
                            </DashboardBookingTitle>

                            {percent >= 100 ? (
                                <TrendingUpIcon />
                            ) : (
                                <TrendingDownIcon />
                            )}
                        </DashboardBookingTotalWrap>
                        <DashboardBookingDescription>
                            {description}
                        </DashboardBookingDescription>
                        <ProgressBar
                            now={percent}
                            label={noPercent ? "" : `${percent}%`}
                            rounded
                            size="small"
                            gradient={gradient}
                            top
                        />
                    </div>
                </DashboardBookingCard>
            </Card>
        </Col>
    );
};

MonthlyInfo.propTypes = {
    // title: PropTypes.string.isRequired,
    // description: PropTypes.string.isRequired,
    // percent: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    //     .isRequired,
    // color: PropTypes.string.isRequired,
};

export default MonthlyInfo;
