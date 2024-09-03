import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  Input as NextInput,
  Tabs,
  Tab,
} from "@nextui-org/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { usePathname } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/loader";
import { Label } from '@/components/ui/label';
import { Settings, HelpCircle, Save, X, ChevronDown, Eye, Edit2, Edit3, Search } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useForm, FormProvider, Controller, FieldErrors, UseFormReturn, Control } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { toast } from "sonner";
import { capitalize } from "@/utils/capitalize";
import { PROJECT_SETTINGS } from "@/constants/code";

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

const CellPopover = ({ trigger, project, column, columnKey, methods, errors, control, onHandleSubmit }) => {
  const [editMode, setEditMode] = useState(false);
  const handleSwitch = useCallback(() => setEditMode(prev => !prev), []);
  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    methods.handleSubmit((data) => onHandleSubmit(project.projectId)(data))();
  }, [onHandleSubmit, project.projectId, methods]);

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
                    <p className="text-gray-600">{project[columnKey]}</p>
                  </div>
                ) : (
                  <FormProvider {...methods}>
                    <form onSubmit={handleSubmit}>
                      <Controller
                        name={column.uid}
                        control={control}
                        defaultValue={project[columnKey]}
                        render={({ field }) => (
                          <Label className="space-y-2" htmlFor={`input-${column.uid}`}>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{column.name}</span>
                            <div className="relative">
                              <Input
                                id={`input-${column.uid}`}
                                type="text"
                                value={field.value}
                                placeholder={`Enter ${column.name.toLowerCase()}`}
                                className="w-full pr-16 focus:ring-2 focus:ring-blue-500"
                                {...field}
                              />
                            </div>
                            <ErrorMessage
                              errors={errors}
                              name={column.uid}
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

const EditPopover = ({ trigger, project, projectColumns, methods, errors, control, onHandleSubmit }) => {
  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    methods.handleSubmit((data) => onHandleSubmit(project.projectId)(data))();
  }, [onHandleSubmit, project.projectId, methods]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <FormProvider {...methods}>
          <Card className="max-h-[80vh] overflow-y-auto shadow-xl border-t-4 border-blue-500">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <h3 className="text-lg font-semibold">Edit {project.projectName} project</h3>
            </CardHeader>
            <CardBody>
              <div className="h-full w-full">
                <h3 className="text-lg font-semibold mb-2">Current Record:</h3>
                <pre className="whitespace-pre-wrap overflow-auto max-h-40 mb-4 text-sm bg-gray-100 p-2 rounded text-gray-900/75">
                  {JSON.stringify(project, null, 2)}
                </pre>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {projectColumns.filter(col => col.editable === "EDITABLE").map(column => (
                  <div key={column.uid} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <Controller
                      name={column.uid}
                      control={control}
                      defaultValue={project[column.uid]}
                      render={({ field }) => (
                        <Label className="space-y-2" htmlFor={`input-${column.uid}`}>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{column.name}</span>
                          <div className="relative">
                            <Input
                              id={`input-${column.uid}`}
                              type="text"
                              value={field.value}
                              className="w-full pr-16 focus:ring-2 focus:ring-blue-500"
                              {...field}
                            />
                          </div>
                          <ErrorMessage
                            errors={errors}
                            name={column.uid}
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

const ViewPopover = ({ project }) => (
  <Popover placement="bottom">
    <PopoverTrigger>
      <Button isIconOnly size="sm" variant="light" className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-900 dark:hover:bg-blue-800 transition-colors duration-150">
        <Eye size={18} className="text-blue-600 dark:text-blue-400" />
      </Button>
    </PopoverTrigger>
    <PopoverContent>
      <div className="px-1 py-2">
        <pre className="whitespace-pre-wrap overflow-auto max-h-96">
          {JSON.stringify(project, null, 2)}
        </pre>
      </div>
    </PopoverContent>
  </Popover>
);

const ProjectSettings = () => {
  const [projects, setProjects] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [activeTab, setActiveTab] = useState("general");
  const [headerColumns, setHeaderColumns] = useState(PROJECT_SETTINGS.general);
  const [visibleColumns, setVisibleColumns] = useState(new Set(PROJECT_SETTINGS[activeTab].map((col) => col.uid)));
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState({ column: "projectName", direction: "ascending" });
  const [isEditing, setIsEditing] = useState(false);

  const methods = useForm({
    mode: "all",
    shouldFocusError: true
  });

  const { control, formState: { errors }, reset, setValue } = methods;

  const getProjects = useQuery(api.codes.getProjects);
  const updateProject = useMutation(api.codes.updateProject);

  useEffect(() => {
    setVisibleColumns(new Set(PROJECT_SETTINGS[activeTab].map((col) => col.uid)));
    setHeaderColumns(PROJECT_SETTINGS[activeTab]);
  }, [activeTab]);

  useEffect(() => {
    if (getProjects) {
      setProjects(getProjects);
    }
  }, [getProjects]);

  const filteredItems = useMemo(() => {
    let filteredProjects = [...projects];
    if (filterValue) {
      filteredProjects = filteredProjects.filter((project) =>
        project.projectName.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    return filteredProjects;
  }, [projects, filterValue]);

  const filteredHeaderColumns = useMemo(() => {
    return headerColumns.filter((column) => visibleColumns.has(column.uid));
  }, [headerColumns, visibleColumns]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const onHandleSubmit = useCallback((projectId) => methods.handleSubmit(async (values) => {
    try {
      await updateProject({ id: projectId, project: values });
      setProjects(prevProjects =>
        prevProjects.map(m =>
          m.projectId === projectId ? { ...m, ...values } : m
        )
      );
      setIsEditing(false);
      reset();
    } catch (error) {
      console.error('Error in onHandleSubmit:', error);
    }
  }), [updateProject, reset]);

  const handleCellEdit = useCallback((projectId, column, value) => {
    setIsEditing(true);
    setValue(column, value);
  }, [setValue]);

  const handleEdit = useCallback((projectId) => {
    setIsEditing(true);
    reset(projects.find(m => m.projectId === projectId));
  }, [reset, projects]);

  const renderCell = useCallback((project, columnKey) => {
    let cellValue;
    if (activeTab === "general") {
      cellValue = project[columnKey];
    } else {
      cellValue = project[activeTab]?.[columnKey];
    }
    const column = PROJECT_SETTINGS[activeTab].find(col => col.uid === columnKey);
    if (column?.editable === "EDITABLE") {
      return (
        <CellPopover
          trigger={
            <Button onClick={() => handleCellEdit(project.projectId, columnKey, cellValue)} className="cursor-pointer hover:bg-violet-500/50 p-2 bg-violet-300/50 rounded transition-colors w-full h-full">
              {cellValue}
            </Button>
          }
          project={project}
          columnKey={columnKey}
          column={column}
          errors={errors}
          control={control}
          methods={methods}
          onHandleSubmit={onHandleSubmit}
        />
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
                  onClick={() => handleEdit(project.projectId)}
                >
                  <Edit2 size={18} className="text-blue-600 dark:text-blue-400" />
                </Button>
              }
              project={project}
              projectColumns={PROJECT_SETTINGS[activeTab]}
              errors={errors}
              control={control}
              methods={methods}
              onHandleSubmit={onHandleSubmit}
            />
            <ViewPopover project={project} />
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
        );
    }
  }, [control, errors, onHandleSubmit, methods, activeTab]);

  const onSearchChange = useCallback((value) => {
    setFilterValue(value || "");
    setPage(1);
  }, []);

  const topContent = useMemo(() => (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between gap-3 items-end">
        <NextInput
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Search by project..."
          startContent={<Search />}
          value={filterValue}
          onClear={() => onSearchChange("")}
          onValueChange={onSearchChange}
        />
        <Dropdown>
          <DropdownTrigger className="hidden sm:flex">
            <Button
              endContent={<ChevronDown className="text-small" />}
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
            {PROJECT_SETTINGS[activeTab].map((column) => (
              <DropdownItem key={column.uid} className="capitalize">
                {column.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  ), [filterValue, onSearchChange, visibleColumns, activeTab]);

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

  const renderTabContent = (category) => (
    <Table
      aria-label={`${category} settings table`}
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
      <TableHeader columns={filteredHeaderColumns}>
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
        {(item) => (
          <TableRow key={item.projectId} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}      
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <Image
          alt="AI Technology"
          height={40}
          radius="sm"
          src="/global/images/code/code-project.png"
          width={40}
        />
        <div className="flex flex-col">
          <p className="text-xl font-bold">Project Settings</p>
          <p className="text-sm opacity-80">Customize parameters for each project</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <Tabs aria-label="Project Settings Tabs" selectedKey={activeTab} onSelectionChange={setActiveTab}>
          <Tab key="general" title="General">
            {renderTabContent('general')}
          </Tab>
          <Tab key="development" title="Development">
            {renderTabContent('development')}
          </Tab>
          <Tab key="testing" title="Testing">
            {renderTabContent('testing')}
          </Tab>
          <Tab key="database" title="Database">
            {renderTabContent('database')}
          </Tab>
          <Tab key="deployment" title="Deployment">
            {renderTabContent('deployment')}
          </Tab>
          <Tab key="security" title="Security">
            {renderTabContent('security')}
          </Tab>
          <Tab key="performance" title="Performance">
            {renderTabContent('performance')}
          </Tab>
          <Tab key="metadata" title="Metadata">
            {renderTabContent('metadata')}
          </Tab>
        </Tabs>
      </CardBody>
      <CardFooter className="justify-center bg-gray-50 dark:bg-gray-900">
        <Link
          isExternal
          showAnchorIcon
          href="/additionals"
          color="primary"
        >
          Learn more about project settings
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProjectSettings;

