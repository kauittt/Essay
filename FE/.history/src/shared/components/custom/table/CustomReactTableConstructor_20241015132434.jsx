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

import ReactTableHeader from "../../table/components/ReactTableHeader";
import BodyReactTable from "../../table/components/ReactTableBody";
import ReactTableFooter from "../../table/components/ReactTableFooter";
import ReactTablePagination from "../../table/components/ReactTablePagination";
import { Table } from "../../TableElements";
import CustomReactTableFilter from "./CustomReactTableFilter";
import { useTranslation } from "react-i18next";

const CustomReactTableConstructor = ({
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
    tableOptions = {
        columns: [],
        data: [],
        setFilterValue: () => {},
        updateDraggableData: () => {},
        updateEditableData: () => {},
        defaultColumn: {},
        withDragAndDrop: false,
        dataLength: 0,
        disableSortBy: false,
        manualSortBy: false,
        manualGlobalFilter: false,
        manualPagination: false,
    },
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
            {/*//* Search  */}
            {withSearchEngine && (
                <CustomReactTableFilter
                    rows={rows}
                    setGlobalFilter={setGlobalFilter}
                    setFilterValue={tableOptions.setFilterValue}
                    globalFilter={state.globalFilter}
                    placeholder={placeholder}
                    dataLength={dataLength}
                />
            )}

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

            {/*//* Pagination  */}
            {withPagination && rows.length > 0 && (
                <ReactTablePagination
                    page={page}
                    gotoPage={gotoPage}
                    previousPage={previousPage}
                    nextPage={nextPage}
                    canPreviousPage={canPreviousPage}
                    canNextPage={canNextPage}
                    pageOptions={pageOptions}
                    pageSize={pageSize}
                    pageIndex={pageIndex}
                    pageCount={pageCount}
                    setPageSize={setPageSize}
                    manualPageSize={manualPageSize}
                    dataLength={dataLength}
                />
            )}
        </div>
    );
};

CustomReactTableConstructor.propTypes = {
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

export default CustomReactTableConstructor;

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
