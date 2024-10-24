import React, { useMemo } from "react";
import Badge from "@/shared/components/Badge";

const CreateOrderHeader = (t) => {
    const getStatusBadge = (status) => {
        // console.log("Status", status);
        if (status === "CANCEL") return <Badge bg="danger">{status}</Badge>;
        if (status === "DONE") return <Badge bg="success">{status}</Badge>;
        return <Badge bg="warning">{status}</Badge>;
    };

    const columns = useMemo(
        () => [
            {
                Header: t("store:no"),
                accessor: "no",
            },
            {
                Header: t("store:order.id"),
                accessor: "id",
            },
            {
                Header: t("store:order.name"),
                accessor: "name",
            },
            {
                Header: t("store:order.phone"),
                accessor: "phone",
            },
            {
                Header: t("store:order.address"),
                accessor: "address",
            },
            {
                Header: t("store:order.createDate"),
                accessor: "createDate",
            },
            {
                Header: t("store:order.updateDate"),
                accessor: "updateDate",
            },
            {
                Header: t("store:invoice.totalDue"),
                accessor: "invoiceTotalDue",
            },
            {
                Header: t("store:order.status"),
                accessor: "status",
                Cell: ({ value }) => getStatusBadge(value),
                disableGlobalFilter: true,
            },
            {
                Header: t("action.action"),
                accessor: "action",
                disableGlobalFilter: true,
            },
        ],
        [t]
    );

    const orderTableData = {
        tableHeaderData: columns,
        tableRowsData: [],
    };
    return orderTableData;
};

export default CreateOrderHeader;
