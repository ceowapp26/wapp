'use client';

import React from "react";
import { useOrganizationList, useUser } from '@clerk/nextjs';
import { Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Card, CardBody, CardHeader, Chip } from "@nextui-org/react";
import { ChevronLeft, ChevronRight, Building2, Calendar, UserCircle2, CircleUser } from 'lucide-react';

export const userMembershipsParams = {
  memberships: {
    pageSize: 5,
    keepPreviousData: true,
  },
};

export const JoinedOrganizations = () => {
  const { user } = useUser();
  const { isLoaded, userMemberships } = useOrganizationList({
    userMemberships: userMembershipsParams,
  });

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center w-full">
        <Button
          disabled={!userMemberships?.hasPreviousPage || userMemberships?.isFetching}
          onClick={() => userMemberships?.fetchPrevious?.()}
          startContent={<ChevronLeft size={18} />}
          color="primary"
          variant="flat"
        >
          Previous
        </Button>
        <Button
          disabled={!userMemberships?.hasNextPage || userMemberships?.isFetching}
          onClick={() => userMemberships?.fetchNext?.()}
          endContent={<ChevronRight size={18} />}
          color="primary"
          variant="flat"
        >
          Next
        </Button>
      </div>
    );
  }, [userMemberships]);

  return (
    <Card className="max-w-[450px] w-full">
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Organizations</h2>
        <Chip color="primary" variant="flat">{userMemberships?.data?.length || 0} Organizations</Chip>
      </CardHeader>
      <CardBody className="px-0">
        <Table
          aria-label="User Organization Memberships"
          removeWrapper
          shadow="sm"
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          classNames={{
            wrapper: "min-w-full",
            th: "text-center",
          }}
        >
          <TableHeader>
            <TableColumn><CircleUser className="mx-auto mb-1 mt-1" size={18} />Identifier</TableColumn>
            <TableColumn><Building2 className="mx-auto mb-1 mt-1" size={18} />Organization</TableColumn>
            <TableColumn><Calendar className="mx-auto mb-1 mt-1" size={18} />Joined</TableColumn>
            <TableColumn><UserCircle2 className="mx-auto mb-1 mt-1" size={18} />Role</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No organizations joined yet.">
            {userMemberships?.data?.map((mem) => (
              <TableRow key={mem.id}>
                <TableCell>{mem.publicUserData.identifier}</TableCell>
                <TableCell className="font-medium">{mem.organization.name}</TableCell>
                <TableCell>{new Date(mem.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip className="text-black" color="secondary" variant="flat">
                    {mem.role}
                  </Chip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
};