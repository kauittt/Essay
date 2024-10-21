import React, { useMemo } from "react";
import Badge from "@/shared/components/Badge";

const CreateUserHeader = (t) => {
    const getStatusBadge = (text) => {
        return <Badge bg="primary">{text}</Badge>;
    };
    const columns = useMemo(
        () => [
            {
                Header: t("store:no"), // "User"
                accessor: "no",
            },
            {
                Header: t("store:user:username"), // "Username"
                accessor: "username",
            },
            {
                Header: t("store:user:name"), // "Name"
                accessor: "name",
            },
            {
                Header: t("store:user:authorities"), // "Authorities"
                Cell: ({ value }) => getStatusBadge(value),
                accessor: "convertedAuthorities",
            },
            {
                Header: t("store:user:phone"), // "Phone"
                accessor: "phone",
            },
            {
                Header: t("store:user:email"), // "Email"
                accessor: "email",
            },
            {
                Header: t("store:user:address"), // "Address"
                accessor: "address",
            },
            {
                Header: t("action.action"),
                accessor: "action",
                disableGlobalFilter: true,
            },
        ],
        [t]
    );

    const userTableData = {
        tableHeaderData: columns,
        tableRowsData: [], // This would be populated with user data in a real application
    };
    return userTableData;
};

export default CreateUserHeader;
