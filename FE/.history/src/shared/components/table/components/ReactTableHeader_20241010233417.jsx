// ReactTableHeader.jsx
import React from "react";
import PropTypes from "prop-types";
import SortIcon from "mdi-react/SortIcon";
import SortAscendingIcon from "mdi-react/SortAscendingIcon";
import SortDescendingIcon from "mdi-react/SortDescendingIcon";

// Header Component to Render Column Headers
const Header = ({ column, isSortable }) => (
    <span className="react-table__column-header">
        <span
            className={isSortable ? "react-table__column-header sortable" : ""}
        >
            {column.render("Header")}
        </span>
        {/* Render Sorting Icons if Sortable and Column Can Sort */}
        {isSortable && column.canSort && <Sorting column={column} />}
    </span>
);

Header.propTypes = {
    column: PropTypes.shape({
        Header: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
            .isRequired,
        canSort: PropTypes.bool,
        render: PropTypes.func.isRequired,
    }).isRequired,
    isSortable: PropTypes.bool.isRequired,
};

// Sorting Icons Component
const Sorting = ({ column }) => (
    <span className="react-table__column-header sortable">
        {column.isSorted ? (
            column.isSortedDesc ? (
                <SortDescendingIcon />
            ) : (
                <SortAscendingIcon />
            )
        ) : (
            <SortIcon />
        )}
    </span>
);

Sorting.propTypes = {
    column: PropTypes.shape({
        isSorted: PropTypes.bool,
        isSortedDesc: PropTypes.bool,
    }).isRequired,
};

// Utility Function for Resizer Styles
const getStylesResizable = (props, align = "left") => [
    props,
    {
        style: {
            justifyContent: align === "right" ? "flex-end" : "flex-start",
            alignItems: "flex-start",
            display: "flex",
        },
    },
];

// ReactTableHeader Component
const ReactTableHeader = ({ headerGroups, isResizable, isSortable }) => {
    return (
        <thead>
            {headerGroups.map((headerGroup) => (
                <tr
                    {...headerGroup.getHeaderGroupProps()}
                    className="react-table thead tr"
                >
                    {headerGroup.headers.map((column) => {
                        // Combine All Necessary Header Props in a Single Call
                        const headerProps = column.getHeaderProps([
                            isSortable ? column.getSortByToggleProps() : {},
                            isResizable ? column.getResizerProps() : {},
                        ]);

                        // Destructure 'key' from Header Props
                        const { key, ...restProps } = headerProps;

                        return (
                            <th key={key} {...restProps}>
                                {/* Render Header Content */}
                                <Header
                                    column={column}
                                    isSortable={isSortable}
                                />

                                {/* Render Resizer if Resizable */}
                                {isResizable && (
                                    <div
                                        {...column.getResizerProps()}
                                        className={`resizer ${
                                            column.isResizing
                                                ? "isResizing"
                                                : ""
                                        }`}
                                    />
                                )}
                            </th>
                        );
                    })}
                </tr>
            ))}
        </thead>
    );
};

ReactTableHeader.propTypes = {
    headerGroups: PropTypes.arrayOf(
        PropTypes.shape({
            headers: PropTypes.arrayOf(PropTypes.object).isRequired,
            getHeaderGroupProps: PropTypes.func.isRequired,
        })
    ).isRequired,
    isResizable: PropTypes.bool.isRequired,
    isSortable: PropTypes.bool.isRequired,
};

export default ReactTableHeader;
