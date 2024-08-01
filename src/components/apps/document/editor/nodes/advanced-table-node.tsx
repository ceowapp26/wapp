import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import {
  DataGrid,
  GridToolbar,
  useGridApiRef,
  GridRowModel,
  GridRowReorderCell,
  GridRowOrderChangeParams,
} from '../mui-x/x-data-grid/index';
import { NodeViewWrapper } from "@tiptap/react";

function updateRowPosition(
  initialIndex: number,
  newIndex: number,
  rows: Array<GridRowModel>,
): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(
      () => {
        const rowsClone = [...rows];
        const row = rowsClone.splice(initialIndex, 1)[0];
        rowsClone.splice(newIndex, 0, row);
        resolve(rowsClone);
      },
      Math.random() * 500 + 100,
    );
  });
}

function AdvancedTableNode() {
  const apiRef = useGridApiRef();
  let idCounter = 0;

  // Initial columns state
  const [columns, setColumns] = React.useState(() => [
    { field: 'id' },
    { field: 'username', width: 150 },
    { field: 'age', width: 80, type: 'number' },
  ]);

  // Create a random row with an incrementing id
  const createRandomRow = () => {
    idCounter += 1;
    return { id: idCounter, username: null, age: null };
  };

  // Create a random column
  const createRandomColumn = () => {
    idCounter += 1;
    return { field: `column-${idCounter}` };
  };

  // Initial rows state
  const [rows, setRows] = React.useState(() => [
    createRandomRow(),
    createRandomRow(),
    createRandomRow()
  ]);

  // Delete a random column
  const handleDeleteColumn = () => {
    if (columns.length === 0) {
      return;
    }
    setColumns((prevColumns) => {
      const columnToDeleteIndex = Math.floor(Math.random() * prevColumns.length);
      return [
        ...prevColumns.slice(0, columnToDeleteIndex),
        ...prevColumns.slice(columnToDeleteIndex + 1),
      ];
    });
  };

  // Delete a random row
  const handleDeleteRow = () => {
    if (rows.length === 0) {
      return;
    }
    setRows((prevRows) => {
      const rowToDeleteIndex = Math.floor(Math.random() * prevRows.length);
      return [
        ...prevRows.slice(0, rowToDeleteIndex),
        ...prevRows.slice(rowToDeleteIndex + 1),
      ];
    });
  };

  // Add a new random row
  const handleAddRow = () => {
    setRows((prevRows) => [...prevRows, createRandomRow()]);
  };

  // Server-side row fetching function
  const debouncedHandleFetchRows = React.useCallback(async ({ page, pageSize }) => {
    // Simulate server-side fetching delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Return a portion of rows based on page and pageSize
    return {
      rows: rows.slice((page - 1) * pageSize, page * pageSize),
      totalCount: rows.length,
    };
  }, [rows]);


  const handleRowOrderChange = async (params: GridRowOrderChangeParams) => {
    const newRows = await updateRowPosition(
      params.oldIndex,
      params.targetIndex,
      rows,
    );

    setRows(newRows);
  };

  // Render the component
  return (
    <NodeViewWrapper
      className="react-component"
      style={{ padding: "10px", userSelect: "none" }}
      contentEditable={false}
    >
     <div
        contentEditable={false}
        data-drag-handle=""
      >
        <Box sx={{ width: '100%' }}>
          <Stack direction="row" spacing={1}>
            <Button size="small" onClick={handleDeleteColumn}>
              Delete a column
            </Button>
            <Button size="small" onClick={handleDeleteRow}>
              Delete a row
            </Button>
            <Button size="small" onClick={handleAddRow}>
              Add a row
            </Button>
          </Stack>
          <Box sx={{ height: 520, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              apiRef={apiRef}
              checkboxSelection
              disableRowSelectionOnClick
              slots={{ toolbar: GridToolbar, roworder: GridRowReorderCell}}
              cellSelection
              onFetchRows={debouncedHandleFetchRows}
              sortingMode="server"
              filterMode="server"
              rowsLoadingMode="server"
              hideFooterPagination
              rowReordering
              onRowOrderChange={handleRowOrderChange}
            />
          </Box>
        </Box>
      </div>
    </NodeViewWrapper>
  );
}

const AdvancedTableNodeOptions = {
  name: "AdvancedTableNode",
  tag: "advanced-table-node",
  component: AdvancedTableNode,
  atom: false,
  draggable: true,
};

export { AdvancedTableNode, AdvancedTableNodeOptions };
