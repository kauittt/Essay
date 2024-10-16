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
