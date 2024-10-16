import React, { useMemo } from "react";

const CreateCategoryHeader = (t) => {
    const columns = useMemo(
        () => [
            {
                Header: t("store:category.no"), // "Số thứ tự"
                accessor: "no",
            },
            {
                Header: t("store:category.name"), // "Tên"
                accessor: "name",
            },
            {
                Header: t("store:category.action"),
                accessor: "action",
                disableGlobalFilter: true,
            },
        ],
        [t]
    );

    const categoryTableData = {
        tableHeaderData: columns,
        tableRowsData: [],
    };
    return categoryTableData;
};

export default CreateCategoryHeader;
