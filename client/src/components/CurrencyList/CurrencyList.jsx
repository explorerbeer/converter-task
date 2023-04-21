import React from 'react';
import { useTable } from 'react-table';
import './CurrencyList.css';

const tableColumns = [
  {
    Header: 'Код',
    accessor: 'shortname',
  },
  {
    Header: 'Валюта',
    accessor: 'fullname',
  },
  {
    Header: 'Цена',
    accessor: 'price',
  },
  {
    Header: 'Единиц',
    accessor: 'scale',
  },
];

export const CurrencyList = ({ currencies }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns: tableColumns,
    data: currencies,
  });

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <td {...cell.getCellProps()}>
                  {cell.render('Cell')}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default CurrencyList;
