import React from 'react';
import {
  Table as NextUITable,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Button,
} from "@nextui-org/react";
import { FiFile, FiFolder, FiMessageSquare, FiEye, FiPlus, FiRefreshCw } from "react-icons/fi";
import CodeFileList from './code-file-list';
import { FileInterface } from "@/types/chat";

interface ColumnConfig {
  key: string;
  label: string;
  render?: (value: any) => React.ReactNode;
}

interface FilesProps {
  resourceType: string;
  data: any[];
  columns: ColumnConfig[];
  handleFileSelect: (file: any, action: 'view' | 'insert' | 'replace') => void;
}

const Files: React.FC<FilesProps> = ({ 
  resourceType, 
  data, 
  columns, 
  handleFileSelect,
}) => {
  const renderCell = (item: any, columnKey: string) => {
    let cellValue = item[columnKey];
    switch (columnKey) {
      case "name":
        return (
          <div className="flex items-center space-x-2">
            {resourceType === 'chats' ? (
              <FiMessageSquare className="text-blue-500" />
            ) : item.type === 'directory' ? (
              <FiFolder className="text-yellow-500" />
            ) : (
              <FiFile className="text-blue-500" />
            )}
            <span>{cellValue}</span>
          </div>
        );
      case "type":
        return <span className="capitalize">{resourceType === 'chats' ? 'chat' : resourceType === 'documents' ? 'document' : cellValue}</span>;
      case "content":
        return <span>{cellValue?.substring(0, 50) || ''}...</span>;
      case "size":
        return <span>{cellValue || 0} bytes</span>;
      case "actions":
        return (
          <div className="flex items-center gap-2">
            <Tooltip content="View">
              <Button
                light
                auto
                isIconOnly
                onClick={() => handleFileSelect(item, "view")}
              >
                <FiEye className="text-blue-500" />
              </Button>
            </Tooltip>
            <Tooltip content="Insert">
              <Button
                light
                auto
                isIconOnly
                onClick={() => handleFileSelect(item, 'insert')}
              >
                <FiPlus className="text-green-500" />
              </Button>
            </Tooltip>
            <Tooltip content="Replace">
              <Button
                light
                auto
                isIconOnly
                onClick={() => handleFileSelect(item, 'replace')}
              >
                <FiRefreshCw className="text-yellow-500" />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  };

  if (resourceType === 'codes') {
    return (
      <CodeFileList
        projects={data}
        handleCodeSelect={handleFileSelect}
      />
    );
  }

  const columnsWithActions = columns.find(col => col.key === 'actions')
    ? columns
    : [...columns, { key: 'actions', label: 'Actions' }];

  return (
    <NextUITable
      aria-label={`${resourceType} table`}
      selectionMode="single"
    >
      <TableHeader>
        {columnsWithActions.map((column) => (
          <TableColumn key={column.key}>{column.label}</TableColumn>
        ))}
      </TableHeader>
      <TableBody items={data}>
        {(item) => (
          <TableRow key={item.id || item.name}>
            {columnsWithActions.map((column) => (
              <TableCell key={`${item.id || item.name}-${column.key}`}>
                {renderCell(item, column.key)}
              </TableCell>
            ))}
          </TableRow>
        )}
      </TableBody>
    </NextUITable>
  );
};

export default Files;