import React, { useState } from "react";
import Collapse from "@/shared/components/Collapse";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import CreateOrderProductHeader from "./product/CreateOrderProductHeader";
import { useDispatch } from "react-redux";
import CustomReactTableBase from "@/shared/components/custom/table/CustomReactTableBase";

const ListProduct = ({ data }) => {
    const { t, i18n } = useTranslation(["common", "errors", "store"]);
    let language = i18n.language;
    const enter = t("action.enter");

    const reactTableData = CreateOrderProductHeader(t);
    const dispatch = useDispatch();

    const [withPagination, setWithPaginationTable] = useState(true);
    const [isSortable, setIsSortable] = useState(false);
    const [withSearchEngine, setWithSearchEngine] = useState(false);

    const handleClickIsSortable = () => {
        setIsSortable(!isSortable);
    };

    const handleClickWithPagination = () => {
        setWithPaginationTable(!withPagination);
    };

    const handleClickWithSearchEngine = () => {
        setWithSearchEngine(!withSearchEngine);
    };

    const mapPlaceholder =
        t("tables.customizer.search.search") + " " + t("store:product.titles");

    const tableConfig = {
        isSortable,
        isResizable: false,
        withPagination,
        withSearchEngine,
        manualPageSize: [10, 20, 30, 40],
        placeholder: mapPlaceholder,
    };

    let processedData = data.map((row, index) => {
        return {
            ...row,
            no: index + 1,
            totalPrice: row.price * row.quantity,
            tableName: language == "en" ? row.enName : row.name,
        };
    });

    console.log(processedData);

    return (
        <Collapse title={t("store:product.titles")} className="with-shadow">
            <CustomReactTableBase
                key={withSearchEngine ? "searchable" : "common"}
                columns={reactTableData.tableHeaderData}
                data={processedData}
                tableConfig={tableConfig}
                component="orderProduct"
            />
        </Collapse>
    );
};

ListProduct.propTypes = {
    data: PropTypes.array.isRequired,
};

export default ListProduct;
