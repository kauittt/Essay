import React, { useMemo } from "react";

const CreateCategoryHeader = (t) => {
    const columns = useMemo(
        () => [
            {
                Header: t("store:no"),
                accessor: "no",
            },
            {
                Header: t("store:category.tableName"),
                accessor: "tableName",
            },
            {
                Header: t("action.action"),
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
