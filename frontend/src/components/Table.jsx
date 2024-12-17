import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
} from '@nextui-org/react';

import { formatDateToCustom } from '../utils/dateFormat';
import { isDueToday } from '../utils/checkStatus';
import { updateTodo, deleteTodo } from '../axios';

export const columns = [
  { name: 'Todo Item', uid: 'name' },
  { name: 'Status', uid: 'status' },
  { name: 'Due Date', uid: 'due' },
  { name: 'Actions', uid: 'actions' },
];

const statusColorMap = {
  0: 'bg-green-100 text-green-800',
  1: 'bg-red-100 text-red-900',
  2: 'bg-[#FFFfc5] text-yellow-800',
};

const statusTextMap = {
  0: 'Future',
  1: 'Backlog',
  2: 'Due Today',
};

export default function CustomTable({ dataArray, activeTodo, setActiveTodo }) {
  const params = useParams();
  const collectionId = params.collectionId;
  const [todos, setTodos] = useState(dataArray);

  useEffect(() => {
    setTodos(dataArray);
  }, [dataArray]);
  const handleComplete = async (todoId, isCompleted) => {
    try {
      // Optimistically update the UI
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === todoId ? { ...todo, isCompleted } : todo
        )
      );

      await updateTodo(todoId, collectionId, { isCompleted: true });
    } catch (error) {
      console.error(error.response?.data?.message || error.message);

      // Revert changes if API call fails
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === todoId ? { ...todo, isCompleted: false } : todo
        )
      );
    }
  };

  const handleDelete = async (todoId) => {
    try {
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== todoId));

      await deleteTodo(todoId, collectionId);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const renderCell = React.useCallback((todoItem, columnKey) => {
    const cellValue = todoItem[columnKey];
    switch (columnKey) {
      case 'name':
        return (
          <div>
            <p className='text-xs sm:text-sm font-bold'>{todoItem.title}</p>
            <p className='text-[9px] text-gray-300'>{todoItem.description}</p>
          </div>
        );
      case 'status':
        return (
          <div
            className={`py-1 px-1 w-[73%] rounded-md flex justify-center items-center ${
              statusColorMap[isDueToday(todoItem.due)]
            }`}
          >
            <p className='text-[8px]'>
              {statusTextMap[isDueToday(todoItem.due)]}
            </p>
          </div>
        );
      case 'due':
        return (
          <div className='sm:flex flex-col hidden'>
            <p className='text-gray-500 text-[10px] capitalize'>
              {formatDateToCustom(cellValue)}
            </p>
          </div>
        );
      case 'actions':
        return (
          <div className='relative flex sm:items-center justify-end gap-4'>
            <Tooltip content='Done' className='text-xs rounded-md'>
              <span
                className={`text-lg cursor-pointer  ${
                  todoItem.isCompleted
                    ? 'text-green-500'
                    : 'text-gray-300 hover:text-gray-400 transition-all'
                }`}
                onClick={() =>
                  handleComplete(todoItem._id, { isCompleted: true })
                }
              >
                <i className='fa-solid fa-circle-check'></i>
              </span>
            </Tooltip>
            <Tooltip content='Delete Todo' className='text-xs rounded-md'>
              <span
                className='text-xs text-red-300 cursor-pointer active:opacity-50 hidden sm:block'
                onClick={() => handleDelete(todoItem._id)}
              >
                <i className='fa-trash fa-solid'></i>
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <Table aria-label='Example table with custom cells' className=''>
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === 'actions' ? 'end' : 'start'}
            className={
              column.uid === 'due' || column.uid === 'status'
                ? 'hidden sm:table-cell'
                : ''
            }
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={todos}>
        {(item) => (
          <TableRow
            key={item._id}
            onClick={() => setActiveTodo(item)}
            className='cursor-pointer'
          >
            {(columnKey) => (
              <TableCell
                className={
                  columnKey === 'due' || columnKey === 'status'
                    ? 'hidden sm:table-cell'
                    : ''
                }
              >
                {renderCell(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
