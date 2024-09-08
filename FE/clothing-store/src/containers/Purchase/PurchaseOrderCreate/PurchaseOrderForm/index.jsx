import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { Field, Form } from 'react-final-form';
// eslint-disable-next-line 
import renderSelectField from '@/shared/components/form/Select';

import {
  Card, CardBody, CardTitleWrap, CardTitle,
  // eslint-disable-next-line 
} from '@/shared/components/Card';
import {
  FormButtonToolbar,
  FormContainer,
  FormGroup,
  FormGroupField,
  FormGroupLabel,
  // eslint-disable-next-line 
} from '@/shared/components/form/FormElements';
// eslint-disable-next-line 
import DatePickerField from '@/shared/components/form/date-pickers/DatePicker';
// eslint-disable-next-line 
import { Button } from '@/shared/components/Button';
import EditableReactTable from './components/LineTable';
import CreateTableData from './components/CreateData';

const HorizontalForm = ({ onSubmit }) => {
  const { t } = useTranslation('common');
  const reactTableData = CreateTableData();
  const [tableData, setTableData] = useState(reactTableData.tableRowsData);
  const [selectedValue, setSelectedValue] = useState('');
  const history = useHistory();
  const handleTableDataChange = (data) => {
    setTableData(data);
  };

  const handleFormSubmit = (values) => {
    const finalValues = {
      ...values,
      tableData,
    };
    onSubmit(finalValues);
  };

  const status = [
    { value: 'open', label: 'Open' },
    { value: 'released', label: 'Released' },
  ];

  const vendors = [
    { no: '1231', name: 'quy', address: 'HCM' },
    { no: '1232', name: 'quy1', address: 'Da Lat' },
    { no: '2212', name: 'quy2', address: 'Ha Noi' },
  ];


  return (
    <Col md={12} lg={12}>
      <Card>
        <CardBody>
          <CardTitleWrap>
            <CardTitle>{t('General')}</CardTitle>
          </CardTitleWrap>
          <Form
            onSubmit={handleFormSubmit}
          >
            {({ handleSubmit, form }) => (
              <FormContainer horizontal onSubmit={handleSubmit}>
                <Col>
                  <FormGroup>
                    <FormGroupLabel>Vendor No:</FormGroupLabel>
                    <FormGroupField>
                      <Field
                        name="vendor"
                        component={renderSelectField}
                        setSelectedItem={setSelectedValue}
                        options={vendors.map(item => (
                          { ...item, value: item.no, label: item.no }
                        ))}
                      />
                    </FormGroupField>
                  </FormGroup>
                  <FormGroup>
                    <FormGroupLabel>Vendor Name:</FormGroupLabel>
                    <FormGroupField>
                      <Field
                        name="name"
                        component="input"
                        type="text"
                        readOnly
                        initialValue={selectedValue.name}
                      />
                    </FormGroupField>
                  </FormGroup>
                  <FormGroup>
                    <FormGroupLabel>Address:</FormGroupLabel>
                    <FormGroupField>
                      <Field
                        name="address"
                        component="input"
                        type="text"
                        readOnly
                        initialValue={selectedValue.address}
                      />
                    </FormGroupField>
                  </FormGroup>
                  <FormGroup>
                    <FormGroupLabel>Posting Date:</FormGroupLabel>
                    <FormGroupField>
                      <Field
                        name="posting_date"
                        component={DatePickerField}
                        type="text"
                        autoComplete="off"
                      />
                    </FormGroupField>
                  </FormGroup>
                </Col>

                <Col>
                  <FormGroup>
                    <FormGroupLabel>Due Date:</FormGroupLabel>
                    <FormGroupField>
                      <Field
                        name="due_date"
                        component={DatePickerField}
                        autoComplete="off"
                      />
                    </FormGroupField>
                  </FormGroup>
                  <FormGroup>
                    <FormGroupLabel>Order Date:</FormGroupLabel>
                    <FormGroupField>
                      <Field
                        name="order_date"
                        component={DatePickerField}
                        autoComplete="off"
                      />
                    </FormGroupField>
                  </FormGroup>
                  <FormGroup>
                    <FormGroupLabel>Status:</FormGroupLabel>
                    <FormGroupField>
                      <Field
                        name="status"
                        component={renderSelectField}
                        options={status}
                      />
                    </FormGroupField>
                  </FormGroup>
                </Col>
                <EditableReactTable reactTableData={reactTableData} onChangeData={handleTableDataChange} />
                <FormButtonToolbar>
                  <Button variant="primary" type="submit">Submit</Button>
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => {
                      form.reset();
                      history.push('/pages/purchase/order');
                    }}
                  >
                    Cancel
                  </Button>
                </FormButtonToolbar>
              </FormContainer>
            )}
          </Form>
        </CardBody>
      </Card>
    </Col>
  );
};

HorizontalForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default HorizontalForm;
