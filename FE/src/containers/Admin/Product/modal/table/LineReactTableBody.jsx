import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Field } from "react-final-form";
import renderSelectField from "./LineSelect";
import renderLineItemSelectField from "./LineItemSelect";
import { FormGroupField } from "@/shared/components/form/FormElements";
import { colorLightGray } from "@/utils/palette";
import LineFormField from "./LineFormField";
import ReactTableDnDBody from "@/shared/components/table/components/ReactTableDnDBody";

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
                        const cellType = cell.column.type || "text";
                        const options = cell.column.options || [];
                        {
                            /* console.log("cell", cell); */
                        }

                        if (cellType === "action") {
                            return (
                                <td
                                    {...cell.getCellProps()}
                                    name={`${row.index}-${id}`}
                                >
                                    {cell.value}
                                </td>
                            );
                        }

                        if (cellType === "select") {
                            return (
                                <td {...cell.getCellProps()}>
                                    <Field
                                        name={`${row.index}-${id}`}
                                        // name={cell.column.id}
                                        component={renderSelectField}
                                        options={options}
                                        value={cell.value}
                                        cellValue={cell.value}
                                        onCellChange={(value) => {
                                            updateEditableData(
                                                row.index,
                                                id,
                                                value
                                            );
                                        }}
                                    />
                                </td>
                            );
                        }

                        if (cellType === "itemSelect") {
                            return (
                                <td {...cell.getCellProps()}>
                                    <Field
                                        name={`${row.index}-${id}`}
                                        // name={cell.column.id}
                                        component={renderLineItemSelectField}
                                        options={options}
                                        value={cell.value}
                                        cellValue={cell.value}
                                        onCellChange={(value) => {
                                            updateEditableData(
                                                row.index,
                                                id,
                                                value
                                            );
                                        }}
                                    />
                                </td>
                            );
                        }

                        const { key: cellKey, ...cellProps } =
                            cell.getCellProps(); //* Extract key from cell props
                        return (
                            <td key={cellKey} {...cellProps}>
                                {/* {cell.render("Cell")} */}
                                <Field
                                    component={LineFormField}
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

const LineTableBody = ({
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

LineTableBody.propTypes = {
    page: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    getTableBodyProps: PropTypes.func.isRequired,
    prepareRow: PropTypes.func.isRequired,
    updateDraggableData: PropTypes.func.isRequired,
    withDragAndDrop: PropTypes.bool.isRequired,
};

export default LineTableBody;
