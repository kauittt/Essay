import React from "react";
import PropTypes from "prop-types";

const ReactTableFooter = ({ footerGroups }) => (
    <tfoot className="tfoot">
        {footerGroups.map((group) => {
            // Extract key from getFooterGroupProps and spread the rest
            const { key: groupKey, ...groupProps } =
                group.getFooterGroupProps();
            return (
                <tr key={groupKey} {...groupProps}>
                    {group.headers.map((column) => {
                        // Similarly, handle keys for columns
                        const { key: columnKey, ...columnProps } =
                            column.getFooterProps();
                        return (
                            <td key={columnKey} {...columnProps}>
                                {column.render("Footer")}
                            </td>
                        );
                    })}
                </tr>
            );
        })}
    </tfoot>
);
ReactTableFooter.propTypes = {
    footerGroups: PropTypes.arrayOf(
        PropTypes.shape({
            headers: PropTypes.arrayOf(PropTypes.shape()),
            getFooterGroupProps: PropTypes.func,
        })
    ).isRequired,
};

export default ReactTableFooter;
