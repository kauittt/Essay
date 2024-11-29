import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Col } from "react-bootstrap";
import {
    Card,
    CardBody,
    CardTitleWrap,
    CardTitle,
} from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { selectSizes } from "../../../../../redux/reducers/sizeSlice";
import ReactTableBase from "./ReactTableBase";

const EditableReactTable = ({ reactTableData, onTableDataUpdate, data }) => {
    const { t } = useTranslation(["common", "SaleTranslations", "errors"]);
    const dispatch = useDispatch();
    const sizes = useSelector(selectSizes);

    //* init/setup data
    const [rows, setData] = useState(
        data?.sizeProducts?.map((item) => ({
            id: item.size.id,
            size: item.size.name,
            stock: item.stock,
            updateDate: item.updateDate,
        })) ||
            sizes?.map((size) => ({
                size: size,
                stock: 0,
            }))
    );
    const [withPagination, setWithPaginationTable] = useState(true);
    const [isSortable, setIsSortable] = useState(false);
    const [withSearchEngine, setWithSearchEngine] = useState(false);

    //* Row in table
    const rowsData = useMemo(() => {
        return rows?.map((item) => ({
            ...item,
        }));
    }, [rows, t]);

    //* update CELL
    const updateEditableData = (rowIndex, columnId, value) => {
        setData((old) =>
            old.map((row, index) => {
                if (index === rowIndex) {
                    const updatedRow = { ...row, [columnId]: value };

                    if (columnId === "no") {
                        const selectedItem = items.find(
                            (item) => item.no === value
                        );
                        if (selectedItem) {
                            const locationCode =
                                updatedRow.locationCode || "YELLOW";
                            return {
                                ...updatedRow,
                                description: selectedItem.description || "",
                                unitPrice: selectedItem.unitPrice || "",
                                lineAmount: updatedRow.quantity
                                    ? updatedRow.quantity *
                                      selectedItem.unitPrice
                                    : 0,
                                locationCode: locationCode,
                            };
                        }
                    }

                    if (columnId === "description") {
                        const selectedItem = items.find(
                            (item) => item.description === value
                        );
                        if (selectedItem) {
                            const locationCode =
                                updatedRow.locationCode || "YELLOW";
                            return {
                                ...updatedRow,
                                no: selectedItem.no || "",
                                unitPrice: selectedItem.unitPrice || "",
                                lineAmount: updatedRow.quantity
                                    ? updatedRow.quantity *
                                      selectedItem.unitPrice
                                    : 0,
                                locationCode: locationCode,
                            };
                        }
                    }

                    if (columnId === "quantity") {
                        return {
                            ...updatedRow,
                            quantity: value,
                            lineAmount: value * (updatedRow.unitPrice || 0),
                        };
                    }

                    return updatedRow;
                }
                return row;
            })
        );
    };

    //* gửi update về Modal
    useEffect(() => {
        // console.log("Effect row", rows);
        onTableDataUpdate(rows);
    }, [rows, onTableDataUpdate]);

    //* Default component's config
    const handleClickIsSortable = () => {
        setIsSortable(!isSortable);
    };

    const handleClickWithPagination = () => {
        setWithPaginationTable(!withPagination);
    };

    const handleClickWithSearchEngine = () => {
        setWithSearchEngine(!withSearchEngine);
    };

    const tableConfig = {
        isEditable: true,
        isSortable,
        isResizable: false,
        withPagination,
        withSearchEngine,
        manualPageSize: [10, 20, 30, 40],
        placeholder: "Search by ...",
    };

    return (
        <Col md={12} lg={12}>
            <Card>
                <CardBody>
                    {/*//* Table  */}
                    <ReactTableBase
                        key={withSearchEngine ? "searchable" : "common"}
                        columns={reactTableData.tableHeaderData}
                        data={rowsData}
                        updateEditableData={updateEditableData}
                        tableConfig={tableConfig}
                    />
                </CardBody>
            </Card>
        </Col>
    );
};

EditableReactTable.propTypes = {
    reactTableData: PropTypes.shape({
        tableHeaderData: PropTypes.arrayOf(
            PropTypes.shape({
                key: PropTypes.string,
                name: PropTypes.string,
            })
        ),
        tableRowsData: PropTypes.arrayOf(PropTypes.shape()),
    }).isRequired,
    onTableDataUpdate: PropTypes.func,
    data: PropTypes.object,
};

export default EditableReactTable;
