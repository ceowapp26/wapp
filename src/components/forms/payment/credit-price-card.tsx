'use client';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CreditCard } from 'lucide-react';
import React from 'react';
import PaypalButtonComponent from "@/components/paypal/button";
import StripeButtonComponent from "@/components/stripe/button";
import { createOrder, onApproveOrder, onErrorOrderPayment, createSubscription, onApproveSubscription, onErrorSubscriptionPayment } from "@/actions/payments/paypal";
import { createParams, onError } from "@/actions/payments/stripe";
import Image from "next/image";
import { usePaymentContextHook } from "@/context/payment-context-provider";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import ButtonHandler from './button-handlers';

type Props = {};

const CreditPriceCard = (props: Props) => {
  const { basePriceInfo, purchasePriceInfo } = usePaymentContextHook();

  return (
    <Card className={cn('w-full h-full flex justify-center items-center p-10 cursor-pointer mb-4')}>
      <CardContent className="flex bg-slate-100 rounded-md flex-col justify-between p-14">
        <CardDescription className="text-iridium semi-bold text-xl h-full py-6">
          <span>Your total amount is <span className="bold text-cyan-500 text-2xl">{Object.keys(purchasePriceInfo).map(model => purchasePriceInfo[model].totalPrice)}USD</span></span> 
        </CardDescription>
        <div className="overflow-x-auto">
          <span className="text-iridium font-bold text-sm left-2">Model Price Information</span> 
          <Table className="p-4" aria-label="Credit Price Info">
            <TableHeader>
              <TableColumn>Model</TableColumn>
              <TableColumn>Input Tokens</TableColumn>
              <TableColumn>Output Tokens</TableColumn>
            </TableHeader>
            <TableBody>
              {Object.keys(basePriceInfo).map(model => (
                model !== 'totalPrice' && (
                  <TableRow key={model}>
                    <TableCell>{model}</TableCell>
                    <TableCell>
                      Price: {basePriceInfo[model].inputTokens.price} <br />
                      Unit: {basePriceInfo[model].inputTokens.unit}
                    </TableCell>
                    <TableCell>
                      Price: {basePriceInfo[model].outputTokens.price} <br />
                      Unit: {basePriceInfo[model].outputTokens.unit}
                    </TableCell>
                  </TableRow>
                )
              ))}
            </TableBody>
          </Table>
        </div>
        <ButtonHandler />
      </CardContent>
    </Card>
  );
};

export default CreditPriceCard;
