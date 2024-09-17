import React from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { FiFile, FiFolder, FiMessageSquare } from "react-icons/fi";
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
  handleFileSelect: (file: FileInterface) => void;
}

const Files: React.FC<FilesProps> = ({ resourceType, data, columns, handleFileSelect }) => {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set<string>());

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
        return <span>{cellValue.substring(0, 50)}...</span>;
      case "size":
        return <span>{cellValue || 0} bytes</span>;
      default:
        return cellValue;
    }
  };

  if (resourceType === 'codes') {
    return (
      <CodeFileList
        projects={data}
        onFileSelect={(projectName, file, content) => {
          handleFileSelect({
            name: file,
            content: content,
            type: "text",
            size: content.length
          });
        }}
      />
    );
  }

  const createFileFromItem = (item: any): FileInterface => {
    console.log("this is item", item);
    return {
      name: item.name || item.title,
      content: item.content,
      type: item.type || "text",
      size: item.size || 0
    };
  };

  const handleSelectionChange = (keys: Set<string>) => {
    setSelectedKeys(keys);
    const newSelectedItems = Array.from(keys).map(key => data[Number(key)]);
    const newSelectedFiles = newSelectedItems.map(createFileFromItem);
    newSelectedFiles.forEach(handleFileSelect);
  };

  return (
    <Table
      aria-label={`${resourceType} table`}
      selectionMode="multiple"
      selectedKeys={selectedKeys}
      onSelectionChange={handleSelectionChange}
    >
      <TableHeader>
        {columns.map((column) => (
          <TableColumn key={column.key}>{column.label}</TableColumn>
        ))}
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={index}>
            {columns.map((column) => (
              <TableCell key={`${index}-${column.key}`}>
                {renderCell(item, column.key)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Files;