import React, { useMemo } from "react";

const CreateVoucherHeader = (t) => {
    const columns = useMemo(
        () => [
            {
                Header: t("store:no"),
                accessor: "no",
            },
            {
                Header: t("store:voucher:name"),
                accessor: "name",
            },
            {
                Header: t("store:voucher:discountPercentage"),
                accessor: "discountPercentage",
            },
            {
                Header: t("store:voucher:products"),
                accessor: "convertedProduct",
            },
            {
                Header: t("store:voucher:quantity"),
                accessor: "quantity",
            },
            {
                Header: t("store:voucher:startDate"),
                accessor: "startDate",
            },
            {
                Header: t("store:voucher:endDate"),
                accessor: "endDate",
            },
            {
                Header: t("action.action"),
                accessor: "action",
                disableGlobalFilter: true,
            },
        ],
        [t]
    );

    const voucherTableData = {
        tableHeaderData: columns,
        tableRowsData: [],
    };
    return voucherTableData;
};

export default CreateVoucherHeader;
