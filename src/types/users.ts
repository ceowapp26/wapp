export type UserModelInfo = {
  cloudModelId?: string;
  model: string;
  RPM?: number;
  RPD?: number;
  TPM?: number;
  TPD?: number;
  inputTokens?: number;
  outputTokens?: number;
  purchasedAmount?: number;
};

export type UserCreditInfo = {
  transactionId?: string;
  service?: string;
  app?: string;
  models?: ModelType[];
  currentCredit?: number;
  spentCredit?: number;
  remainingCredit?: number;
  totalSpentCredit?: number;
  type?: string;
  amountPaid?: number;
  amountDue?: number;
  paidDate?: string;
  dueDate?: string;
  currency?: string;
  status?: string;
};
