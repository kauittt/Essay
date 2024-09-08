import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import HorizontalForm from './PurchaseOrderForm/index';

const DataTable = () => {
  const { t } = useTranslation('common');
  const history = useHistory();

  return (
    <Container>
      <Row>
        <Col md={12}>
          <h3 className="page-title">{t('Purchase order')}</h3>
        </Col>
      </Row>
      <Row>
        <HorizontalForm
          onSubmit={(value) => {
            if (!value.vendor) {
              alert('Select vendor');
            } else if (!value.posting_date) {
              alert('Select posting date');
            } else if (!value.due_date) {
              alert('Select due date');
            } else if (!value.order_date) {
              alert('Select order date');
            } else if (!value.status) {
              alert('Select status');
            } else if (value.tableData.length < 1) {
              alert('Insert at least one row');
            } else {
              console.log(value);
              history.push({
                pathname: '/pages/purchase/order',
                state: { newrow: value },
              });
            }
          }}
        />
      </Row>
    </Container>
  );
};

export default DataTable;
