import React, { useMemo } from "react";

const CreateProductHeader = (t) => {
    const columns = useMemo(
        () => [
            {
                Header: t("customer.table.no"), // "Số thứ tự"
                accessor: "no",
            },
            {
                Header: t("customer.table.name"), // "Tên"
                accessor: "name",
            },
            {
                Header: t("customer.table.description"), // "Mô tả"
                accessor: "description",
            },
            {
                Header: t("customer.table.stock"), // "Kho hàng"
                accessor: "stock",
            },
            {
                Header: t("customer.table.category"), // "Danh mục"
                accessor: "category",
            },
            {
                Header: t("customer.table.price"), // "Giá"
                accessor: "price",
                Cell: ({ value }) => `${value.toLocaleString()} VND`, // Format the price to be more readable if needed
            },
        ],
        [t] // Include `t` in dependencies to ensure updates on language changes
    );

    const customerTableData = {
        tableHeaderData: columns,
        tableRowsData: [],
    };
    return customerTableData;
};

export default CreateProductHeader;
