"use client"
import React, { useState, useEffect } from "react";
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import DashboardCard from '../_components/cards'
import { PlanUsage } from '../_components/plan-usage'
import InfoBar from '../_components/info-bar'
import { Separator } from '@/components/ui/separator'
import CalIcon from '@/icons/cal-icon'
import EmailIcon from '@/icons/email-icon'
import PersonIcon from '@/icons/person-icon'
import { TransactionsIcon } from '@/icons/transactions-icon'
import { DollarSign, ChevronRight } from 'lucide-react'

const BalancePage = () => {
  const [numOfUsers, setNumOfUsers] = useState<number>(0);
  const allUsers = useQuery(api.users.getAllUsers);

  useEffect(() => {
    if (allUsers) {
      setNumOfUsers(allUsers.length);
    }
  }, [allUsers]);

  return (
    <div className="bg-gray-50 w-full min-h-screen">
      <InfoBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <DashboardCard
            value={numOfUsers}
            title="Total Users"
            icon={<PersonIcon className="text-blue-500" />}
            className="bg-white shadow-lg rounded-lg"
          />
          <DashboardCard
            value={0}
            sales
            title="Total Value"
            icon={<DollarSign className="text-green-500" />}
            className="bg-white shadow-lg rounded-lg"
          />
          <DashboardCard
            value={0}
            title="Appointments"
            icon={<CalIcon className="text-purple-500" />}
            className="bg-white shadow-lg rounded-lg"
          />
          <DashboardCard
            value={0}
            sales
            title="Total Usage"
            icon={<DollarSign className="text-orange-500" />}
            className="bg-white shadow-lg rounded-lg"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="font-bold text-2xl mb-2 text-gray-800">Plan Usage</h2>
            <p className="text-sm text-gray-600 mb-6">
              A detailed overview of your metrics, usage and more
            </p>
            <PlanUsage />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <TransactionsIcon className="text-indigo-500" />
                <h2 className="font-bold text-2xl text-gray-800">Recent Transactions</h2>
              </div>
              <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
                See more
                <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
            <Separator className="mb-4" />
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div>
                      <p className="font-medium">Transaction {item}</p>
                      <p className="text-sm text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <p className="font-semibold text-green-600">+$50.00</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalancePage;