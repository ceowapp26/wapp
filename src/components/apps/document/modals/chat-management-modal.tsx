import React, { useState, useCallback, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Card, CardHeader, CardBody, CardFooter } from '@nextui-org/react';
import { useUser, useOrganization, useOrganizationList } from "@clerk/nextjs";
import { useChatManagement } from '@/hooks/use-chat-management';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useGeneralContext } from '@/context/general-context-provider';
import { organizationColumns, statusOptions } from '@/constants/organization';
import { Organization } from "@/types/organization";
import { toast } from "sonner";
import { FaPlus, FaEdit } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { OrganizationList } from "@/components/organizations/organization-list";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Chip,
  Pagination,
  Select,
  SelectItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Tooltip,
  Switch,
} from "@nextui-org/react";
import { Eye, Edit2, Edit3, Trash, Mail, X, ChevronDown, Search } from 'lucide-react';
import { FileX, Tag } from "lucide-react";

const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const RoleOptions = [
  { key: "admin", label: "Admin" },
  { key: "member", label: "Member" },
  { key: "user", label: "User" },
];

const PermissionOptions = [
  { key: "create", label: "Create" },
  { key: "get", label: "Get" },
  { key: "update", label: "Update" },
  { key: "delete", label: "Delete" },
  { key: "archive", label: "Archive" },
  { key: "restore", label: "Restore" },
  { key: "aiAccess", label: "AI Access" },
];

const UserOptions = [
  { key: "manual", label: "Manual" },
  { key: "organization", label: "Organization" },
];

const isValidEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};

function processModelData(model: any): any {
  const excludeFields = ['orgId'];
  const processedModel = Object.entries(model).reduce((acc, [key, value]) => {
    if (!excludeFields.includes(key)) {
      if (key === 'roles' || key === 'users' || key === 'permissions') {
        acc[key] = value.split(',').map((item: string) => item.trim());
      } else {
        acc[key] = value;
      }
    }
    return acc;
  }, {} as any);
  return processedModel;
}

const SelectorSection = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    {children}
  </div>
);

const Selector = ({ options, selectedOptions, handleSelect, handleRemove, label, cellEdit, handleUpdateCell }) => (
  <div className="flex flex-col space-y-4">
    <Select
      label={label}
      variant="bordered"
      placeholder={`Select ${label.toLowerCase()}`}
      selectedKeys={selectedOptions}
      className="max-w-xs"
      onSelectionChange={handleSelect}
    >
      {options.map((option) => (
        <SelectItem key={option.key} value={option.key}>
          {option.label}
        </SelectItem>
      ))}
    </Select>
    <div className="mt-4">
      {selectedOptions.length > 0 ? (
        selectedOptions.map((option) => (
          <Chip
            key={option}
            onClose={() => handleRemove(option)}
            variant="flat"
            className="m-1"
          >
            {options.find(o => o.key === option)?.label || option}
          </Chip>
        ))
      ) : (
        <p className="text-indigo-500/75">No {label.toLowerCase()} selected.</p>
      )}
    </div>
    {cellEdit && <Button onClick={async () => handleUpdateCell({key: label, value: selectedOptions})}>Update</Button>}
  </div>
);

const UserSelector = ({ selectedOption, memberEmails, handleSelect, handleAddEmail, handleRemoveEmail, emails, setEmails, email, setEmail, cellEdit, handleUpdateCell }) => (
  <div className="flex flex-col space-y-4">
    <Select
      label="User Selection"
      variant="bordered"
      placeholder="Select user option"
      selectedKeys={[selectedOption]}
      className="max-w-xs"
      onChange={handleSelect}
    >
      {UserOptions.map((option) => (
        <SelectItem key={option.key} value={option.key}>
          {option.label}
        </SelectItem>
      ))}
    </Select>
    {selectedOption === "manual" ? (
      <div>
        <Input
          label="Email Address"
          type="email"
          value={email}
          isInvalid={!isValidEmail(email) && email !== ''}
          errorMessage={!isValidEmail(email) && email !== '' ? "Please enter a valid email" : ""}
          required
          onChange={(e) => setEmail(e.target.value)}
          classNames={{
            inputWrapper: "max-w-xs",
            input: [
              "rounded-md",
              "shadow-xl",
              "bg-default-200/50",
              "dark:bg-default/60",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "hover:bg-default-200/70",
              "dark:hover:bg-default/70",
              "group-data-[focus=true]:bg-default-200/50",
              "dark:group-data-[focus=true]:bg-default/60",
              "!cursor-text",
            ],
          }}
          startContent={<Mail className="mr-2" />}
          endContent={
            email && (
              <button
                className="absolute right-4 bottom-4 flex items-center justify-center rounded-full w-2 h-2 bg-slate-200 hover:bg-slate-400"
                onClick={() => setEmail('')}
                type="button"
              >
                <X className="w-3 h-3 text-gray-800 cursor-pointer" />
              </button>
            )
          }
        />
        <Button onClick={() => handleAddEmail(email)} className="mt-2">Add Email</Button>
      </div>
    ) : (
      <Dropdown>
        <DropdownTrigger>
          <Button className="text-white" variant="bordered">Select Organization Members</Button>
        </DropdownTrigger>
        <DropdownMenu 
          selectionMode="multiple"
          selectedKeys={new Set(emails)}
          onSelectionChange={(keys) => {
            const selectedEmails = Array.from(keys);
            setEmails(selectedEmails);
          }}
        >
          {memberEmails.map((email) => (
            <DropdownItem key={email}>{email}</DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    )}
    <div className="mt-4">
      {emails.length > 0 ? (
        emails.map((email, index) => (
          <Chip
            key={index}
            onClose={() => handleRemoveEmail(email)}
            variant="flat"
            className="m-1"
          >
            {email}
          </Chip>
        ))
      ) : (
        <p className="text-indigo-500/75">No emails to display.</p>
      )}
    </div>
    {cellEdit && <Button onClick={async () => handleUpdateCell({key: 'users', value: emails})}>Update</Button>}
  </div>
);

const CellPopover = ({ object, trigger, children, onReset }) => {
  const [editMode, setEditMode] = useState(false);
  const handleSwitch = useCallback(() => setEditMode(prev => !prev), []);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={onReset}>
          {trigger}
        </Button>
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
                    <p className="font-semibold">{object.name}</p>
                    <p className="text-gray-600">{object.value}</p>
                  </div>
                ) : (
                  children
                )}
              </motion.div>
            </AnimatePresence>
          </CardBody>
          <CardFooter className="bg-gray-50 rounded-b-lg flex justify-center items-center">
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

const EditPopover = ({ item, roles, handleRoleSelect, handleRemoveRole, permissions, handlePermissionSelect, handleRemovePermission, selectedUserOption, handleUserSelect, memberEmails, handleAddEmail, handleRemoveEmail, emails, email, setEmail, setEmails, onUpdate, onReset }) => {
  const handleUpdate = async () => {
    const newRecord = {
      orgId: item.orgId,
      roles: roles,
      permissions: permissions,
      users: validEmails.map(email => {
        const user = allUsers.find(user => user.email === email);
        return user._id;
      }),
    };
    await onUpdate(newRecord);
  };

  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <Button isIconOnly size="sm" variant="light" onClick={onReset}>
          <Edit2 size={18} className="text-green-600 dark:text-green-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-2 w-80">
          <h3 className="text-lg font-semibold mb-2">Current Record:</h3>
          <pre className="whitespace-pre-wrap overflow-auto max-h-40 mb-4 text-sm bg-gray-100 p-2 rounded text-gray-900/75">
            {JSON.stringify(processModelData(item), null, 2)}
          </pre>
          <Selector
            options={RoleOptions}
            selectedOptions={roles}
            handleSelect={handleRoleSelect}
            handleRemove={handleRemoveRole}
            label="Roles"
          />
          <Selector
            options={PermissionOptions}
            selectedOptions={permissions}
            handleSelect={handlePermissionSelect}
            handleRemove={handleRemovePermission}
            label="Permissions"
          />
          <UserSelector
            selectedOption={selectedUserOption}
            memberEmails={memberEmails}
            handleSelect={handleUserSelect}
            handleAddEmail={handleAddEmail}
            handleRemoveEmail={handleRemoveEmail}
            emails={emails}
            setEmails={setEmails}
            email={email}
            setEmail={setEmail}
          />
          <Button onClick={handleUpdate} className="mt-4 w-full">
            Update Record
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const ViewPopover = ({ item }) => (
  <Popover placement="bottom">
    <PopoverTrigger>
      <Button isIconOnly size="sm" variant="light">
        <Eye size={18} className="text-blue-600 dark:text-blue-400" />
      </Button>
    </PopoverTrigger>
    <PopoverContent>
      <div className="px-1 py-2">
        <pre className="whitespace-pre-wrap overflow-auto max-h-96 text-gray-900/75">
          {JSON.stringify(processModelData(item), null, 2)}
        </pre>
      </div>
    </PopoverContent>
  </Popover>
);

const ActionButtonSection: React.FC<ActionButtonSectionProps> = ({ event, handleAction }) => {
  const [isHovered, setIsHovered] = useState(false);

  const buttonVariants = {
    idle: { scale: 1, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' },
    hover: { scale: 1.05, boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)' },
    tap: { scale: 0.95, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' },
  };

  const gradientVariants = {
    idle: { opacity: 0.8 },
    hover: { opacity: 1, filter: 'brightness(1.2)' },
  };

  return (
    <div className="flex items-center justify-center my-10">
      <motion.div
        className="relative"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
          variants={gradientVariants}
          initial="idle"
          animate={isHovered ? "hover" : "idle"}
          transition={{ duration: 0.3 }}
        />
        <motion.button
          onClick={handleAction}
          className="relative w-64 h-16 bg-white text-blue-600 font-bold text-lg py-2 px-6 rounded-xl overflow-hidden"
          variants={buttonVariants}
          initial="idle"
          whileHover="hover"
          whileTap="tap"
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <motion.div
            className="flex items-center justify-center space-x-2"
            initial={{ y: 0 }}
            animate={{ y: isHovered ? -2 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {event === "update" ? <FaEdit className="mr-2" /> : <FaPlus className="mr-2" />}
            <span>{event === "update" ? "Update Organization" : "Add Organization"}</span>
          </motion.div>
        </motion.button>
      </motion.div>
    </div>
  );
};

const INITIAL_VISIBLE_COLUMNS = [ "organization", "roles", "permissions", "users", "actions" ];

export const TableResult = ({ data, onUpdateTable, onUpdateCell, onDeleteRow }) => {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set());
  const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [emails, setEmails] = useState([]);
  const [memberEmails, setMemberEmails] = useState([]);
  const [selectedUserOption, setSelectedUserOption] = useState(UserOptions[0].key);
  const [email, setEmail] = useState("");
  const getChatByID = useMutation(api.chats.getChatByID);
  const allUsers = useQuery(api.users.getAllUsers);
  const { userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });
  const handleAddMemberEmails = async () => {
    if (!selectedOrg?.orgId) {
      toast.error('No organization selected');
      return;
    }
    try {
      const response = await fetch('/api/get_memberships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ organizationId: selectedOrg.orgId }),
      });

      const resData = await response.json();

      if (response.ok) {
        const memberships = resData.memberships.data;

        if (memberships.length > 0) {
          const memberEmails = memberships
            .map(mem => mem?.publicUserData?.identifier)
            .filter(email => isValidEmail(email));

          if (memberEmails.length > 0) {
            setMemberEmails(memberEmails);
          } else {
            toast.error('No valid emails found in user list');
          }
        } else {
          toast.error('No memberships found for the selected organization');
        }
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error fetching memberships:', error);
      toast.error('Failed to fetch memberships');
    }
  };

  const handleRoleSelect = (selectedRoles) => {
    setRoles(prevRoles => {
      const newRoles = Array.from(new Set([...prevRoles, ...selectedRoles]));
      return newRoles;
    });
  };

  const handleRemoveRole = (roleToRemove) => {
    setRoles(roles.filter(role => role !== roleToRemove));
  };

  const handlePermissionSelect = (selectedPermissions) => {
    setPermissions(prevPermissions => {
      const newPermissions = Array.from(new Set([...prevPermissions, ...selectedPermissions]));
      return newPermissions;
    });
  };

  const handleRemovePermission = (permissionToRemove) => {
    setPermissions(permissions.filter(permission => permission !== permissionToRemove));
  };

  const handleUserSelect = (e) => {
    const option = e.target.value;
    setSelectedUserOption(option);
    if (option === "organization") {
      handleAddMemberEmails();
    }
  };

  const handleAddEmail = (newEmail) => {
    if (isValidEmail(newEmail) && !emails.includes(newEmail)) {
      setEmails(prevEmails => [...prevEmails, newEmail]);
      setEmail("");
    }
  };

  const handleRemoveEmail = (emailToRemove) => {
    setEmails(emails.filter(email => email !== emailToRemove));
  };

  const handleReset = () => {
    setRoles([]);
    setPermissions([]);
    setEmails([]);
  };

  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "name",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return organizationColumns;
    return organizationColumns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredData = [...data];

    if (hasSearchFilter) {
      filteredData = filteredData.filter((item) =>
        item.organization.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredData = filteredData.filter((item) =>
        Array.from(statusFilter).includes(item.status),
      );
    }

    return filteredData;
  }, [data, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((item, columnKey) => {
    const cellValue = item[columnKey];
    const column = organizationColumns.find(col => col.uid === columnKey);
    switch (columnKey) {
      case "status":
        return (
          <Chip className="capitalize" color={statusColorMap[item.status]} size="sm" variant="flat">
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <ViewPopover item={item} />
            <EditPopover 
              item={item}
              roles={roles} 
              handleRoleSelect={handleRoleSelect} 
              handleRemoveRole={handleRemoveRole} 
              permissions={permissions} 
              handlePermissionSelect={handlePermissionSelect} 
              handleRemovePermission={handleRemovePermission} 
              selectedUserOption={selectedUserOption} 
              handleUserSelect={handleUserSelect} 
              email={email} 
              emails={emails} 
              memberEmails={memberEmails}
              handleAddEmail={handleAddEmail}
              handleRemoveEmail={handleRemoveEmail}
              setEmail={setEmail}
              setEmails={setEmails}
              onUpdate={onUpdateTable} 
              onReset={handleReset}
            />
            <Tooltip content="Delete">
              <Button isIconOnly size="sm" variant="light" onClick={() => onDeleteRow(item.orgId)}>
                <Trash size={18} className="text-red-600 dark:text-red-400" />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return (
          <>
            {column?.editable !== "READONLY" ? (
              <CellPopover
                object={{name: columnKey, value: cellValue}}
                trigger={
                  <div className="cursor-pointer hover:bg-violet-500/50 p-2 bg-violet-300/50 rounded transition-colors w-full h-full">
                    {cellValue}
                  </div>
                }
                onReset={handleReset}
              >
                {columnKey === "users" && (
                  <UserSelector
                    selectedOption={selectedUserOption}
                    memberEmails={memberEmails}
                    handleSelect={handleUserSelect}
                    handleAddEmail={handleAddEmail}
                    handleRemoveEmail={handleRemoveEmail}
                    emails={emails}
                    email={email}
                    setEmail={setEmail}
                    cellEdit
                    handleUpdateCell={onUpdateCell}
                  />
                )}
                {columnKey === "roles" && (
                  <Selector
                    options={RoleOptions}
                    selectedOptions={roles}
                    handleSelect={handleRoleSelect}
                    handleRemove={handleRemoveRole}
                    label="Roles"
                    cellEdit
                    handleUpdateCell={onUpdateCell}
                  />
                )}
                {columnKey === "permissions" && (
                  <Selector
                    options={PermissionOptions}
                    selectedOptions={permissions}
                    handleSelect={handlePermissionSelect}
                    handleRemove={handleRemovePermission}
                    label="Permissions"
                    cellEdit
                    handleUpdateCell={onUpdateCell}
                  />

                )}
              </CellPopover>
            ) : (
             <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 p-2 rounded-md shadow-sm"
            >
              <Tag className="w-4 h-4 text-indigo-500" />
              <p className="font-semibold text-sm text-gray-700 truncate">
                {cellValue}
              </p>
            </motion.div>
            )}
          </>
        );
    }
  }, [onUpdateCell, onUpdateTable, onDeleteRow]);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by organization name..."
            startContent={<Search />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDown className="text-small" />} variant="flat">
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {status.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDown className="text-small" />} variant="flat">
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
                {organizationColumns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {data.length} organizations</span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    organizationColumns,
    onRowsPerPageChange,
    data,
    onSearchChange,
    onClear,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Previous
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, filteredItems.length, page, pages, onPreviousPage, onNextPage]);

  return (
    <Table
      aria-label="Organization management table"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[382px]",
      }}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
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
      <TableBody items={sortedItems} emptyContent={"No organizations found"}>
        {(item) => (
          <TableRow key={item.orgId}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

const ChatManagementModal = () => {
  const { user } = useUser();
  const { selectedChat } = useGeneralContext();
  const [_chat, _setChat] = useState(null);
  const [_event, _setEvent] = useState<"add" | "update">("add");
  const [selectedOrg, setSelectedOrg] = useState<Organization>(null);
  const updateChat = useMutation(api.chats.updateChat);
  const { isOpen, onClose } = useChatManagement();
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [emails, setEmails] = useState([]);
  const [memberEmails, setMemberEmails] = useState([]);
  const [selectedUserOption, setSelectedUserOption] = useState(UserOptions[0].key);
  const [email, setEmail] = useState("");
  const getChatByID = useMutation(api.chats.getChatByID);
  const allUsers = useQuery(api.users.getAllUsers);
  const [tableData, setTableData] = useState([]);
  const { userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  useEffect(() => {
    const fetchchat = async () => {
      if (selectedChat) {
        const chat = await getChatByID(
          selectedOrg
            ? { id: selectedChat, activeOrgId: selectedOrg.orgId }
            : { id: selectedChat }
        );
        _setChat(chat);
        if (chat && chat?.metaData && chat?.metaData?.orgs) {
          if (selectedOrg && selectedOrg.orgId && chat.metaData.orgs.includes(selectedOrg.orgId)) {
            toast.warning("The organization already exists. Would you like to update the current status instead?");
            _setEvent("update");
          }
          const data = chat.metaData?.orgs?.map((org) => ({
            orgId: org.orgId,
            organization: userMemberships.data?.find(mem => mem.organization?.id === org.orgId)?.organization?.name ?? 'Unknown',
            roles: org.roles?.join(", ") || "",
            users: org.users?.map(userId => 
              allUsers?.find(user => user._id === userId)?.userInfo?.email
            ).filter(Boolean).join(", ") || "",      
            permissions: Object.entries(org.permissions || {})
              .filter(([_, value]) => value)
              .map(([key, _]) => key)
              .join(", "),
          }));
          setTableData(data);
        }
      }
    };
    if (selectedChat) { 
      fetchchat();
    }
  }, [selectedChat, selectedOrg, userMemberships]);

  const handleAddMemberEmails = async () => {
    if (!selectedOrg?.orgId) {
      toast.error('No organization selected');
      return;
    }
    try {
      const response = await fetch('/api/get_memberships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ organizationId: selectedOrg.orgId }),
      });

      const resData = await response.json();

      if (response.ok) {
        const memberships = resData.memberships.data;

        if (memberships.length > 0) {
          const memberEmails = memberships
            .map(mem => mem?.publicUserData?.identifier)
            .filter(email => isValidEmail(email));

          if (memberEmails.length > 0) {
            setMemberEmails(memberEmails);
          } else {
            toast.error('No valid emails found in user list');
          }
        } else {
          toast.error('No memberships found for the selected organization');
        }
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error fetching memberships:', error);
      toast.error('Failed to fetch memberships');
    }
  };

  const updateChatAndTable = async (newRecord) => {
    try {
      const updatedMetaData = { ..._chat.metaData };
      
      if (!updatedMetaData.orgs || !Array.isArray(updatedMetaData.orgs)) {
        updatedMetaData.orgs = [];
      }
      const orgIndex = updatedMetaData.orgs.findIndex(org => org.orgId === selectedOrg.orgId);
      if (orgIndex !== -1) {
        updatedMetaData.orgs[orgIndex] = newRecord;
      } else {
        updatedMetaData.orgs.push(newRecord);
      }

      await updateChat({
        id: selectedChat,
        activeOrgId: selectedOrg.orgId,
        metaData: updatedMetaData,
      });

      setTableData(prevData => {
        const newData = Array.isArray(prevData) ? [...prevData] : [];
        const dataIndex = newData.findIndex(item => item.orgId === selectedOrg.orgId);
        const formatPermissions = (permissions) => {
          if (typeof permissions !== 'object' || permissions === null) return "None";
          return Object.entries(permissions)
            .filter(([_, value]) => value)
            .map(([key, _]) => key)
            .join(", ") || "None";
        };
        const newItem = {
          key: dataIndex !== -1 ? newData[dataIndex].key : newData.length,
          orgId: selectedOrg.orgId,
          organization: userMemberships.data?.find(mem => mem.organization.id === selectedOrg.orgId)?.organization.name || 'Unknown',
          roles: Array.isArray(newRecord.roles) && newRecord.roles.length > 0 ? newRecord.roles.join(", ") : "None",
          permissions: formatPermissions(newRecord.permissions),
          users: Array.isArray(newRecord.users) && newRecord.users.length > 0 ? newRecord.users.join(", ") : "None",
        };
        if (dataIndex !== -1) {
          newData[dataIndex] = newItem;
        } else {
          newData.push(newItem);
        }
        return newData;
      });

      toast.success('chat and table updated successfully!');
    } catch (error) {
      console.error('Error updating chat and table:', error);
      toast.error('Failed to update chat and table. Please try again.');
      throw error; 
    }
  };

  const handleRoleSelect = (selectedRoles) => {
    setRoles(prevRoles => {
      const newRoles = Array.from(new Set([...prevRoles, ...selectedRoles]));
      return newRoles;
    });
  };

  const handleRemoveRole = (roleToRemove) => {
    setRoles(roles.filter(role => role !== roleToRemove));
  };

  const handlePermissionSelect = (selectedPermissions) => {
    setPermissions(prevPermissions => {
      const newPermissions = Array.from(new Set([...prevPermissions, ...selectedPermissions]));
      return newPermissions;
    });
  };

  const handleRemovePermission = (permissionToRemove) => {
    setPermissions(permissions.filter(permission => permission !== permissionToRemove));
  };

  const handleUserSelect = (e) => {
    const option = e.target.value;
    setSelectedUserOption(option);
    if (option === "organization") {
      handleAddMemberEmails();
    }
  };

  const handleAddEmail = (newEmail) => {
    if (isValidEmail(newEmail) && !emails.includes(newEmail)) {
      setEmails(prevEmails => [...prevEmails, newEmail]);
      setEmail("");
    }
  };

  const handleRemoveEmail = (emailToRemove) => {
    setEmails(emails.filter(email => email !== emailToRemove));
  };

  const handleReset = () => {
    setRoles([]);
    setPermissions([]);
    setEmails([]);
  };

  const handleAddOrUpdate = async () => {
    try {
      const validEmails = [];
      const invalidEmails = [];
      emails.forEach(email => {
        const user = allUsers.find(user => user.userInfo.email === email);
        if (user) {
          validEmails.push(email);
        } else {
          invalidEmails.push(email);
        }
      });
      invalidEmails.forEach(email => {
        toast.error(`User with email ${email} is not currently a member of Wapp and will be removed from the list.`);
      });
      setEmails(validEmails);
      const newRecord = {
        orgId: selectedOrg.orgId,
        roles: roles,
        permissions: PermissionOptions.reduce((acc, { key }) => {
          acc[key] = permissions.includes(key);
          return acc;
        }, {}),
        users: validEmails.map(email => {
          const user = allUsers.find(user => user.userInfo.email === email);
          return user._id;
        }),
      };
      await updateChatAndTable(newRecord);
      toast.success('Organization updated successfully!');
      handleReset();
    } catch (error) {
      console.error('Error updating organization:', error);
      toast.error('Failed to update organization. Please try again.');
    }
  };

  const handleRemove = async (orgId) => {
    try {
      const updatedMetaData = { ..._chat.metaData };
      updatedMetaData.orgs = updatedMetaData.orgs.filter(org => org.orgId !== orgId);

      await updateChat({
        id: selectedChat,
        activeOrgId: selectedOrg.orgId,
        metaData: updatedMetaData,
      });
      setTableData(prevData => prevData.filter(item => item.orgId !== orgId));
      toast.success('Organization removed successfully!');
    } catch (error) {
      console.error('Error removing organization:', error);
      toast.error('Failed to remove organization. Please try again.');
    }
  };

  const handleUpdateCell = async ({ key, value }) => {
    const newRecord = {
      orgId: selectedOrg.orgId,
      [key]: key === "roles" || key === "permissions" || key === "users"
        ? value.split(", ").map(item => item.trim())
        : value
    };
    
    await updateChatAndTable(newRecord);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      size="5xl"
      scrollBehavior="inside"
      classNames={{
        wrapper: "z-[99999]",
        body: "py-6",
        backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
        base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
        header: "border-b-[1px] border-[#292f46]",
        footer: "border-t-[1px] border-[#292f46]",
        closeButton: "hover:bg-white/5 active:bg-white/10",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            {_chat ? (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Organization Management
                </ModalHeader>
                <ModalBody>
                  <h3>Your current chat: <span>{_chat.chatTitle}</span></h3>
                  <SelectorSection>
                    <OrganizationList selectedOrg={selectedOrg} setSelectedOrg={setSelectedOrg} />
                    <Selector
                      options={RoleOptions}
                      selectedOptions={roles}
                      handleSelect={handleRoleSelect}
                      handleRemove={handleRemoveRole}
                      label="Roles"
                    />
                    <Selector
                      options={PermissionOptions}
                      selectedOptions={permissions}
                      handleSelect={handlePermissionSelect}
                      handleRemove={handleRemovePermission}
                      label="Permissions"
                    />
                    <UserSelector
                      selectedOption={selectedUserOption}
                      memberEmails={memberEmails}
                      handleSelect={handleUserSelect}
                      handleAddEmail={handleAddEmail}
                      handleRemoveEmail={handleRemoveEmail}
                      emails={emails}
                      email={email}
                      setEmail={setEmail}
                      setEmails={setEmails}
                    />
                  </SelectorSection>
                  <ActionButtonSection event={_event} handleAction={handleAddOrUpdate} />
                  <TableResult 
                    data={tableData} 
                    onUpdateTable={updateChatAndTable}
                    onDeleteRow={handleRemove}
                    onUpdateCell={handleUpdateCell}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-8 min-h-[200px] flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg"
              >
                <FileX size={48} className="text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">No Chat Available</h2>
                <p className="text-gray-400 text-center max-w-sm">
                  It looks like there are no chats to display at the moment. 
                  Please reselect the chat to continue.
                </p>
              </motion.div>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

ChatManagementModal.displayName = "ChatManagementModal";

export default ChatManagementModal;




