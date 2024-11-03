import React from "react";
import PropTypes from "prop-types";
import {
    useTable,
    useGlobalFilter,
    usePagination,
    useSortBy,
    useResizeColumns,
    useRowSelect,
} from "react-table";
import styled from "styled-components";
import { scrollbarStyles } from "@/utils/palette";

import ReactTableHeader from "@/shared/components/table/components/ReactTableHeader";
import ReactTableFooter from "@/shared/components/table/components/ReactTableFooter";
import { Table } from "@/shared/components/TableElements";
import { useTranslation } from "react-i18next";
import BodyReactTable from "./ReactTableBody";

const ReactTableConstructor = ({
    tableConfig = {
        isEditable: false,
        isResizable: false,
        isSortable: false,
        withDragAndDrop: false,
        withPagination: false,
        withSearchEngine: false,
        manualPageSize: [10, 20, 30, 40],
        placeholder: "Search...",
    },
    tableOptions = [
        {
            columns: [],
            data: [],
            setFilterValue: () => {},
            updateDraggableData: () => {},
            updateEditableData: () => {},
            defaultColumn: [],
            withDragAndDrop: false,
            dataLength: null,
            disableSortBy: false,
            manualSortBy: false,
            manualGlobalFilter: false,
            manualPagination: false,
        },
    ],
    tableOptionalHook,
}) => {
    const {
        isEditable,
        isResizable,
        isSortable,
        withPagination,
        withSearchEngine,
        manualPageSize,
        placeholder,
    } = tableConfig;

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        footerGroups,
        state,
        rows,
        prepareRow,
        page,
        pageCount,
        pageOptions,
        gotoPage,
        previousPage,
        canPreviousPage,
        nextPage,
        canNextPage,
        setPageSize,
        setGlobalFilter,
        withDragAndDrop,
        updateDraggableData,
        updateEditableData,
        dataLength,
        state: { pageIndex, pageSize },
    } = useTable(
        tableOptions,
        useGlobalFilter,
        useSortBy,
        usePagination,
        useResizeColumns,
        useRowSelect,
        ...tableOptionalHook
    );
    const { t } = useTranslation(["common", "errors"]);

    return (
        <div>
            {/*//* Table  */}
            <TableWrap pagination={withPagination}>
                <Table {...getTableProps()} bordered>
                    <ReactTableHeader
                        headerGroups={headerGroups}
                        isSortable={isSortable}
                        isResizable={isResizable}
                    />
                    <BodyReactTable
                        page={page}
                        getTableBodyProps={getTableBodyProps}
                        prepareRow={prepareRow}
                        updateDraggableData={updateDraggableData}
                        updateEditableData={updateEditableData}
                        isEditable={isEditable}
                        withDragAndDrop={withDragAndDrop}
                    />
                    {/*//! sửa chổ này  */}
                    {!withPagination && rows.length !== 0 && (
                        <ReactTableFooter footerGroups={footerGroups} />
                    )}
                </Table>
            </TableWrap>
        </div>
    );
};

ReactTableConstructor.propTypes = {
    tableConfig: PropTypes.shape({
        isEditable: PropTypes.bool,
        isResizable: PropTypes.bool,
        isSortable: PropTypes.bool,
        withDragAndDrop: PropTypes.bool,
        withPagination: PropTypes.bool,
        withSearchEngine: PropTypes.bool,
        manualPageSize: PropTypes.arrayOf(PropTypes.number),
        placeholder: PropTypes.string,
    }),
    tableOptions: PropTypes.shape({
        columns: PropTypes.arrayOf(
            PropTypes.shape({
                key: PropTypes.string,
                name: PropTypes.string,
            })
        ),
        data: PropTypes.arrayOf(PropTypes.shape()),
        setFilterValue: PropTypes.func,
        updateDraggableData: PropTypes.func,
        updateEditableData: PropTypes.func,
        defaultColumn: PropTypes.oneOfType([
            PropTypes.any,
            PropTypes.shape({
                Cell: PropTypes.func,
            }).isRequired,
        ]),
        isEditable: PropTypes.bool,
        withDragAndDrop: PropTypes.bool,
        dataLength: PropTypes.number,
    }),
    tableOptionalHook: PropTypes.arrayOf(PropTypes.func).isRequired,
};

export default ReactTableConstructor;

// region STYLES

const TableWrap = styled.div`
    overflow-x: auto;

    ${scrollbarStyles};

    ${(props) =>
        props.pagination
            ? `
    margin-bottom: 1rem;
  `
            : `
    height: 458px;
  
    tbody {
      top: 30px;
    }
  `}
`;

// endregion