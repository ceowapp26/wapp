"use client";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Card,
  CardHeader, 
  CardBody,
  CardFooter,
  Divider, 
  Popover,
  Image,
  Link,
  PopoverTrigger,
  PopoverContent,
  Tooltip,
  usePopoverContext,
} from "@nextui-org/react";
import { Input as NextInput } from "@nextui-org/react";
import EditIcon from "@/icons/EditIcon";
import SearchIcon from "@/icons/SearchIcon";
import ChevronDownIcon from "@/icons/ChevronDownIcon";
import { CloudModelConfigInterface, ModelOption, CloudModelConfigCollectionInterface, TotalTokenUsed } from "@/types/ai";
import { useStore } from "@/redux/features/apps/document/store";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useGeneralContext } from "@/context/general-context-provider";
import { modelMaxToken, modelColumns } from "@/constants/ai";
import { capitalize } from "@/utils/capitalize";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/loader";
import { Label } from '@/components/ui/label';
import { ErrorMessage } from '@hookform/error-message';
import Typography from '@mui/material/Typography';
import { AnimatePresence, motion } from 'framer-motion';
import { FormProvider, FieldErrors, FieldValues, UseFormRegister, Control, Controller, UseFormSetValue, useForm, UseFormReturn } from 'react-hook-form';
import { Eye, ChevronLeft, X, Save, Edit2, Edit3, EllipsisVertical } from 'lucide-react';

const createModelSchema = (model: CloudModelConfigInterface, fields: (keyof CloudModelConfigInterface)[]) => {
  const schemaObject: { [key: string]: z.ZodType<any, any> } = {};
  fields.forEach(field => {
    switch (field) {
      case 'ceiling_RPM':
        schemaObject.ceiling_RPM = z.number()
          .min(0, { message: "Ceiling RPM must be a positive number" })
          .max(model.max_RPM, {
            message: "Cannot exceed Purchased Max RPM",
          });
        break;
      case 'floor_RPM':
        schemaObject.floor_RPM = z.number()
          .min(0, { message: "Floor RPM must be a positive number" })
          .max(model.ceiling_RPM, {
            message: "Cannot exceed Ceiling RPM",
          });
        break;
      case 'ceiling_RPD':
        schemaObject.ceiling_RPD = z.number()
          .min(0, { message: "Ceiling RPD must be a positive number" })
          .max(model.max_RPD, {
            message: "Cannot exceed Purchased Max RPD",
          });
        break;
      case 'floor_RPD':
        schemaObject.floor_RPD = z.number()
          .min(0, { message: "Floor RPD must be a positive number" })
          .max(model.ceiling_RPD, {
            message: "Cannot exceed Ceiling RPD",
          });
        break;
      case 'max_tokens':
        schemaObject.max_tokens = z.number()
          .int({ message: "Max tokens must be an integer" })
          .min(1, { message: "Max tokens must be at least 1" })
          .max(
            Math.min(
              modelMaxToken[model.model as keyof typeof modelMaxToken],
              Math.max(model.floor_inputTokens + model.floor_outputTokens) + model.base_TPM / 2,
            ),
            { message: "Exceeds maximum allowed tokens" }
          );
        break;
    }
  });
  return z.object(schemaObject);
};

function processModelData(model: any): any {
  const excludeFields = ['cloudModelId', 'timeLimitTokenUsed', 'totalTokenUsed'];
  const fieldOrder = [
    'model',
    'base_RPD', 'base_RPM', 'base_TPD', 'base_TPM',
    'max_RPM', 'ceiling_RPM', 'floor_RPM',
    'max_RPD', 'ceiling_RPD', 'floor_RPD',
    'max_inputTokens', 'ceiling_inputTokens', 'floor_inputTokens',
    'max_outputTokens', 'ceiling_outputTokens', 'floor_outputTokens',
    'max_tokens',
    'used_inputTokens', 'used_outputTokens'
  ];
  const processedModel = fieldOrder.reduce((acc, field) => {
    if (field in model && !excludeFields.includes(field)) {
      acc[field] = model[field];
    }
    return acc;
  }, {} as any);
  return processedModel;
}

const CancelButton = () => {
  const { getBackdropProps } = usePopoverContext();
  return (
    <Tooltip content="Cancel editing">
      <Button
        size="sm"
        color="danger"
        variant="light"
        onClick={(e) => getBackdropProps()?.onClick?.(e)}
        startContent={<X size={16} />}
      >
        Cancel
      </Button>
    </Tooltip>
  );
};

const SaveButton = () => {
  return (
    <Tooltip content="Save changes">
      <Button
        type="submit"
        size="sm"
        color="primary"
        startContent={<Save size={16} />}
      >
        Save
      </Button>
    </Tooltip>
  );
};

type Column = {
  uid: string;
  name: string;
  editable: "READONLY" | "EDITABLE";
  sortable: boolean;
}

interface CellPopoverProps {
  methods: UseFormReturn<Partial<CloudModelConfigInterface>, any>;
  trigger: React.ReactNode;
  model: CloudModelConfigInterface;
  columnKey: string;
  column: Column;
  onHandleSubmit: (model: string) => Promise<void>;
  control: Control<Partial<CloudModelConfigInterface>, any>;
  errors: FieldErrors<Partial<CloudModelConfigInterface>>;
}

const CellPopover: React.FC<CellPopoverProps> = ({ trigger, model, column, columnKey, methods, errors, control, onHandleSubmit }) => {
  const [editMode, setEditMode] = useState(false);
  const handleSwitch = useCallback(() => setEditMode(prev => !prev), []);
  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    methods.handleSubmit((data) => onHandleSubmit(model.model)(data))();
  }, [onHandleSubmit, model.model, methods]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent className="w-80 py-2">
        <Card className="border-none shadow-lg w-full">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {editMode ? 'Edit' : 'View'} Details
              </h3>
            </div>
          </CardHeader>
          <CardBody className="p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={editMode ? 'edit' : 'view'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {!editMode ? (
                  <div className="space-y-2">
                    <p className="font-semibold">{column.name}</p>
                    <p className="text-gray-600">{model[columnKey]}</p>
                  </div>
                ) : (
                  <FormProvider {...methods}>
                    <form onSubmit={handleSubmit}>
                      <Controller
                        name={column.uid as keyof CloudModelConfigInterface}
                        control={control}
                        defaultValue={model[columnKey] as number}
                        render={({ field }) => (
                          <Label className="space-y-2" htmlFor={`input-${column.uid}`}>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{column.name}</span>
                            <div className="relative">
                              <Input
                                id={`input-${column.uid}`}
                                type="number"
                                value={field.value}
                                placeholder={`Enter ${column.name.toLowerCase()}`}
                                className="w-full pr-16 focus:ring-2 focus:ring-blue-500"
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value === '' ? '' : Number(e.target.value);
                                  field.onChange(value);
                                }}
                              />
                              <span className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400">
                                {column.uid.includes('RPM') ? 'RPM' : column.uid.includes('RPD') ? 'RPD' : 'Tokens'}
                              </span>
                            </div>
                            <ErrorMessage
                              errors={errors}
                              name={column.uid as any}
                              render={({ message }) => (
                                <p className="text-red-500 text-xs mt-1">{message}</p>
                              )}
                            />
                          </Label>
                        )}
                      />
                      <div className="mt-4 flex justify-end space-x-2">
                        <CancelButton />
                        <SaveButton />
                      </div>
                    </form>
                  </FormProvider>
                )}
              </motion.div>
            </AnimatePresence>
          </CardBody>
          <CardFooter className="bg-gray-50 rounded-b-lg flex items-center justify-center">
            <Button
              onClick={handleSwitch}
              variant="outline"
              className="max-w-32 min-w-28 text-white hover:bg-gray-500/75 flex items-center bg-gray-600/75 justify-center space-x-2"
            >
              {editMode ? (
                <>
                  <Eye size={16} />
                  <span>View</span>
                </>
              ) : (
                <>
                  <Edit3 size={16} />
                  <span>Edit</span>
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

interface EditPopoverProps {
  methods: UseFormReturn<Partial<CloudModelConfigInterface>, any>;
  trigger: React.ReactNode;
  model: CloudModelConfigInterface;
  modelColumns: Array<{ uid: string; editable: string }>;
  onHandleSubmit: (model: string) => Promise<void>;
  control: Control<Partial<CloudModelConfigInterface>, any>;
  errors: FieldErrors<Partial<CloudModelConfigInterface>>;
}

const EditPopover: React.FC<EditPopoverProps> = ({ trigger, model, modelColumns, methods, errors, control, onHandleSubmit }) => {
  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    methods.handleSubmit((data) => onHandleSubmit(model.model)(data))();
  }, [onHandleSubmit, model.model, methods]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <FormProvider {...methods}>
          <Card className="max-h-[80vh] overflow-y-auto shadow-xl border-t-4 border-blue-500">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <h3 className="text-lg font-semibold">Edit {model.model} Model</h3>
            </CardHeader>
            <CardBody>
              <div className="h-full w-full">
               <h3 className="text-lg font-semibold mb-2">Current Record:</h3>
                <pre className="whitespace-pre-wrap overflow-auto max-h-40 mb-4 text-sm bg-gray-100 p-2 rounded text-gray-900/75">
                  {JSON.stringify(processModelData(model), null, 2)}
                </pre>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {modelColumns.filter(col => col.editable === "EDITABLE").map(column => (
                  <div key={column.uid} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <Controller
                      name={column.uid as keyof CloudModelConfigInterface}
                      control={control}
                      defaultValue={model[column.uid as keyof CloudModelConfigInterface] as number}
                      render={({ field }) => (
                        <Label className="space-y-2" htmlFor={`input-${column.uid}`}>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{column.name}</span>
                          <div className="relative">
                            <Input
                              id={`input-${column.uid}`}
                              type="number"
                              value={field.value}
                              className="w-full pr-16 focus:ring-2 focus:ring-blue-500"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value === '' ? '' : Number(e.target.value);
                                field.onChange(value);
                              }}
                            />
                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400">
                              {column.uid.includes('RPM') ? 'RPM' : column.uid.includes('RPD') ? 'RPD' : 'Tokens'}
                            </span>
                          </div>
                          <ErrorMessage
                            errors={errors}
                            name={column.uid as any}
                            render={({ message }) => (
                              <p className="text-red-500 text-xs mt-1">{message}</p>
                            )}
                          />
                        </Label>
                      )}
                    />
                  </div>
                ))}
              </form>
            </CardBody>
            <CardFooter className="justify-end mb-1 space-x-2 bg-gray-50 dark:bg-gray-900">
              <CancelButton />
              <SaveButton />
            </CardFooter>
          </Card>
        </FormProvider>
      </PopoverContent>
    </Popover>
  );
};

const ViewPopover = ({ model }) => (
  <Popover placement="bottom">
    <PopoverTrigger>
      <Button isIconOnly size="sm" variant="light" className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-900 dark:hover:bg-blue-800 transition-colors duration-150">
        <Eye size={18} className="text-blue-600 dark:text-blue-400" />
      </Button>
    </PopoverTrigger>
    <PopoverContent>
      <div className="px-1 py-2">
        <pre className="whitespace-pre-wrap overflow-auto max-h-96">
          {JSON.stringify(processModelData(model), null, 2)}
        </pre>
      </div>
    </PopoverContent>
  </Popover>
);

const ModelSettings = () => {
  const [models, setModels] = useState<CloudModelConfigInterface[]>([]);
  const [filterValue, setFilterValue] = useState<string>("");
  const [editingFields, setEditingFields] = useState<(keyof CloudModelConfigInterface)[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(modelColumns.map((col) => col.uid)));
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [sortDescriptor, setSortDescriptor] = useState<{ column: string; direction: string }>({ column: "model", direction: "ascending" });
  const [editingModel, setEditingModel] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const AIConfig = useStore((state) => state.AIConfig);
  const setAIConfig = useStore((state) => state.setAIConfig);
  const setTokenShortage = useStore((state) => state.setTokenShortage);
  const totalTokenUsed = useStore((state) => state.totalTokenUsed);
  const updateModel = useMutation(api.models.updateModel);
  const cloudModels = useQuery(api.models.getAllModels);

  const schema = useMemo(() => {
    const currentModel = models.find(m => m.model === editingModel);
    return currentModel ? createModelSchema(currentModel, editingFields) : z.object({});
  }, [editingModel, models, editingFields]);

  const methods = useForm<Partial<CloudModelConfigInterface>>({
    resolver: zodResolver(schema),
    mode: "all",
    shouldFocusError: true
  });

  const { control, formState: { errors }, reset, setValue } = methods;

  useEffect(() => {
  if (cloudModels) {
    const combinedData = cloudModels.map((cloudModel) => {
      const model = cloudModel.model as ModelOption;
      return {
        ...cloudModel,
        model,
        used_inputTokens: totalTokenUsed[model]?.inputTokens || 0,
        used_outputTokens: totalTokenUsed[model]?.outputTokens || 0,
      };
    });
    setModels(combinedData);
  }
}, [cloudModels, totalTokenUsed]);

  useEffect(() => {
    if (editingModel) {
      const modelToEdit = models.find(m => m.model === editingModel);
      if (modelToEdit) {
        Object.keys(modelToEdit).forEach(key => {
          setValue(key as keyof CloudModelConfigInterface, modelToEdit[key as keyof CloudModelConfigInterface]);
        });
      }
    }
  }, [editingModel, models, setValue]);

  const filteredItems = useMemo(() => {
    let filteredModels = [...models];
    if (filterValue) {
      filteredModels = filteredModels.filter((model) =>
        model.model.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    return filteredModels;
  }, [models, filterValue]);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return modelColumns;

    return modelColumns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a: CloudModelConfigInterface, b: CloudModelConfigInterface) => {
      const first = a[sortDescriptor.column as keyof CloudModelConfigInterface];
      const second = b[sortDescriptor.column as keyof CloudModelConfigInterface];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const onHandleSubmit = useCallback((model: string) => methods.handleSubmit(async (values: Partial<CloudModelConfigInterface>) => {
    try {
      const modelToUpdate = cloudModels.find(item => item.model === model);
      if (!modelToUpdate) {
        console.error('Model not found:', model);
        return;
      }
      const modelId = modelToUpdate.cloudModelId;
      await updateModel({ id: modelId, data: { ...modelToUpdate, ...values }});
      const updatedConfigs = {
        ...AIConfig,
        [model]: { ...AIConfig[model], ...values }
      };
      setModels(prevModels =>
        prevModels.map(m =>
          m.model === model ? { ...m, ...values } : m
        )
      );
      setAIConfig(updatedConfigs);
      setEditingModel(null);
      setIsEditing(false);
      setEditingFields([]);
      setTokenShortage(false);
      reset();
    } catch (error) {
      console.error('Error in onHandleSubmit:', error);
    }
  }), [AIConfig, cloudModels, updateModel, setAIConfig, editingFields, reset]);

  const handleCellEdit = useCallback((model: string, column: string, value: number) => {
    setEditingFields([]);
    setEditingModel(model);
    setValue(column as keyof CloudModelConfigInterface, value);
    setEditingFields([column as keyof CloudModelConfigInterface]);
  }, [setValue]);

  const handleEdit = useCallback((model: string) => {
    setEditingFields([]);
    setEditingModel(model);
    reset(models.find(m => m.model === model));
    const editableFields = modelColumns
      .filter(column => column.editable === "EDITABLE")
      .map(column => column.uid as keyof CloudModelConfigInterface);
    setEditingFields(editableFields);
    setIsEditing(true);
  }, [reset, models, modelColumns]);
  
  const renderCell = useCallback((model: CloudModelConfigInterface, columnKey: string) => {
    const cellValue = model[columnKey as keyof CloudModelConfigInterface];
    const column = modelColumns.find(col => col.uid === columnKey);
    if (column?.editable === "EDITABLE") {
      return (
        <CellPopover
          trigger={
            <Button onClick={() => handleCellEdit(model.model, columnKey, cellValue)} className="cursor-pointer hover:bg-violet-500/50 p-2 bg-violet-300/50 rounded transition-colors w-full h-full">
              {cellValue}
            </Button>
          }
          model={model}
          columnKey={columnKey}
          column={column}
          errors={errors}
          control={control}
          methods={methods}
          onHandleSubmit={onHandleSubmit}
        >
        </CellPopover>
      );
    }
    switch (columnKey) {
      case "actions":
      return (
        <div className="relative flex items-center gap-2">
          <EditPopover
            trigger={
              <Button 
                isIconOnly 
                size="sm" 
                variant="light"
                className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-900 dark:hover:bg-blue-800 transition-colors duration-150"
                onClick={() => handleEdit(model.model)}
              >
                <Edit2 size={18} className="text-blue-600 dark:text-blue-400" />
              </Button>
            }
            model={model}
            modelColumns={modelColumns}
            errors={errors}
            control={control}
            methods={methods}
            onHandleSubmit={onHandleSubmit}
          >
          </EditPopover>
          <ViewPopover model={model} />
        </div>
      );
      default:
        return (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 p-2 rounded-md shadow-sm w-full h-full"
          >
            <p className="font-semibold text-sm text-gray-700 truncate">
              {cellValue}
            </p>
        </motion.div>
      )
    }
  }, [control, errors, reset, onHandleSubmit, methods]);

 const onSearchChange = useCallback((value?: string) => {
    setFilterValue(value || "");
    setPage(1);
  }, []);

  const topContent = useMemo(() => (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between gap-3 items-end">
        <NextInput
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Search by model..."
          startContent={<SearchIcon />}
          value={filterValue}
          onClear={() => onSearchChange("")}
          onValueChange={onSearchChange}
        />
        <Dropdown>
          <DropdownTrigger className="hidden sm:flex">
            <Button
              endContent={<ChevronDownIcon className="text-small" />}
              size="sm"
              variant="flat"
            >
              Columns
            </Button>
          </DropdownTrigger>
          <DropdownMenu 
            disallowEmptySelection
            aria-label="Table Columns"
            closeOnSelect={false}
            selectedKeys={visibleColumns}
            selectionMode="multiple"
            onSelectionChange={setVisibleColumns}
          >
            {modelColumns.map((column) => (
              <DropdownItem key={column.uid} className="capitalize">
                {column.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  ), [filterValue, onSearchChange, visibleColumns]);

  const bottomContent = useMemo(() => (
    <div className="py-2 px-2 flex justify-between items-center">
      <Pagination
        showControls
        classNames={{
          cursor: "bg-foreground text-background",
        }}
        color="default"
        page={page}
        total={pages}
        onChange={setPage}
      />
      <span className="text-small text-default-400">
        {`Page ${page} of ${pages}`}
      </span>
    </div>
  ), [page, pages]);

   return (
    <Card className="shadow-lg">
      <CardHeader className="flex gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <Image
          alt="AI Technology"
          height={40}
          radius="sm"
          src="/global/images/ai/ai-technology.png"
          width={40}
        />
        <div className="flex flex-col">
          <p className="text-xl font-bold">AI Model Settings</p>
          <p className="text-sm opacity-80">Customize parameters for each AI model</p>
        </div>
      </CardHeader>
      <Divider/>
      <CardBody>
        <div className="mb-4 flex justify-between items-center">
          <NextInput
            isClearable
            className="w-full max-w-xs"
            placeholder="Search models..."
            startContent={<SearchIcon className="text-gray-400" size={18} />}
            value={filterValue}
            onClear={() => onSearchChange("")}
            onValueChange={onSearchChange}
          />
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="flat"
                size="sm"
                endContent={<ChevronDownIcon size={16} />}
              >
                Columns
              </Button>
            </DropdownTrigger>
            <DropdownMenu 
              disallowEmptySelection
              aria-label="Table Columns"
              closeOnSelect={false}
              selectedKeys={visibleColumns}
              selectionMode="multiple"
              onSelectionChange={setVisibleColumns}
            >
              {modelColumns.map((column) => (
                <DropdownItem key={column.uid} className="capitalize">
                  {column.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
        <Table
          aria-label="Model settings table"
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          classNames={{
            wrapper: "max-h-[500px]",
            th: "bg-gray-100 text-gray-800 font-bold",
            td: "py-3",
          }}
          selectionMode="none"
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
                allowsSorting={column.sortable}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={sortedItems}>
            {(item: CloudModelConfigInterface) => (
              <TableRow key={item.model} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                {(columnKey: string) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>
      <CardFooter className="justify-center bg-gray-50 dark:bg-gray-900">
        <Link
          isExternal
          showAnchorIcon
          href="/additionals"
          color="primary"
        >
          Learn more about AI model settings
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ModelSettings;

