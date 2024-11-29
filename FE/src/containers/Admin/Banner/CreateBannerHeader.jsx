import React, { useMemo } from "react";

const CreateBannerHeader = (t) => {
    const columns = useMemo(
        () => [
            {
                Header: t("store:no"),
                accessor: "no",
            },
            {
                Header: t("store:banner.image"),
                accessor: "path",
                Cell: ({ value }) =>
                    value ? (
                        <img
                            src={value}
                            alt="Banner Image"
                            // style={{
                            //     boxShadow:
                            //         "rgba(0, 0, 0, 0.05) 0px 2px 15px 0px",
                            // }}
                            className="tw-h-[80px] tw-max-h-[50px] tw-w-[80px] tw-max-w-[50px] 
                            tw-object-cover tw-rounded-[5px] tw-shadow-md"
                        />
                    ) : (
                        ""
                    ),
            },
            {
                Header: t("store:banner.upload"),
                accessor: "username",
            },
            {
                Header: t("action.action"),
                accessor: "action",
                disableGlobalFilter: true,
            },
        ],
        [t]
    );

    const bannerTableData = {
        tableHeaderData: columns,
        tableRowsData: [],
    };
    return bannerTableData;
};

export default CreateBannerHeader;
