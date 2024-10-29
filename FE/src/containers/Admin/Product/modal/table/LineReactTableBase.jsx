import React, { useState } from "react";
import PropTypes from "prop-types";
import { useFlexLayout } from "react-table";
import ReactTableCellEditable from "@/shared/components/table/components/ReactTableEditableCell";
import ReactTableCell from "@/shared/components/table/components/ReactTableCell";
import LineReactTableConstructor from "./LineReactTableConstructor";

const LineReactTableBase = ({
    tableConfig = {
        isEditable: false,
        isResizable: false,
        isSortable: false,
        withDragAndDrop: false,
        withPagination: false,
        withSearchEngine: false,
        manualPageSize: [],
    },
    columns = [
        { Header: "#", accessor: "id" },
        { Header: "Header Example Title one", accessor: "first" },
        { Header: "Header Example Title two", accessor: "last" },
    ],
    data = [
        {
            id: 1,
            first: "Cell Example Data one",
            last: "Cell Example Data two",
        },
        {
            id: 2,
            first: "Cell Example Data three",
            last: "Cell Example Data four",
        },
    ],
    updateDraggableData = () => {},
    updateEditableData = () => {},
}) => {
    const {
        isEditable,
        isResizable,
        isSortable,
        withDragAndDrop,
        withPagination,
        withSearchEngine,
        manualPageSize,
    } = tableConfig;

    const [filterValue, setFilterValue] = useState(null);

    const tableOptions = {
        columns,
        data,
        updateDraggableData,
        updateEditableData,
        setFilterValue,
        defaultColumn: {},
        isEditable,
        withDragAndDrop: withDragAndDrop || false,
        dataLength: data.length,
        autoResetPage: false,
        disableSortBy: !isSortable,
        manualSortBy: !isSortable,
        manualGlobalFilter: !withSearchEngine,
        manualPagination: !withPagination,
        initialState: {
            pageIndex: 0,
            pageSize: manualPageSize ? manualPageSize[0] : 10,
            globalFilter:
                withSearchEngine && filterValue ? filterValue : undefined,
        },
    };

    let tableOptionalHook = [];
    if (isResizable) tableOptionalHook = [useFlexLayout];
    if (withSearchEngine) {
        tableOptions.defaultColumn = {
            Cell: ReactTableCell,
        };
    }
    if (isEditable) {
        tableOptions.defaultColumn = {
            Cell: ReactTableCellEditable,
        };
    }

    return (
        <LineReactTableConstructor
            key={isResizable || isEditable ? "modified" : "common"}
            tableConfig={tableConfig}
            tableOptions={tableOptions}
            tableOptionalHook={tableOptionalHook}
        />
    );
};

LineReactTableBase.propTypes = {
    tableConfig: PropTypes.shape({
        isEditable: PropTypes.bool,
        isResizable: PropTypes.bool,
        isSortable: PropTypes.bool,
        withDragAndDrop: PropTypes.bool,
        withPagination: PropTypes.bool,
        withSearchEngine: PropTypes.bool,
        manualPageSize: PropTypes.arrayOf(PropTypes.number),
    }),
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string,
            name: PropTypes.string,
        })
    ),
    data: PropTypes.arrayOf(PropTypes.shape()),
    updateDraggableData: PropTypes.func,
    updateEditableData: PropTypes.func,
};

export default LineReactTableBase;
