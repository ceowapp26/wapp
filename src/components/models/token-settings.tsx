import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Select,
  SelectItem,
  Input,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Chip,
} from "@nextui-org/react";
import { useQuery, useMutation } from 'convex/react';
import { api } from "@/convex/_generated/api";
import { toast } from 'sonner';
import { useMyspaceContext } from '@/context/myspace-context-provider';
import { modelOptions } from "@/constants/ai";
import { useUser, useOrganization, useOrganizationList } from "@clerk/nextjs";
import { Mail, X } from 'lucide-react';

const RecipientOptions = [
  { key: "manual", label: "Manual" },
  { key: "organization", label: "Organization" },
];

const isValidEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};

const UserSelector = ({ control, errors, selectedOption, memberEmails, handleSelect, handleAddEmail, handleRemoveEmail, emails, setEmails, email, setEmail }) => (
  <div className="flex flex-col space-y-4">
    <Controller
      name="recipientOption"
      control={control}
      render={({ field }) => (
        <Select
          label="User Selection"
          variant="bordered"
          placeholder="Select user option"
          selectedKeys={[selectedOption]}
          className="max-w-xs"
          onChange={(e) => {
            field.onChange(e);
            handleSelect(e);
          }}
        >
          {RecipientOptions.map((option) => (
            <SelectItem key={option.key} value={option.key}>
              {option.label}
            </SelectItem>
          ))}
        </Select>
      )}
    />
    {selectedOption === "manual" ? (
      <div>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              label="Email Address"
              type="email"
              {...field}
              isInvalid={!isValidEmail(field.value) && field.value !== ''}
              errorMessage={!isValidEmail(field.value) && field.value !== '' ? "Please enter a valid email" : ""}
              required
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
                    onClick={() => field.onChange('')}                    
                    type="button"
                  >
                    <X className="w-3 h-3 text-gray-800 cursor-pointer" />
                  </button>
                )
              }
            />
          )}
        />
        <Button onClick={() => {
          const emailValue = control._formValues.email;
          if (isValidEmail(emailValue)) {
            handleAddEmail(emailValue);
            control._reset({ email: '' });
          }
        }} className="mt-2">Add Email</Button>
      </div>
    ) : (
      <Dropdown>
        <DropdownTrigger>
          <Button className="text-black" variant="bordered">Select Organization Members</Button>
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
  </div>
);

const TokenSettings = () => {
  const [selectedModel, setSelectedModel] = useState('');
  const [recipientOption, setRecipientOption] = useState(RecipientOptions[0].key);
  const { selectedOrg } = useMyspaceContext();
  const [memberEmails, setMemberEmails] = useState([]);
  const [emails, setEmails] = useState([]);
  const [email, setEmail] = useState("");

  const currentUser = useQuery(api.users.getCurrentUser);
  const getAllUsers = useMutation(api.users.getAllUsers);
  const updateUser = useMutation(api.users.updateUser);

  const { userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  const schema = z.object({
    model: z.enum(modelOptions),
    tokenType: z.enum(['inputTokens', 'outputTokens']),
    amount: z.number().positive().max(
      z.number().refine(val => {
        if (watch('tokenType') === 'inputTokens') return val <= maxInputTokens;
        return val <= maxOutputTokens;
      }, {
        message: "Amount exceeds available tokens"
      })
    ),
    recipients: z.array(z.string().email()).min(1, "At least one recipient is required"),
    recipientOption: z.enum(['manual', 'organization']),
    email: z.string().email().optional(),
  });

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      model: 'gpt-3.5-turbo',
      tokenType: 'inputTokens',
      amount: 0,
      recipients: [],
      recipientOption: 'manual',
      email: '',
    },
  });

  const maxInputTokens = currentUser?.models?.find(model => model.model === watch('model'))?.inputTokens || 0;
  const maxOutputTokens = currentUser?.models?.find(model => model.model === watch('model'))?.outputTokens || 0;

  const handleRecipientSelect = (e) => {
    const option = e.target.value;
    setRecipientOption(option);
    if (option === "organization") {
      handleAddMemberEmails();
    }
  };

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
        throw new Error(resData.error);
      }
    } catch (error) {
      console.error('Error fetching memberships:', error);
      toast.error('Failed to fetch memberships');
    }
  };

  const handleAddEmail = (newEmail) => {
    if (isValidEmail(newEmail) && !emails.includes(newEmail)) {
      setEmails(prevEmails => [...prevEmails, newEmail]);
      setEmail("");
      setValue('recipients', [...emails, newEmail]);
    }
  };

  const handleRemoveEmail = (emailToRemove) => {
    const updatedEmails = emails.filter(email => email !== emailToRemove);
    setEmails(updatedEmails);
    setValue('recipients', updatedEmails);
  };

  const onSubmit = async (data) => {
    try {
      const allUsers = await getAllUsers();
      const recipientIds = data.recipients.map(email => {
        const user = allUsers.find(u => u.userInfo.email === email);
        return user ? user._id : null;
      }).filter(id => id !== null);

      for (const userId of recipientIds) {
        const user = allUsers.find(u => u._id === userId);
        if (user) {
          const updatedModels = { ...user.models };
          if (!updatedModels[data.model]) {
            updatedModels[data.model] = { inputTokens: 0, outputTokens: 0 };
          }
          updatedModels[data.model][data.tokenType] += data.amount;

          await updateUser({ userId, models: updatedModels });
        }
      }

      // Update current user's tokens
      const updatedCurrentUserModels = { ...currentUser.models };
      updatedCurrentUserModels[data.model][data.tokenType] -= data.amount * recipientIds.length;
      await updateUser({ userId: currentUser._id, models: updatedCurrentUserModels });

      toast.success('Tokens transferred successfully');
    } catch (error) {
      console.error('Error transferring tokens:', error);
      toast.error('Failed to transfer tokens');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-col items-center">
        <h2 className="text-2xl font-bold">Transfer Tokens</h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            name="model"
            control={control}
            render={({ field }) => (
              <Select
                label="Select Model"
                {...field}
                error={errors.model?.message}
              >
                {modelOptions.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </Select>
            )}
          />

          <Controller
            name="tokenType"
            control={control}
            render={({ field }) => (
              <Select
                label="Token Type"
                {...field}
                error={errors.tokenType?.message}
              >
                <SelectItem key="inputTokens" value="inputTokens">
                  Input Tokens
                </SelectItem>
                <SelectItem key="outputTokens" value="outputTokens">
                  Output Tokens
                </SelectItem>
              </Select>
            )}
          />

          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <Input
                type="number"
                label="Amount"
                {...field}
                error={errors.amount?.message}
              />
            )}
          />

          <UserSelector
            control={control}
            errors={errors}
            selectedOption={recipientOption}
            memberEmails={memberEmails}
            handleSelect={handleRecipientSelect}
            handleAddEmail={handleAddEmail}
            handleRemoveEmail={handleRemoveEmail}
            emails={emails}
            setEmails={setEmails}
            email={email}
            setEmail={setEmail}
          />

          <Button type="submit" color="primary" size="lg" className="w-full">
            Transfer Tokens
          </Button>
        </form>
      </CardBody>
      <CardFooter>
        <p className="text-sm text-gray-500">
          Available Tokens: Input - {maxInputTokens}, Output - {maxOutputTokens}
        </p>
      </CardFooter>
    </Card>
  );
};

export default TokenSettings;

