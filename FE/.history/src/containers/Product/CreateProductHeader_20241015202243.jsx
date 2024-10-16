import React, { useMemo } from "react";

const CreateCategoryHeader = (t) => {
    const columns = useMemo(
        () => [
            {
                Header: t("store:product.no"), // "Số thứ tự"
                accessor: "no",
            },
            {
                Header: t("store:product.name"), // "Tên"
                accessor: "name",
            },
            {
                Header: t("store:product.description"), // "Mô tả"
                accessor: "description",
            },
            {
                Header: t("store:product.stock"), // "Kho hàng"
                accessor: "stock",
            },
            {
                Header: t("store:product.category"), // "Danh mục"
                accessor: "convertedCategories",
            },
            {
                Header: t("store:product.price"), // "Giá"
                accessor: "price",
                Cell: ({ value }) =>
                    value != null ? `${value.toLocaleString()} VND` : "", // Check for null or undefined
            },
            {
                Header: t("user.table.action"),
                accessor: "action",
                disableGlobalFilter: true,
            },
        ],
        [t]
    );

    const customerTableData = {
        tableHeaderData: columns,
        tableRowsData: [],
    };
    return customerTableData;
};

export default CreateCategoryHeader;
