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
import LineReactTableBase from "./LineReactTableBase";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { selectSizes } from "../../../../../redux/reducers/sizeSlice";

const LineEditableReactTable = ({
    reactTableData,
    onTableDataUpdate,
    data,
    setDeletedLines,
}) => {
    const { t } = useTranslation(["common", "SaleTranslations", "errors"]);
    const dispatch = useDispatch();
    const sizes = useSelector(selectSizes);

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

    // console.log("rows", rows);

    //* Add action button
    const rowsData = useMemo(() => {
        return rows?.map((item, index) => ({
            ...item,
            action: (
                <Col
                    key={index}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                    }}
                >
                    <Button
                        variant="danger"
                        onClick={() => handleDelete(item, index)}
                        style={{ margin: "0" }}
                    >
                        <span>{t("action.delete")}</span>
                    </Button>
                </Col>
            ),
        }));
    }, [rows, t]);

    const handleDelete = async (item, index) => {
        // console.log("Delete Line index: ", index);
        // console.log("rows", rows);
        setData((currentRows) =>
            currentRows.filter((row, idx) => idx !== index)
        );
        setDeletedLines((prev) => [...prev, item]);
    };

    //* Add new ROW
    const handleAddRow = () => {
        setData([
            ...rows,
            {
                type: 1,
                no: "",
                description: "",
                locationCode: "",
                quantity: "",
                qtyToAssembleToOrder: "",
                unitOfMeasureCode: "",
                unitPrice: "",
                lineDiscount: "",
                lineAmount: "",
                qtyToAssign: "",
                qtyAssigned: "",
            },
        ]);
    };

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
        console.log("Effect row", rows);
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
        placeholder: "Search by First name...",
    };

    return (
        <Col md={12} lg={12}>
            <Card>
                <CardBody>
                    {/*//* Title  */}
                    {/* <div className="d-flex justify-content-end align-items-center bs">
                        <Button variant="primary" onClick={handleAddRow}>
                            {t("action.add")}
                        </Button>
                    </div> */}

                    {/*//* Table  */}
                    <LineReactTableBase
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

LineEditableReactTable.propTypes = {
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
    setDeletedLines: PropTypes.func,
};

export default LineEditableReactTable;
