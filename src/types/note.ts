export type Value = {
    type: string;
    content: [{ type: string; content: [{ text: string; type: string }] }];
};

export type Organization = {
  orgName: string;
  orgId: string;
  orgLogo?: string;
};
