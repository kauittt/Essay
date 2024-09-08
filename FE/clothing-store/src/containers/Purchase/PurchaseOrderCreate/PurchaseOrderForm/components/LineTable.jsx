import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-bootstrap';
// eslint-disable-next-line 
import ReactTableBase from '@/shared/components/table/ReactTableBase';
import {
  Card, CardBody, CardTitleWrap, CardTitle,
  // eslint-disable-next-line 
} from '@/shared/components/Card';

const EditableReactTable = ({ reactTableData, onChangeData }) => {
  const [rows, setData] = useState(reactTableData.tableRowsData);

  const updateEditableData = (rowIndex, columnId, value) => {
    setData(old => old.map((item, index) => {
      if (index === rowIndex) {
        return {
          ...old[rowIndex],
          [columnId]: value,
        };
      }
      return item;
    }));
  };

  useEffect(() => {
    if (onChangeData) {
      const filteredRows = rows.filter(row => row.no !== '');
      onChangeData(filteredRows);
    }
    // eslint-disable-next-line 
  }, [rows]);

  const tableConfig = {
    isEditable: true,
    manualPageSize: [10, 20, 30, 40],
  };

  return (
    <Col md={12} lg={12}>
      <Card>
        <CardBody>
          <div>
            <CardTitleWrap>
              <CardTitle>Lines</CardTitle>
            </CardTitleWrap>
          </div>
          <ReactTableBase
            columns={reactTableData.tableHeaderData}
            data={rows}
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
    tableHeaderData: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })).isRequired,
    tableRowsData: PropTypes.arrayOf(PropTypes.shape({
      no: PropTypes.string,
    })).isRequired,
  }).isRequired,
  onChangeData: PropTypes.func,
};

EditableReactTable.defaultProps = {
  onChangeData: () => {},
};

export default EditableReactTable;
