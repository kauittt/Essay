import React, { useState, useMemo } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import { useSelector } from "react-redux";
import Panel from "@/shared/components/Panel";
import getTooltipStyles from "@/shared/helpers";
import { DashboardAreaChartContainer } from "../BasicDashboardComponents";
import styled from "styled-components";
import { selectOrders } from "@/redux/reducers/orderSlice";
import { selectProducts } from "@/redux/reducers/productSlice";

const StyledChartContainer = styled.div`
    padding: 20px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
`;

// Helper function to get month-year key from date
const getMonthYear = (date) => {
    const d = new Date(date);
    return `${d.getMonth() + 1}-${d.getFullYear()}`; // e.g., "10-2024"
};

// Helper function to generate months for the selected year
const getMonthsForYear = (selectedYear) => {
    const now = new Date();
    const currentYear = now.getFullYear();

    // If the selected year is the current year
    if (selectedYear === currentYear) {
        const months = [];
        for (let i = 11; i >= 0; i--) {
            const d = new Date(currentYear, now.getMonth() - i, 1);
            months.push(`${d.getMonth() + 1}-${d.getFullYear()}`); // e.g., "10-2024"
        }
        return months;
    }

    // If the selected year is earlier, return all 12 months (Jan-Dec)
    const months = [];
    for (let i = 0; i < 12; i++) {
        const d = new Date(selectedYear, i, 1);
        months.push(`${d.getMonth() + 1}-${d.getFullYear()}`);
    }
    return months;
};

// Function to process sales data per product for the selected year and months
const processSalesData = (orders, products, selectedYear) => {
    const salesData = {}; // { productId: { 'month-year': salesCount } }

    orders?.forEach((order) => {
        order.orderProducts.forEach((orderProduct) => {
            const productId = orderProduct.product.id;
            const monthYear = getMonthYear(order.createDate);

            if (!salesData[productId]) {
                salesData[productId] = {}; // Initialize product entry
            }
            if (!salesData[productId][monthYear]) {
                salesData[productId][monthYear] = 0; // Initialize month entry
            }

            salesData[productId][monthYear] += orderProduct.quantity; // Add sales count
        });
    });

    const monthsForYear = getMonthsForYear(selectedYear);

    // Convert sales data to format: [{name: 'month-year', product1: value, product2: value, ...}]
    const chartData = monthsForYear.map((monthYear) => {
        const entry = { name: monthYear }; // Create an entry for each month
        products?.forEach((product) => {
            const productSales = salesData[product.id]?.[monthYear] || 0; // Set 0 if no sales
            entry[product.name] = productSales;
        });
        return entry;
    });

    return chartData; // Return array suitable for recharts
};

const ProductSalesAreaChart = () => {
    // Fetch orders and products from Redux store
    const orders = useSelector(selectOrders);
    const products = useSelector(selectProducts);

    const [selectedProduct, setSelectedProduct] = useState(
        products ? products[0] : null
    ); // Store the selected product
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Store the selected year

    // Generate an array of years, for example, the last 5 years including this year
    const availableYears = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = 0; i < 5; i++) {
            years.push(currentYear - i);
        }
        return years;
    }, []);

    // Process sales data only when orders, products, or selectedYear change
    const salesData = useMemo(
        () => processSalesData(orders, products, selectedYear),
        [orders, products, selectedYear]
    );

    // Handle product selection
    const handleProductSelect = (e) => {
        setSelectedProduct(e.target.value); // Get selected product's name
    };

    // Handle year selection
    const handleYearSelect = (e) => {
        setSelectedYear(parseInt(e.target.value)); // Get selected year
    };

    return (
        <Panel lg={12} title="Product Sales Overview">
            <StyledChartContainer>
                {/* Year Selection Dropdown */}
                <select onChange={handleYearSelect} value={selectedYear}>
                    {availableYears.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>

                {/* Product Selection Dropdown */}
                <select
                    onChange={handleProductSelect}
                    value={selectedProduct || ""}
                >
                    <option value="" disabled>
                        Select a product
                    </option>
                    {products?.map((product) => (
                        <option key={product.id} value={product.name}>
                            {product.name}
                        </option>
                    ))}
                </select>

                <DashboardAreaChartContainer height={300}>
                    <AreaChart
                        data={salesData}
                        margin={{ top: 20, left: -15, bottom: 20 }}
                    >
                        {/* Define the gradient for the area chart */}
                        <defs>
                            <linearGradient
                                id="colorSales"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#4ce1b6"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#4ce1b6"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" tickLine={false} />
                        <YAxis tickLine={false} />
                        <Tooltip
                            {...getTooltipStyles("themeName", "defaultItems")}
                        />
                        <Legend />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Area
                            type="monotone"
                            dataKey={selectedProduct}
                            stroke="#4ce1b6"
                            fillOpacity={1}
                            fill="url(#colorSales)"
                        />
                    </AreaChart>
                </DashboardAreaChartContainer>
            </StyledChartContainer>
        </Panel>
    );
};

export default ProductSalesAreaChart;
