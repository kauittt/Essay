import React, { useMemo } from "react";

const CreateFeedbackHeader = (t) => {
    const columns = useMemo(
        () => [
            {
                Header: t("store:no"), // "Số thứ tự"
                accessor: "no",
            },
            {
                Header: t("store:product.tableName"), // "Tên"
                accessor: "tableName",
            },
            {
                Header: t("store:product.image"), // "Mô tả"
                accessor: "image",
                Cell: ({ value }) =>
                    value ? (
                        <img
                            src={value}
                            alt="Product Image"
                            className="tw-h-[80px] tw-max-h-[50px] tw-w-[80px] tw-max-w-[50px] 
                            tw-object-cover tw-rounded-[5px] tw-shadow-md"
                        />
                    ) : (
                        ""
                    ),
            },
            {
                Header: t("store:size.title"), // "Kho hàng"
                accessor: "size",
            },
            {
                Header: t("store:product.quantity"), // "Kho hàng"
                accessor: "quantity",
            },
            {
                Header: t("store:product.price"), // "Giá"
                accessor: "price",
                Cell: ({ value }) =>
                    value != null ? `${value.toLocaleString()} VNĐ` : "", // Check for null or undefined
            },
            {
                Header: t("store:product.totalPrice"), // "Giá"
                accessor: "totalPrice",
                Cell: ({ value }) =>
                    value != null ? `${value.toLocaleString()} VNĐ` : "", // Check for null or undefined
            },
            {
                Header: t("action.action"),
                accessor: "action",
                disableGlobalFilter: true,
            },
        ],
        [t]
    );

    const productTableData = {
        tableHeaderData: columns,
        tableRowsData: [],
    };
    return productTableData;
};

export default CreateFeedbackHeader;
