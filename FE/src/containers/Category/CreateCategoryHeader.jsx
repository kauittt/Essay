import React, { useMemo } from "react";

const CreateCategoryHeader = (t) => {
    const columns = useMemo(
        () => [
            {
                Header: t("store:category.no"),
                accessor: "no",
            },
            {
                Header: t("store:category.name"),
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
