import { useMemo } from 'react';

const CreateTableData = () => {
  const columns = useMemo(
    () => [
      // {
      //   Header: '#',
      //   accessor: 'id',
      //   Footer: 'Middle age:',
      //   disableGlobalFilter: true,
      //   width: 65,
      // },
      {
        Header: 'No',
        accessor: 'no',
        disableGlobalFilter: true,
      },
      {
        Header: 'Type',
        accessor: 'type',
      },
      {
        Header: 'Description',
        accessor: 'des',
        disableGlobalFilter: true,
      },
      {
        Header: 'Quantity',
        accessor: 'quantity',
        disableGlobalFilter: true,
      },
      {
        Header: 'Unit Cost',
        accessor: 'unit',
        disableGlobalFilter: true,
      },
      {
        Header: 'Line Amount',
        accessor: 'amount',
        disableGlobalFilter: true,
        disableSortBy: true,
      },
    ],
    [],
  );

  const data = [];
  const rows = () => {
    for (let i = 1; i < 10; i += 1) {
      data.push({
        // id: i,
        type: '',
        no: '',
        des: '',
        quantity: '',
        unit: '',
        amount: '',
      });
    }
  };

  rows();
  const reactTableData = { tableHeaderData: columns, tableRowsData: data };
  return reactTableData;
};

export default CreateTableData;
