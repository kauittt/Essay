import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import { Button } from '@/shared/components/Button';
import CreateTableData from './components/CreateData';
import PurchaseOrderListTable from './components/PurchaseOrderListTable';

const DataTable = () => {
  const { t } = useTranslation('common');
  const [reactTableData, setReactTableData] = useState(CreateTableData());

  return (
    <Container>
      <Row>
        <Col md={12}>
          <h3 className="page-title">{t('Purchase Orders')}</h3>
        </Col>
      </Row>
      <Row>
        <PurchaseOrderListTable reactTableData={reactTableData} />
      </Row>
      <Button
        as={Link}
        variant="primary"
        to="/pages/purchase/new_order"
      >
        New
      </Button>
      <Button
        variant="secondary"
        as="button"
        onClick={() => {
          localStorage.removeItem('purchaseOrderRows');
          const updatedData = {
            ...reactTableData,
            tableRowsData: [],
          };

          setReactTableData(updatedData);
        }}
      >
        Cancel
      </Button>

    </Container>
  );
};

export default DataTable;
