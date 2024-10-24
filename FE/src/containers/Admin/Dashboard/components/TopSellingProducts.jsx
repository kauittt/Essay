import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Pie, Tooltip, Legend } from "recharts";
import Panel from "@/shared/components/Panel";
import getTooltipStyles from "@/shared/helpers";
import {
    DashboardChartLegend,
    DashboardPieChart,
    DashboardPieChartContainer,
} from "../BasicDashboardComponents";
import { selectOrders } from "../../../../redux/reducers/orderSlice";

// Styling for the legend
const style = (dir) => {
    const left = dir === "ltr" ? { left: 0 } : { right: 0 };
    return {
        ...left,
        width: 150,
        lineHeight: "24px",
        position: "absolute",
    };
};

// Custom legend rendering function
const renderLegend = ({ payload }) => (
    <DashboardChartLegend>
        {payload.map((entry) => (
            <li key={entry.payload.id}>
                <span style={{ backgroundColor: entry.color }} />
                {entry.value}
            </li>
        ))}
    </DashboardChartLegend>
);

renderLegend.propTypes = {
    payload: PropTypes.arrayOf(
        PropTypes.shape({
            color: PropTypes.string,
            value: PropTypes.string,
        })
    ).isRequired,
};

// Color scheme for the pie chart
const colors = ["#70bbfd", "#4ce1b6", "#f6da6e", "#ff4861", "#C9CBCF"];

const TopSellingProducts = ({ dir }) => {
    const { t } = useTranslation("common");
    const [coordinates, setCoordinate] = useState({ x: 0, y: 0 });

    const themeName = useSelector((state) => state.theme.className);

    // Fetching the orders from the Redux store
    const orders = useSelector(selectOrders);
    const productQuantities = {};

    // Processing the product quantities from the orders
    orders?.forEach((order) => {
        order.orderProducts.forEach((orderProduct) => {
            const product = orderProduct.product;
            const quantity = orderProduct.quantity;

            // Initialize or update the product's sold quantity
            if (!productQuantities[product.id]) {
                productQuantities[product.id] = {
                    id: product.id,
                    name: product.name,
                    value: 0, // Starting with 0 sales
                };
            }
            productQuantities[product.id].value += quantity;
        });
    });

    // Sorting products by sold quantity and taking the top 5
    const sortedProducts = Object.values(productQuantities).sort(
        (a, b) => b.value - a.value
    );
    const top5Products = sortedProducts.slice(0, 5);

    // Assigning colors to top 5 products
    const dataWithColors = top5Products.map((product, index) => ({
        ...product,
        fill: colors[index % colors.length],
    }));

    // Tooltip movement handler
    const onMouseMove = (e) => {
        if (e.tooltipPosition) {
            setCoordinate({
                x:
                    dir === "ltr"
                        ? e.tooltipPosition.x
                        : e.tooltipPosition.x / 10,
                y: e.tooltipPosition.y,
            });
        }
    };

    return (
        <Panel
            lg={12}
            xl={6}
            md={12}
            xs={12}
            title={t("store:dashboard.topSelling")}
        >
            <div dir={dir}>
                <DashboardCommercePieChartContainer height={400}>
                    <DashboardPieChart>
                        <Tooltip
                            position={coordinates}
                            {...getTooltipStyles(themeName)}
                        />
                        <Pie
                            data={dataWithColors}
                            dataKey="value"
                            cy={180}
                            innerRadius={130}
                            outerRadius={160}
                            label
                            onMouseMove={onMouseMove}
                        />
                        <Legend
                            layout="vertical"
                            verticalAlign="bottom"
                            wrapperStyle={style(dir)}
                            content={renderLegend}
                        />
                    </DashboardPieChart>
                </DashboardCommercePieChartContainer>
            </div>
        </Panel>
    );
};

TopSellingProducts.propTypes = {
    dir: PropTypes.string.isRequired,
};

export default TopSellingProducts;

// Styling for the PieChart container
const DashboardCommercePieChartContainer = styled(DashboardPieChartContainer)`
    @media screen and (min-width: 768px) {
        height: 360px !important;

        ${DashboardPieChart} {
            height: 360px !important;
        }
    }

    .recharts-legend-wrapper {
        @media screen and (min-width: 370px) {
            bottom: 10px !important; // Đã chỉnh từ 0 lên 10px
        }
        @media screen and (min-width: 700px) {
            bottom: 80px !important; // Đã chỉnh từ 70 lên 80px
        }
        @media screen and (min-width: 1020px) {
            bottom: -20px !important; // Đã chỉnh từ -30 lên -20px
        }
        @media screen and (min-width: 1200px) {
            bottom: -45px !important; // Đã chỉnh từ -55 lên -45px
        }
        @media screen and (min-width: 1400px) {
            bottom: -15px !important; // Đã chỉnh từ -25 lên -15px
        }
        @media screen and (min-width: 1800px) {
            bottom: -20px !important; // Đã chỉnh từ -30 lên -20px
        }
    }
`;
