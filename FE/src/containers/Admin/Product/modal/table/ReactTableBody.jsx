import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Field } from "react-final-form";
import ReactTableDnDBody from "@/shared/components/table/components/ReactTableDnDBody";
import TableFormField from "./TableFormField";

const ReactTableDefaultBody = ({
    page,
    getTableBodyProps,
    prepareRow,
    updateEditableData,
}) => (
    <tbody {...getTableBodyProps()}>
        {page.map((row) => {
            prepareRow(row);
            const { key, ...rowProps } = row.getRowProps(); //* Extract key from row props
            return (
                <tr key={key} {...rowProps}>
                    {row.cells.map((cell, index) => {
                        const { id } = cell.column;

                        const { key: cellKey, ...cellProps } =
                            cell.getCellProps(); //* Extract key from cell props
                        return (
                            <td key={cellKey} {...cellProps}>
                                {/* {cell.render("Cell")} */}
                                <Field
                                    component={TableFormField}
                                    name={`${row.index}-${id}`}
                                    type="text"
                                    onCellChange={(value) => {
                                        updateEditableData(
                                            row.index,
                                            id,
                                            value
                                        );
                                    }}
                                    value={cell.value ?? ""}
                                    cellValue={cell.value ?? ""}
                                    disabled={cell.column.disabled}
                                />
                            </td>
                        );
                    })}
                </tr>
            );
        })}
    </tbody>
);

ReactTableDefaultBody.propTypes = {
    page: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    getTableBodyProps: PropTypes.func.isRequired,
    prepareRow: PropTypes.func.isRequired,
};

const TableBody = ({
    page,
    getTableBodyProps,
    prepareRow,
    withDragAndDrop,
    updateDraggableData,
    updateEditableData,
}) => {
    const theme = useSelector((state) => state.theme);

    return withDragAndDrop ? (
        <ReactTableDnDBody
            page={page}
            getTableBodyProps={getTableBodyProps}
            prepareRow={prepareRow}
            updateDraggableData={updateDraggableData}
            theme={theme}
        />
    ) : (
        <ReactTableDefaultBody
            page={page}
            getTableBodyProps={getTableBodyProps}
            prepareRow={prepareRow}
            updateEditableData={updateEditableData}
        />
    );
};

TableBody.propTypes = {
    page: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    getTableBodyProps: PropTypes.func.isRequired,
    prepareRow: PropTypes.func.isRequired,
    updateDraggableData: PropTypes.func.isRequired,
    withDragAndDrop: PropTypes.bool.isRequired,
};

export default TableBody;
