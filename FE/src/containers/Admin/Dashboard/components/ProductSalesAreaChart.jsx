import React, { useState, useMemo, useEffect, useRef } from "react";
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
import * as XLSX from "xlsx"; // Import thư viện XLSX
import { selectVouchers } from "@/redux/reducers/voucherSlice";

const ProductSalesAreaChart = ({ orders, products }) => {
    const { t, i18n } = useTranslation(["common", "errors", "store"]);
    let language = i18n.language;
    const types = ["Quantity", "Money", "Voucher"];
    const vouchers = useSelector(selectVouchers);
    const yearRef = useRef(new Date().getFullYear().toString());

    const handleUpdateYearRef = (year) => {
        yearRef.current = year;
    };

    const [vouchersData, setVouchersData] = useState([]);
    const [ordersData, setOrdersData] = useState(
        orders.filter((order) => order.status == "DONE")
    );

    useEffect(() => {
        setOrdersData(orders.filter((order) => order.status == "DONE"));
    }, [orders]);

    useEffect(() => {
        setSelectedProducts(
            products
                ?.map((product) => product.id)
                .concat("total")
                .concat("totalDiscount")
                .concat("totalReal")
        );
    }, [products]);

    useEffect(() => {
        setVouchersData(vouchers);
        setSelectedVouchers(
            vouchers?.map((voucher) => voucher.id).concat("total")
        );
    }, [vouchers]);

    // console.log("order", orders);
    // console.log("ordersData", ordersData);

    const [selectedType, setSelectedType] = useState(types[1]);
    const [selectedProducts, setSelectedProducts] = useState([]); //* Init bằng useEffect
    const [selectedVouchers, setSelectedVouchers] = useState([]); //* Init bằng useEffect
    const [selectedYear, setSelectedYear] = useState(
        new Date().getFullYear().toString()
    );

    const handleProductsSelect = (value) => {
        if (value.length == products.length) {
            value = [...value, "total", "totalDiscount", "totalReal"];
        } else if (value.length >= 2) {
            value = [...value, "total"];
        }

        setSelectedProducts(value);
    };

    const handleVouchersSelect = (value) => {
        if (value.length >= 2) {
            value = [...value, "total"];
        }

        setSelectedVouchers(value);
    };

    const handleYearSelect = (value) => {
        setSelectedYear(value);
        handleUpdateYearRef(value);
    };

    const handleTypeSelect = (value) => {
        setSelectedType(value);
    };

    //* Array years
    const availableYears = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = 0; i < 5; i++) {
            years.push(currentYear - i);
        }
        return years;
    }, []);

    //* 3 field input
    const inputs = [
        {
            label: t("store:dashboard.chart.type.title"),
            name: "type",
            type: "select",
            options: [
                {
                    value: "Money",
                    label: t("store:dashboard.chart.type.revenue"),
                },
                {
                    value: "Quantity",
                    label: t("store:dashboard.chart.type.sold"),
                },
                {
                    value: "Voucher",
                    label: t("store:voucher.title"),
                },
            ],
        },
        {
            label: t("store:dashboard.chart.year"),
            name: "year",
            type: "select",
            options: availableYears?.map((year) => ({
                value: year + "",
                label: year + "",
            })),
        },
        {
            label:
                selectedType === "Voucher"
                    ? t("store:voucher.titles")
                    : t("store:product.titles"),
            name: "items",
            type: "multiSelect",
            options:
                selectedType === types[2]
                    ? vouchersData?.map((voucher) => ({
                          value: voucher.id,
                          label:
                              language === "en" ? voucher.enName : voucher.name,
                      }))
                    : products?.map((product) => ({
                          value: product.id,
                          label:
                              language === "en" ? product.enName : product.name,
                      })),
        },
    ];

    // Process sales data only when orders, products, or selectedYear change
    const salesData = useMemo(
        () =>
            processSalesData(
                ordersData,
                products,
                selectedYear,
                selectedType,
                t,
                language,
                selectedProducts,
                selectedVouchers,
                vouchersData
            ),
        [
            ordersData,
            products,
            selectedYear,
            selectedType,
            t,
            language,
            selectedProducts,
            selectedVouchers,
            vouchersData,
        ]
    );

    const generateExcel = () => {
        const data = [];
        const voucherData = [];
        let totalRevenue = 0;
        const month = language == "en" ? "Month" : "Tháng";
        // const isFull = filteredProducts.length == products.length;

        //! Product data
        let dataExport = processSalesData(
            ordersData,
            products,
            selectedYear,
            types[1],
            t,
            language,
            products.map((product) => product.id),
            selectedVouchers,
            vouchersData
        );
        dataExport.forEach((item) => {
            let totalRevenuePerMonth = 0;
            //* Tháng
            const headerTime = [month, item.name];
            data.push(headerTime);

            //* Header
            const header = [
                t("store:product.productName"),
                t("store:product.price"),
                t("store:product.quantity"),
                t("store:dashboard.chart.totalRevenue"),
            ];
            data.push(header);

            products.forEach((product) => {
                const name = language == "en" ? product.enName : product.name;
                if (item[name] != undefined) {
                    //* Row
                    const row = [
                        name, // Tên sản phẩm
                        product.price.toLocaleString() + " VNĐ",
                        Math.round(item[name] / product.price).toLocaleString(), // Làm tròn số lượng
                        item[name].toLocaleString() + " VNĐ", // Tổng doanh thu
                    ];
                    data.push(row);
                    totalRevenuePerMonth += item[name];
                    totalRevenue += item[name];
                }
            });
            //* Per month
            const totalPerMonth = [
                t("store:dashboard.chart.totalRevenuePerMonth"),
                totalRevenuePerMonth.toLocaleString() + " VNĐ",
            ];
            data.push(totalPerMonth);

            // if (isFull) {
            //* Total discount per month
            let totalDiscount = 0;
            ordersData.map((order) => {
                if (getMonthYear(order.createDate) == item.name) {
                    totalDiscount += order.invoice.discountAmount;
                }
            });
            const discount = [
                t("store:dashboard.chart.totalDiscount"),
                totalDiscount.toLocaleString() + " VNĐ",
                ,
            ];
            data.push(discount);

            //* Total Real
            const calcRealRevenue = totalRevenuePerMonth - totalDiscount;
            const real = [
                t("store:dashboard.chart.totalRealRevenue"),
                calcRealRevenue.toLocaleString() + " VNĐ",
            ];
            data.push(real);
            // }

            //* Space
            const space = [""]; // Thêm khoảng cách
            data.push(space);
        });
        //* TOTAL
        const total = [
            t("store:dashboard.chart.totalRevenue"),
            totalRevenue.toLocaleString() + " VNĐ",
        ];
        data.push(total);

        //! Voucher Data
        dataExport = processSalesData(
            ordersData,
            products,
            selectedYear,
            types[2],
            t,
            language,
            selectedProducts,
            vouchersData.map((voucher) => voucher.id),
            vouchersData
        );
        dataExport.forEach((item) => {
            let totalDiscountPerMonth = 0;
            //* Voucher Data Header
            const headerTime = [month, item.name];
            voucherData.push(headerTime);

            //* Voucher Header Row
            const header = [
                t("store:voucher.tableName"),
                t("store:dashboard.chart.totalDiscount"),
            ];
            voucherData.push(header);

            // const selectedSet = new Set(selectedVouchers);
            // const filteredVouchers = vouchersData.filter((voucher) =>
            //     selectedSet.has(voucher.id)
            // );

            // filteredVouchers.forEach((voucher) => {
            vouchersData.forEach((voucher) => {
                const name = language == "en" ? voucher.enName : voucher.name;
                const discount = item[name] || 0;
                voucherData.push([name, discount.toLocaleString() + " VNĐ"]);

                totalDiscountPerMonth += discount;
            });

            //* Total discount per month
            const discountPerMonth = [
                t("store:dashboard.chart.totalDiscountPerMonth"),
                totalDiscountPerMonth.toLocaleString() + " VNĐ",
                ,
            ];
            voucherData.push(discountPerMonth);

            //* Add Space
            const space = [""];
            voucherData.push(space);
        });

        //* Create Product Worksheet
        const ws = XLSX.utils.aoa_to_sheet(data);
        // Tự mở rộng cột
        ws["!cols"] = ws["!cols"] = [
            { wch: 30 }, // Cột A - tự mở rộng đủ cho tên sản phẩm
            { wch: 20 }, // Cột B - tự mở rộng cho giá
            null, // Cột C - không cần mở rộng
            { wch: 20 }, // Cột D - tự mở rộng cho tổng doanh thu
        ];

        //* Create Voucher Worksheet
        const wsVouchers = XLSX.utils.aoa_to_sheet(voucherData);
        wsVouchers["!cols"] = [{ wch: 30 }, { wch: 20 }];

        // Lấy phạm vi dữ liệu trong worksheet
        const range = XLSX.utils.decode_range(ws["!ref"]);

        const headerStyle = {
            font: { bold: true, color: { rgb: "FFFFFF" } }, // In đậm, chữ trắng
            fill: { patternType: "solid", fgColor: { rgb: "4CAF50" } }, // Nền xanh lá
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            },
        };

        const contentStyle = {
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            },
        };

        const totalStyle = {
            font: { bold: true, color: { rgb: "000000" } },
            fill: { patternType: "solid", fgColor: { rgb: "FFFFE0" } }, // Nền vàng nhạt
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            },
        };

        // Gắn style cho từng ô
        for (let R = range.s.r; R <= range.e.r; R++) {
            for (let C = range.s.c; C <= range.e.c; C++) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                if (!ws[cellAddress]) continue;

                // Style cho header
                if (
                    R === 1 ||
                    (data[R - 1] &&
                        data[R - 1].includes(t("store:product.productName")))
                ) {
                    ws[cellAddress].s = headerStyle;
                }
                // Style cho dòng tổng doanh thu theo tháng
                else if (
                    data[R - 1] &&
                    data[R - 1].includes(
                        t("store:dashboard.chart.totalRevenuePerMonth")
                    )
                ) {
                    ws[cellAddress].s = totalStyle;
                }
                // Style cho nội dung
                else {
                    ws[cellAddress].s = contentStyle;
                }
            }
        }

        // Tạo workbook và thêm worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sales Data");
        XLSX.utils.book_append_sheet(wb, wsVouchers, "Voucher Data");

        // Xuất file
        const fileName = t("store:dashboard.export.button");
        XLSX.writeFile(wb, `${fileName}-${yearRef.current}.xlsx`);
    };

    //* Form set up
    const submitForm = (values) => {
        // console.log("Submit values", values);
    };

    let initValue = {
        year: selectedYear,
        items: selectedType == types[2] ? selectedVouchers : selectedProducts,
        type: selectedType,
    };

    // console.log("products", products);
    // console.log("salesData", salesData);
    console.log("selectedProducts", selectedProducts);
    console.log("selectedVouchers", selectedVouchers);

    const selectedSet = new Set(selectedProducts);
    const filteredProducts = products.filter((product) =>
        selectedSet.has(product.id)
    );
    // console.log("filteredProducts", filteredProducts);
    console.log("-------");

    return (
        <Panel lg={12} title={t("store:dashboard.chart.title")}>
            <Form onSubmit={submitForm} initialValues={initValue}>
                {({ handleSubmit, form }) => {
                    //* Handle việc select No/Name
                    useEffect(() => {
                        const unsubscribe = form.subscribe(
                            ({ values }) => {
                                console.log("values change", values);

                                if (values.year != selectedYear) {
                                    handleYearSelect(values.year);
                                }

                                if (values.type != selectedType) {
                                    handleTypeSelect(values.type);
                                    if (values.type == types[2]) {
                                        setSelectedVouchers(
                                            vouchers
                                                ?.map((voucher) => voucher.id)
                                                .concat("total")
                                        );
                                    } else {
                                        setSelectedProducts(
                                            products
                                                ?.map((product) => product.id)
                                                .concat("total")
                                                .concat("totalDiscount")
                                                .concat("totalReal")
                                        );
                                    }
                                }

                                if (selectedType != types[2]) {
                                    if (values.items != selectedProducts) {
                                        handleProductsSelect(values.items);
                                    }
                                }

                                if (selectedType == types[2]) {
                                    if (values.items != selectedVouchers) {
                                        handleVouchersSelect(values.items);
                                    }
                                }
                            },
                            {
                                values: {
                                    type: true,
                                    year: true,
                                    items: true,
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

                                        <Button
                                            variant="primary"
                                            onClick={generateExcel}
                                        >
                                            {t("store:dashboard.export.button")}
                                        </Button>
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
                            const colorIndex = idx % chartColors.length;
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
                            return `${number.toLocaleString()} ${
                                selectedType == types[1] ? "VNĐ" : ""
                            }`;
                        }}
                    />
                    <Tooltip
                        {...getTooltipStyles("themeName", "defaultItems")}
                        //! Format
                        formatter={(number) => {
                            return `${number.toLocaleString()} ${
                                selectedType == types[1] ? "VNĐ" : ""
                            }`;
                        }}
                    />
                    <Legend />
                    <CartesianGrid strokeDasharray="3 3" />
                    {selectedType != types[2] &&
                        selectedProducts?.map((productId, idx) => {
                            const colorIndex = idx % chartColors.length; // Use modulo to cycle through colors
                            const fieldName =
                                selectedType == types[0]
                                    ? `[${t(
                                          "store:dashboard.chart.totalQuantity"
                                      )}]`
                                    : `[${t(
                                          "store:dashboard.chart.totalRevenue"
                                      )}]`;

                            if (productId == "total") {
                                return (
                                    <Area
                                        key={idx}
                                        type="monotone"
                                        dataKey={fieldName}
                                        stroke={chartColors[colorIndex]}
                                        fillOpacity={1}
                                        fill={`url(#colorGrad${idx})`} // Referencing the defined gradient ID
                                    />
                                );
                            }

                            if (productId == "totalDiscount") {
                                return (
                                    <Area
                                        key={idx}
                                        type="monotone"
                                        dataKey={`[${t(
                                            "store:dashboard.chart.totalDiscount"
                                        )}]`}
                                        stroke={chartColors[colorIndex]}
                                        fillOpacity={1}
                                        fill={`url(#colorGrad${idx})`} // Referencing the defined gradient ID
                                    />
                                );
                            }

                            if (productId == "totalReal") {
                                return (
                                    <Area
                                        key={idx}
                                        type="monotone"
                                        dataKey={`[${t(
                                            "store:dashboard.chart.totalRealRevenue"
                                        )}]`}
                                        stroke={chartColors[colorIndex]}
                                        fillOpacity={1}
                                        fill={`url(#colorGrad${idx})`} // Referencing the defined gradient ID
                                    />
                                );
                            }

                            const product = products.find(
                                (p) => p.id === productId
                            );

                            const productName =
                                language === "en"
                                    ? product.enName
                                    : product.name;

                            return (
                                <Area
                                    key={idx}
                                    type="monotone"
                                    dataKey={productName}
                                    stroke={chartColors[colorIndex]}
                                    fillOpacity={1}
                                    fill={`url(#colorGrad${idx})`} // Referencing the defined gradient ID
                                />
                            );
                        })}

                    {selectedType == types[2] &&
                        selectedVouchers?.map((voucherId, idx) => {
                            const colorIndex = idx % chartColors.length; // Use modulo to cycle through colors
                            const fieldName = `[${t(
                                "store:dashboard.chart.totalDiscount"
                            )}]`;

                            if (voucherId == "total") {
                                return (
                                    <Area
                                        key={idx}
                                        type="monotone"
                                        dataKey={fieldName}
                                        stroke={chartColors[colorIndex]}
                                        fillOpacity={1}
                                        fill={`url(#colorGrad${idx})`} // Referencing the defined gradient ID
                                    />
                                );
                            }

                            const voucher = vouchersData.find(
                                (v) => v.id === voucherId
                            );

                            {
                                /* if (!voucher) return; */
                            }

                            const voucherName =
                                language === "en"
                                    ? voucher.enName
                                    : voucher.name;

                            return (
                                <Area
                                    key={idx}
                                    type="monotone"
                                    dataKey={voucherName}
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
    "#F8C304", // Yellow
    "#86a845",
    "#17a2b8", // Cyan
    "#6f42c1", // Purple
    "#A6522B", // Orange
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

    //* Nếu là .now() thì lấy 11 tháng trước
    if (selectedYear === currentYear) {
        const months = [];
        for (let i = 11; i >= 0; i--) {
            const d = new Date(currentYear, now.getMonth() - i, 1);
            months.push(`${d.getMonth() + 1}-${d.getFullYear()}`); // e.g., "10-2024"
        }
        return months;
    }

    //* Else lấy 12 tháng trong năm
    const months = [];
    for (let i = 0; i < 12; i++) {
        const d = new Date(selectedYear, i, 1);
        months.push(`${d.getMonth() + 1}-${d.getFullYear()}`);
    }
    return months;
};

// Function to process sales data per product for the selected year and months
const processSalesData = (
    orders,
    products,
    selectedYear,
    selectedType,
    t,
    language,
    selectedProducts,
    selectedVouchers,
    vouchers
) => {
    const types = ["Quantity", "Money", "Voucher"];
    const salesData = {}; // { productId: { 'month-year': salesCount or salesMoney } }

    orders?.forEach((order) => {
        const monthYear = getMonthYear(order.createDate);

        //* Voucher
        if (selectedType === types[2]) {
            const voucherId = order?.voucher?.id || null;

            if (!voucherId) return;

            if (!salesData[voucherId]) {
                salesData[voucherId] = {}; // Initialize product entry
            }
            if (!salesData[voucherId][monthYear]) {
                salesData[voucherId][monthYear] = 0; // Initialize month entry
            }

            salesData[voucherId][monthYear] +=
                order?.invoice?.discountAmount || 0;
        } else {
            order.orderProducts.forEach((orderProduct) => {
                const productId = orderProduct.product.id;
                const product = products.find((p) => p.id === productId);

                if (!salesData[productId]) {
                    salesData[productId] = {}; // Initialize product entry
                }
                if (!salesData[productId][monthYear]) {
                    salesData[productId][monthYear] = 0; // Initialize month entry
                }

                //* Check xem cần render count/money
                //* Money
                if (selectedType === types[1]) {
                    salesData[productId][monthYear] +=
                        orderProduct.quantity * product.price;
                }
                //* Quantity
                else if (selectedType === types[0]) {
                    salesData[productId][monthYear] += orderProduct.quantity;
                }
            });
        }
    });

    // console.log("salesData", salesData);

    const monthsForYear = getMonthsForYear(selectedYear);

    // Convert sales data to format: [{name: 'month-year', product1: value, product2: value, ...}]
    const chartData = monthsForYear.map((monthYear) => {
        let totalMoney = 0;
        const entry = { name: monthYear }; // Create an entry for each month

        //* Voucher
        if (selectedType === types[2]) {
            const selectedSet = new Set(selectedVouchers);
            const filteredVouchers = vouchers.filter((voucher) =>
                selectedSet.has(voucher.id)
            );

            filteredVouchers?.forEach((voucher) => {
                const voucherSales = salesData[voucher.id]?.[monthYear] || 0; // Set 0 if no sales
                // totalMoney += productSales;
                // entry[product.name] = productSales;
                const voucherName =
                    language === "en" ? voucher.enName : voucher.name;
                totalMoney += voucherSales;
                entry[voucherName] = voucherSales;
            });

            //* Total
            let fieldName = `[${t("store:dashboard.chart.totalDiscount")}]`;
            entry[fieldName] = totalMoney;
        }
        //* Product
        else {
            const selectedSet = new Set(selectedProducts);
            const filteredProducts = products.filter((product) =>
                selectedSet.has(product.id)
            );

            filteredProducts?.forEach((product) => {
                const productSales = salesData[product.id]?.[monthYear] || 0; // Set 0 if no sales
                // totalMoney += productSales;
                // entry[product.name] = productSales;
                const productName =
                    language === "en" ? product.enName : product.name;
                totalMoney += productSales;
                entry[productName] = productSales;
            });

            //* Calc voucher amount discounted
            let totalDiscount = 0;
            orders.map((order) => {
                if (getMonthYear(order.createDate) == monthYear) {
                    totalDiscount += order.invoice.discountAmount;
                }
            });

            let fieldName = "";

            if (selectedType === types[1]) {
                fieldName = `[${t("store:dashboard.chart.totalDiscount")}]`;
                entry[fieldName] = totalDiscount;

                fieldName = `[${t("store:dashboard.chart.totalRealRevenue")}]`;
                entry[fieldName] = totalMoney - totalDiscount;
            }

            fieldName =
                selectedType == types[0]
                    ? `[${t("store:dashboard.chart.totalQuantity")}]`
                    : `[${t("store:dashboard.chart.totalRevenue")}]`;
            entry[fieldName] = totalMoney;
        }

        return entry;
    });

    // console.log("chartData", chartData);
    return chartData; // Return array suitable for recharts
};

export default ProductSalesAreaChart;

ProductSalesAreaChart.propTypes = {
    orders: PropTypes.array,
    products: PropTypes.array,
};
