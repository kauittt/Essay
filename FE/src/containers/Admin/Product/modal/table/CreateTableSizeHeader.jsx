import React, { useMemo } from "react";
import { Button } from "@/shared/components/Button";

const CreateTableSizeHeader = (t) => {
    const columns = useMemo(
        () => [
            {
                Header: "Size",
                accessor: "size",
                disabled: true,
            },
            {
                Header: "Stock",
                accessor: "stock",
            },
        ],
        [t] // Including 't' in dependencies to ensure updates on language change
    );

    const data = [];
    const tableSizeData = {
        tableHeaderData: columns,
        tableRowsData: data,
    };

    return tableSizeData;
};

export default CreateTableSizeHeader;
