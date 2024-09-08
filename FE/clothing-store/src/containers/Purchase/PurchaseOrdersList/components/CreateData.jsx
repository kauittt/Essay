import { useMemo } from 'react';

const CreateTableData = () => {
  const columns = useMemo(
    () => [
      {
        Header: 'No',
        accessor: 'no',
        disableGlobalFilter: true,
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Address',
        accessor: 'address',
        disableGlobalFilter: true,
      },
      {
        Header: 'Posting Date',
        accessor: 'posting_date',
        Cell: ({ value }) => (value ? new Date(value).toLocaleDateString() : ''),
        disableGlobalFilter: true,
      },
      {
        Header: 'Due Date',
        accessor: 'due_date',
        Cell: ({ value }) => (value ? new Date(value).toLocaleDateString() : ''),
        disableGlobalFilter: true,
      },
      {
        Header: 'Order Date',
        accessor: 'order_date',
        Cell: ({ value }) => (value ? new Date(value).toLocaleDateString() : ''),
        disableGlobalFilter: true,
      },
      {
        Header: 'Status',
        accessor: 'status',
        disableGlobalFilter: true,
      },
      {
        Header: 'Item',
        accessor: 'item',
        disableGlobalFilter: true,
      },
    ],
    [],
  );

  const data = [];
  const reactTableData = { tableHeaderData: columns, tableRowsData: data };
  return reactTableData;
};

export default CreateTableData;
