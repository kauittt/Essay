import React, { useState, useMemo, useEffect } from "react";
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
import styled, { createGlobalStyle } from "styled-components";
import { selectOrders } from "@/redux/reducers/orderSlice";
import { selectProducts } from "@/redux/reducers/productSlice";
import { useTranslation } from "react-i18next";
import FormInput from "@/shared/components/custom/form/FormInput";
import {
    FormContainer,
    FormButtonToolbar,
} from "@/shared/components/form/FormElements";
import { Col, Container, Row } from "react-bootstrap";
import { Button } from "@/shared/components/Button";
import { Form } from "react-final-form";
import { Card, CardBody } from "@/shared/components/Card";
import PropTypes from "prop-types";

const ProductSalesAreaChart = ({ orders, products }) => {
    const { t } = useTranslation(["common", "errors", "store"]);

    const types = ["Quantity", "Money"];

    const [selectedType, setSelectedType] = useState(types[0]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedYear, setSelectedYear] = useState(
        new Date().getFullYear().toString()
    );

    const handleProductsSelect = (value) => {
        setSelectedProducts(value);
    };

    const handleYearSelect = (value) => {
        setSelectedYear(value);
    };

    const handleTypeSelect = (value) => {
        setSelectedType(value);
    };

    const availableYears = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = 0; i < 5; i++) {
            years.push(currentYear - i);
        }
        return years;
    }, []);

    const inputs = [
        {
            label: "Type",
            name: "type",
            type: "select",
            options: types?.map((type) => ({
                value: type,
                label: type,
            })),
        },
        {
            label: "Year",
            name: "year",
            type: "select",
            options: availableYears?.map((year) => ({
                value: year + "",
                label: year + "",
            })),
        },
        {
            label: t("store:product.titles"),
            name: "products",
            type: "multiSelect",
            options: products?.map((product) => ({
                value: product.id,
                label: product.name,
            })),
        },
    ];

    // Process sales data only when orders, products, or selectedYear change
    const salesData = useMemo(
        () => processSalesData(orders, products, selectedYear, selectedType),
        [orders, products, selectedYear, selectedType]
    );

    const submitForm = (values) => {
        console.log("Submit values", values);
    };

    let initValue = {
        year: selectedYear,
        products: selectedProducts,
        type: selectedType,
    };

    return (
        <Panel lg={12} title="Product Sales Overview">
            <Form onSubmit={submitForm} initialValues={initValue}>
                {({ handleSubmit, form }) => {
                    //* Handle việc select No/Name
                    useEffect(() => {
                        const unsubscribe = form.subscribe(
                            ({ values }) => {
                                {
                                    /* console.log("values change", values); */
                                }
                                if (values.year != selectedYear) {
                                    handleYearSelect(values.year);
                                }
                                if (values.products != selectedProducts) {
                                    handleProductsSelect(values.products);
                                }

                                if (values.type != selectedType) {
                                    handleTypeSelect(values.type);
                                }
                            },
                            {
                                values: {
                                    type: true,
                                    year: true,
                                    products: true,
                                },
                            }
                        );

                        return unsubscribe;
                    }, [form]);
                    return (
                        <FormContainer onSubmit={handleSubmit}>
                            <Col md={12} lg={12}>
                                <Card style={{ marginBottom: "0px" }}>
                                    <CardBody>
                                        {inputs?.map((input, index) => {
                                            return (
                                                <FormInput
                                                    key={index}
                                                    data={input}
                                                ></FormInput>
                                            );
                                        })}
                                    </CardBody>
                                </Card>
                            </Col>
                        </FormContainer>
                    );
                }}
            </Form>

            <DashboardAreaChartContainer height={300}>
                <AreaChart
                    data={salesData}
                    margin={{ top: 20, left: -15, bottom: 20 }}
                >
                    {/* //* Define the gradient for the area chart */}
                    <defs>
                        {selectedProducts?.map((productId, idx) => {
                            const colorIndex = productId % chartColors.length;
                            return (
                                <linearGradient
                                    id={`colorGrad${idx}`}
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                    key={idx}
                                >
                                    <stop
                                        offset="5%"
                                        stopColor={chartColors[colorIndex]}
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor={chartColors[colorIndex]}
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            );
                        })}
                    </defs>
                    <XAxis dataKey="name" tickLine={false} />
                    <YAxis
                        tickLine={false}
                        width={150}
                        //! Here format
                        tickFormatter={(number) => {
                            return `${number.toLocaleString()} VNĐ`;
                        }}
                    />
                    <Tooltip
                        {...getTooltipStyles("themeName", "defaultItems")}
                        //! Format
                        formatter={(number) => {
                            return `${number.toLocaleString()} VNĐ`;
                        }}
                    />
                    <Legend />
                    <CartesianGrid strokeDasharray="3 3" />
                    {selectedProducts?.map((productId, idx) => {
                        const product = products.find(
                            (p) => p.id === productId
                        );
                        const colorIndex = productId % chartColors.length; // Use modulo to cycle through colors
                        return (
                            <Area
                                key={idx}
                                type="monotone"
                                dataKey={product.name}
                                stroke={chartColors[colorIndex]}
                                fillOpacity={1}
                                fill={`url(#colorGrad${idx})`} // Referencing the defined gradient ID
                            />
                        );
                    })}
                </AreaChart>
            </DashboardAreaChartContainer>
        </Panel>
    );
};

const chartColors = [
    "#007bff", // Vivid Blue
    "#28a745", // Green
    "#dc3545", // Red
    "#ffc107", // Yellow
    "#000000", // Black
    "#17a2b8", // Cyan
    "#6f42c1", // Purple
    "#ff00ff", // Orange
    "#20c997", // Teal
    "#fa8072", // Indigo
];

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
const processSalesData = (orders, products, selectedYear, selectedType) => {
    const salesData = {}; // { productId: { 'month-year': salesCount or salesMoney } }

    orders?.forEach((order) => {
        order.orderProducts.forEach((orderProduct) => {
            const productId = orderProduct.product.id;
            const monthYear = getMonthYear(order.createDate);
            const product = products.find((p) => p.id === productId);

            if (!salesData[productId]) {
                salesData[productId] = {}; // Initialize product entry
            }
            if (!salesData[productId][monthYear]) {
                salesData[productId][monthYear] = 0; // Initialize month entry
            }

            // Check if the type selected is 'Money' and calculate sales accordingly
            if (selectedType === "Money") {
                salesData[productId][monthYear] +=
                    orderProduct.quantity * product.price;
            } else {
                salesData[productId][monthYear] += orderProduct.quantity;
            }
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

    console.log("chartData", chartData);
    return chartData; // Return array suitable for recharts
};

export default ProductSalesAreaChart;

ProductSalesAreaChart.propTypes = {
    orders: PropTypes.array,
    products: PropTypes.array,
};
