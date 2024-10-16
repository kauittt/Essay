import React, { useMemo } from "react";

const CreateCustomerHeader = (t) => {
    const columns = useMemo(
        () => [
            {
                Header: t("customer.table.no"),
                accessor: "no",
                // disableGlobalFilter: true,
            },
            {
                Header: t("customer.table.name"),
                accessor: "name",
                // disableGlobalFilter: true,
            },
            {
                Header: t("customer.table.responsibilityCenter"),
                accessor: "responsibilityCenter",
                // disableGlobalFilter: true,
            },
            {
                Header: t("customer.table.locationCode"),
                accessor: "locationCode",
                // disableGlobalFilter: true,
            },
            {
                Header: t("customer.table.phoneNo"),
                accessor: "phoneNo",
                // disableGlobalFilter: true,
            },
            {
                Header: t("customer.table.contact"),
                accessor: "contact",
                // disableGlobalFilter: true,
            },
            {
                Header: t("customer.table.balanceLCY"),
                accessor: "balanceLCY",
                // disableGlobalFilter: true,
            },
            {
                Header: t("customer.table.balanceDueLCY"),
                accessor: "balanceDueLCY",
                // disableGlobalFilter: true,
            },
            {
                Header: t("customer.table.salesLCY"),
                accessor: "salesLCY",
                // disableGlobalFilter: true,
            },
            {
                Header: t("customer.table.paymentLCY"),
                accessor: "paymentLCY",
                // disableGlobalFilter: true,
            },
            {
                Header: t("customer.table.action"),
                accessor: "action",
                disableGlobalFilter: true,
            },
        ],
        [t] // Thêm t vào dependencies của useMemo để đảm bảo cập nhật khi ngôn ngữ thay đổi
    );

    const customerTableData = {
        tableHeaderData: columns,
        tableRowsData: [],
    };
    return customerTableData;
};

export default CreateCustomerHeader;
