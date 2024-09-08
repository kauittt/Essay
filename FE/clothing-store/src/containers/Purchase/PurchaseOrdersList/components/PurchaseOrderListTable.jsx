import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import ReactTableBase from '@/shared/components/table/ReactTableBase';
import ReactTableCustomizer from '@/shared/components/table/components/ReactTableCustomizer';
import {
  Card, CardBody,
} from '@/shared/components/Card';

const PurchaseOrderListTable = ({ reactTableData }) => {
  const [rows, setData] = useState(() => {
    const savedRows = localStorage.getItem('purchaseOrderRows');
    return savedRows ? JSON.parse(savedRows) : reactTableData.tableRowsData;
  });

  const [withPagination, setWithPaginationTable] = useState(true);
  const [isSortable, setIsSortable] = useState(false);
  const [withSearchEngine, setWithSearchEngine] = useState(false);
  const location = useLocation();

  const { newrow } = location.state || { newrow: [] };

  useEffect(() => {
    if (newrow.vendor !== undefined) {
      const row = {
        no: newrow.vendor.no,
        name: newrow.vendor.name,
        address: newrow.vendor.address,
        posting_date: newrow.posting_date,
        due_date: newrow.due_date,
        order_date: newrow.order_date,
        status: newrow.status.value,
        item: newrow.tableData.length,
      };
      const updatedRows = [...rows, row];
      setData(updatedRows);
      localStorage.setItem('purchaseOrderRows', JSON.stringify(updatedRows));
    }
    // eslint-disable-next-line 
  }, [newrow]);

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
    isSortable,
    isResizable: false,
    withPagination,
    withSearchEngine,
    manualPageSize: [10, 20, 30, 40],
    placeholder: 'Search by First name...',
  };

  return (
    <Col md={12} lg={12}>
      <Card>
        <CardBody>
          <div>
            <ReactTableCustomizer
              handleClickIsSortable={handleClickIsSortable}
              handleClickWithPagination={handleClickWithPagination}
              handleClickWithSearchEngine={handleClickWithSearchEngine}
              isSortable={isSortable}
              withPagination={withPagination}
              withSearchEngine={withSearchEngine}
            />
          </div>
          <ReactTableBase
            key={withSearchEngine ? 'searchable' : 'common'}
            columns={reactTableData.tableHeaderData}
            data={rows}
            tableConfig={tableConfig}
          />
        </CardBody>
      </Card>
    </Col>
  );
};

PurchaseOrderListTable.propTypes = {
  reactTableData: PropTypes.shape({
    tableHeaderData: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string,
      name: PropTypes.string,
    })),
    tableRowsData: PropTypes.arrayOf(PropTypes.shape()),
  }).isRequired,
};

export default PurchaseOrderListTable;

