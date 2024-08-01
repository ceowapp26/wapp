"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Time } from "@internationalized/date";
import { 
  Calendar, 
  Radio, 
  RadioGroup, 
  ButtonGroup, 
  cn, 
  Input, 
  Button, 
  TimeInput, 
  Textarea,  
  Chip,
} from "@nextui-org/react";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { WELCOMETEMPLATE, SUBSCRIPTIONREMINDERTEMPLATE, NOTIFICATIONREMINDERTEMPLATE } from '@/constants/emailTemplates';
import { today, getLocalTimeZone, startOfWeek, startOfMonth } from "@internationalized/date";
import { useLocale } from "@react-aria/i18n";
import { Grid, Container, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Mail, X } from 'lucide-react';
import { GradientLoadingCircle } from "@/components/gradient-loading-circle";
import { useCompletion } from "ai/react";
import MagicIcon from "@/icons/MagicIcon";
import CrazySpinnerIcon from "@/icons/CrazySpinnerIcon";
import { useStore } from "@/redux/features/apps/document/store";
import { useMyspaceContext } from "@/context/myspace-context-provider";
import { useGeneralContext } from '@/context/general-context-provider';
import { useDynamicSubmit } from "@/hooks/use-dynamic-submit";
import { styled } from '@mui/system';
import { useTranslation } from "react-i18next";
import Warning from '@/components/models/warning'; 

const isValidEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const AILoadingSpinner = () => (
  <div className="flex h-12 w-full justify-center items-center px-4 text-sm font-medium text-muted-foreground text-purple-500">
    <MagicIcon className="mr-2 h-4 w-4 shrink-0" />
      Generating Email
    <div className="ml-2 mt-1">
      <CrazySpinnerIcon />
    </div>
  </div>
);

const MultipleSelector = ({ selectedOption, memberEmails, handleSelect, handleAddEmail, handleRemoveEmail, emails, setEmails, email, setEmail }) => (
  <div className="flex flex-col space-y-4 mt-4">
    {selectedOption === "multiple" ? (
      <div>
        <Input
          label="Email Address"
          radius="lg"
          type="email"
          value={email}
          isInvalid={!isValidEmail(email) && email !== ''}
          errorMessage={!isValidEmail(email) && email !== '' ? "Please enter a valid email" : ""}
          required
          onChange={(e) => setEmail(e.target.value)}
          classNames={{
            label: "relative mt-4 text-black/50 dark:text-white/90",
            input: [
              "ml-4 p-1",
              "bg-transparent",
              "text-black/90 dark:text-white/90",
              "placeholder:text-default-700/50 dark:placeholder:text-white/60",
            ],
            innerWrapper: "bg-transparent",
            inputWrapper: [
              "h-full mt-4 w-full",
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
            clearButton: [
              "bottom-4 mr-1",
            ],
          }}
          placeholder="Enter Email"
          startContent={
            <Mail className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
          }
          endContent={
            email && (
              <button
                className="absolute right-4 bottom-4 flex items-center justify-center rounded-full w-4 h-4 bg-slate-200 hover:bg-slate-400"
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out flex items-center space-x-2">
            <span>Select Organization Members</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white text-gray-800 rounded-md shadow-xl p-2 z-[999999] max-h-60 overflow-y-auto">
          {memberEmails.map((emailItem) => (
            <DropdownMenuItem 
              key={emailItem} 
              onSelect={() => {
                setEmail(emailItem);
                handleAddEmail(emailItem);
              }}
              className="cursor-pointer hover:bg-gray-100 p-3 rounded-md transition duration-200 ease-in-out flex items-center space-x-3"
            >
              <img
                className="h-8 w-8 rounded-full"
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(emailItem)}&background=random`}
                alt={`Avatar for ${emailItem}`}
              />
              <span className="text-sm font-medium">{emailItem}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )}
    <div className="mt-4">
      {emails.length > 0 ? (
        emails.map((emailItem, index) => (
          <Chip
            key={index}
            onClose={() => handleRemoveEmail(emailItem)}
            variant="flat"
            className="m-1"
          >
            {emailItem}
          </Chip>
        ))
      ) : (
        <p className="text-indigo-500/75">No emails to display.</p>
      )}
    </div>
  </div>
);

interface EmailTemplateProps {
  user: {
    email: string;
    name: string;
  };
  subject?: string;
  text?: string;
  isAITemplate?: boolean;
}

const EmailSchedule = () => {
  const { t } = useTranslation('api');
  const MAX_WORDS = 255;
  const options = [
    { key: "one", value: "One Email" },
    { key: "multiple", value: "Multiple Emails" },
    { key: "members", value: "All Members" },
  ];

  const templates = [
    { key: "welcome", value: "Welcome Template" },
    { key: "subscription", value: "Subscription Reminder" },
    { key: "notification", value: "Notification Reminder" },
    { key: "ai", value: "Ask AI" },
  ];

  const [email, setEmail] = useState<string | null>(null);
  const [emails, setEmails] = useState([]);
  const [memberEmails, setMemberEmails] = useState([]);
  const [time, setTime] = useState(new Time(11, 45));
  const [selectedOption, setSelectedOption] = useState("one");
  const [selectedTemplate, setSelectedTemplate] = useState("welcome");
  const [_isPromptValid, _setIsPromptValid] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resData, setResData] = useState<string>(undefined);
  const [emailSubject, setEmailSubject] = useState<string | null>(null);
  const [emailText, setEmailText] = useState<string | null>(null);
  const { locale } = useLocale();
  const defaultDate = today(getLocalTimeZone());
  const [date, setDate] = useState(defaultDate);
  const setInputContext = useStore((state) => state.setInputContext);
  const setInputModel = useStore((state) => state.setInputModel);
  const { activeOrg } = useMyspaceContext();
  const { aiContext, aiModel, showWarning, warningType, setWarningType, nextTimeUsage, setAiContext, setAiModel, setInputType, setOutputType, setShowWarning, setNextTimeUsage } = useGeneralContext();
  const { handleAIDynamicFunc } = useDynamicSubmit({ prompt: prompt, setIsLoading: setIsLoading, setResData: setResData, setError: setError, setEmailSubject: setEmailSubject, setEmailText: setEmailText, setShowWarning: setShowWarning, setWarningType: setWarningType, setNextTimeUsage: setNextTimeUsage });

  const wordCount = (text) => {
    if(!text) return null;
    return text.trim().split(/\s+/).length;
  };

  const isPromptValid = (text) => {
    if(!text) return null;
    return wordCount(text) <= MAX_WORDS;
  };

  const handleSetup = useCallback(() => {
    setAiContext("email");
    setInputContext("general");
    setAiModel("openAI");
    setInputModel("gpt-3.5-turbo");
    setInputType("text-only");
    setOutputType("text");
  }, [setAiContext, setAiModel, setInputContext, setInputModel, setInputType, setOutputType]);

  const handleAIGenerate = useCallback(() => {
    handleSetup();
    if (aiContext === "email" && prompt && !isLoading) {
      try {
        setIsLoading(true);
        handleAIDynamicFunc();
      } catch (error) {
        console.error("Error generating image:", error);
        toast.error("Failed to generate image. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  }, [aiContext, isLoading, prompt, setIsLoading, handleSetup, handleAIDynamicFunc]);

  const handleAddMemberEmails = async () => {
    if (!activeOrg?.orgId) {
      toast.error('No organization selected');
      return;
    }
    try {
      const response = await fetch('/api/get_memberships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ organizationId: activeOrg.orgId }),
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

  const handleAddEmail = (newEmail) => {
    if (newEmail && isValidEmail(newEmail) && !emails.includes(newEmail)) {
      setEmails([...emails, newEmail]);
      setEmail('');
    } else {
      toast.error("Please enter a valid email address.");
    }
  };

  const handleEmailPrompt = useCallback((value) => {
    const isValid = isPromptValid(value);
    _setIsPromptValid(isValid);
    
    if (isValid) {
      setPrompt(value);
    } else {
      toast.error("Please enter a valid prompt.");
    }
  }, [setPrompt, _setIsPromptValid]);

  const handleReset = () => {
    setSelectedOption("one");
    setSelectedTemplate("welcome");
    setPrompt('');
    setEmail('');
    setEmails([]);
  };

  const handleRegenerate = () => {
    setResData(undefined);
  };

  const handleRemoveAllEmails = () => {
    setEmails([]);
  };

  const handleRemoveEmail = (emailToRemove) => {
    setEmails(emails.filter(email => email !== emailToRemove));
  };

  const handleSelectionChange = (e) => {
    e.preventDefault();
    const option = e.target.value;
    setSelectedOption(option);
    handleRemoveAllEmails();
    if (option === "members") {
      handleAddMemberEmails();
    }
  };

  const handleTemplateChange = (e) => {
    const option = e.target.value;
    setSelectedTemplate(option);
    if (option === "ai") {
      setResData(undefined);
    }
  };

  const requestScheduleEmail = async (cronExpression, template) => {
    try {
      const response = await fetch('/api/send_email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cronExpression, template }),
      });
      if (!response.ok) {
        throw new Error('Failed to schedule email');
      }
      toast.success('Email scheduled successfully');
    } catch (error) {
      toast.error('Error scheduling email');
    }
  };

  const generateEmailTemplate = () => {
    const user = { email: "john@gmail.com", name: "john@gmail.com" };
    const props = { nextBillingDate: "Fri Jun 28th, 2024" };
    switch (selectedTemplate) {
      case 'welcome': {
        const template = WELCOMETEMPLATE({ user });
        return <Template subject={template.subject} text={template.text} />;
      }
      case 'subscription': {
        const template = SUBSCRIPTIONREMINDERTEMPLATE({ user, props });
        return <Template subject={template.subject} text={template.text} />;
      }
      case 'notification': {
        const template = NOTIFICATIONREMINDERTEMPLATE({ user, props });
        return <Template subject={template.subject} text={template.text} />;
      }
      case 'ai': {
        return <Template subject={emailSubject} text={emailText} isAITemplate={true} />;
      }
      default: {
        const template = WELCOMETEMPLATE({ user });
        return <Template subject={template.subject} text={template.text} />;
      }
    }
  };

  const handleScheduleEmail = async (e) => {
    e.preventDefault();
    if (selectedOption === 'one' && !isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if ((selectedOption === 'multiple' || selectedOption === 'members') && emails.length === 0) {
      toast.error("Please add at least one email address.");
      return;
    }
    const cronExpression = `${time.minute} ${time.hour} ${date.day} ${date.month} *`;
  
    try {
      switch (selectedOption) {
        case 'one':
          const template = { to: email, subject: emailSubject, text: emailText };
          requestScheduleEmail(cronExpression, template);
          break;
        case 'multiple':
          emails.forEach((email) => {
            const template = { to: email, subject: emailSubject, text: emailText };
            requestScheduleEmail(cronExpression, template);
          });
        case 'members':
          await Promise.all(emails.map((email) => {
            const template = { to: email.email, subject: emailSubject, text: emailText };
            requestScheduleEmail(cronExpression, template);
          }));
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error scheduling emails:', error);
      toast.error('Failed to schedule emails. Please try again.');
    } finally {
      handleReset();
    }
  };

  const Template = ({ isAITemplate, subject, text }: EmailTemplateProps) => {
    if (!subject || !text) return;
    setEmailSubject(subject);
    setEmailText(text);
    return (
      <Container maxWidth="md">
        <Textarea
          label="Subject:"
          description="Adjust the subject as per your requirement."
          fullWidth
          variant="faded"
          className="p-2"
          margin="normal"
          value={subject}
          onValueChange={(value) => {
            setEmailSubject(value);
          }}
          classNames={{
            base: "dark:text-gray-50/75",
            label: "text-violet-500 font-semibold text-lg",
          }}
          required
        />
        <Textarea
          label="Content:"
          description="Adjust the content as per your requirement."
          fullWidth
          variant="faded"
          margin="normal"
          className="p-2"
          value={text}
          onValueChange={(value) => {
            setEmailText(value);
          }}
          classNames={{
            base: "dark:text-gray-50/75",
            label: "text-violet-500 font-semibold text-lg",
          }}
          required
        />
        {isAITemplate && 
          <Button className="bg-black text-white p-4 mt-4" onClick={handleRegenerate} fullWidth>
            Ask Again
          </Button>
        }
      </Container>
    );
  };

  const PreviewTemplate = () => {
    return (
      <Container className="flex items-center justify-center rounded-md border w-full mt-6 p-4" maxWidth="md">
        <Typography className="bold text-center text-indigo-700 p-2" variant="h5" gutterBottom>
          Template Preview
        </Typography>
        {generateEmailTemplate()}
      </Container>
    );
  };

  const CustomRadio = (props) => {
    const { children, ...otherProps } = props;
    return (
      <Radio
        {...otherProps}
        classNames={{
          base: cn(
            "flex-none m-0 h-8 bg-content1 hover:bg-content2 items-center justify-between",
            "cursor-pointer rounded-full border-2 border-default-200/60",
            "data-[selected=true]:border-primary",
          ),
          label: "text-tiny text-default-500",
          labelWrapper: "px-1 m-0",
          wrapper: "hidden",
        }}
      >
        {children}
      </Radio>
    );
  };

  const CalendarPicker = () => (
    <div className="flex flex-col gap-4 mt-10">
      <Calendar
        aria-label="Date (Presets)"
        bottomContent={
          <RadioGroup
            aria-label="Date precision"
            classNames={{
              base: "w-full pb-2",
              wrapper: "-my-2.5 py-2.5 px-3 gap-1 flex-nowrap w-full overflow-x-scroll",
            }}
            defaultValue="exact_dates"
            orientation="horizontal"
          >
            <CustomRadio value="exact_dates">Exact dates</CustomRadio>
            <CustomRadio value="1_day">1 day</CustomRadio>
            <CustomRadio value="2_days">2 days</CustomRadio>
            <CustomRadio value="3_days">3 days</CustomRadio>
            <CustomRadio value="7_days">7 days</CustomRadio>
            <CustomRadio value="14_days">14 days</CustomRadio>
          </RadioGroup>
        }
        classNames={{
          content: "w-full",
        }}
        nextButtonProps={{
          variant: "bordered",
        }}
        prevButtonProps={{
          variant: "bordered",
        }}
        topContent={
          <ButtonGroup
            fullWidth
            className="px-3 pb-2 pt-3 bg-content1 [&>button]:text-default-500 [&>button]:border-default-200/60"
            radius="full"
            size="sm"
            variant="bordered"
          >
            <Button onPress={() => setDate(now)}>Today</Button>
            <Button onPress={() => setDate(nextWeek)}>Next week</Button>
            <Button onPress={() => setDate(nextMonth)}>Next month</Button>
          </ButtonGroup>
        }
        value={date}
        onChange={setDate}
        onFocusChange={setDate}
      />
    </div>
  );

  return (
    <Container maxWidth="lg" className="max-h-[400px] overflow-y-auto">
      <Typography variant="h4" align="center" gutterBottom>
        SCHEDULE EMAIL
      </Typography>
      <Grid className="pt-4" container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl className="w-full inline-flex shadow-sm tap-highlight-transparent bg-default-100 data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 rounded-medium flex-col items-start justify-center gap-0 outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 h-14 min-h-14 px-3 py-2">
            <InputLabel htmlFor="grouped-native-select">Recipients</InputLabel>
            <Select onChange={handleSelectionChange} native defaultValue="" id="grouped-native-select" className="w-full dark:text-gray-50/75" label="Grouping">
              {options.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.value}
                </option>
              ))}
            </Select>
          </FormControl>         
          {selectedOption === "one" &&
            <Input
              label="Email Address"
              radius="lg"
              type="email"
              value={email}
              isInvalid={!isValidEmail(email) && email !== ''}
              errorMessage={!isValidEmail(email) && email !== '' ? "Please enter a valid email" : ""}
              required
              onChange={(e) => setEmail(e.target.value)}
              classNames={{
                label: "relative mt-4 text-black/50 dark:text-white/90",
                input: [
                  "ml-4 p-1",
                  "bg-transparent",
                  "text-black/90 dark:text-white/90",
                  "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                ],
                innerWrapper: "bg-transparent",
                inputWrapper: [
                  "h-full mt-4 w-full",
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
                clearButton: [
                  "bottom-4 mr-1",
                ],
              }}
              placeholder="Enter Email"
              startContent={
                <Mail className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
              }
              endContent={
                email && (
                  <button
                    className="absolute right-4 bottom-4 flex items-center justify-center rounded-full w-4 h-4 bg-slate-200 hover:bg-slate-400"
                    onClick={() => setEmail('')}
                    type="button"
                  >
                    <X className="w-3 h-3 text-gray-800 cursor-pointer" />
                  </button>
                )
              }
            />
          }
         {(selectedOption === "multiple" || selectedOption === "members") && (
            <MultipleSelector
              selectedOption={selectedOption}
              memberEmails={memberEmails}
              handleAddEmail={handleAddEmail}
              handleRemoveEmail={handleRemoveEmail}
              emails={emails}
              setEmails={setEmails}
              email={email}
              setEmail={setEmail}
            />
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <RadioGroup
            aria-label="Select Template"
            value={selectedTemplate}
            onChange={handleTemplateChange}
          >
            {templates.map((template) => (
              <CustomRadio key={template.key} value={template.key}>
                {template.value}
              </CustomRadio>
            ))}
          </RadioGroup>
        </Grid>
      </Grid>
      {selectedTemplate === "ai" ? (
        !resData ? (
          <Container className="flex items-center justify-center rounded-md border w-full mt-6 p-4" maxWidth="md">
            <Typography className="bold text-center text-indigo-700 p-2" variant="h5" gutterBottom>
              Generate Email
            </Typography>
            <Textarea
              variant="faded"
              labelPlacement="outside"
              placeholder="Describe the template email"
              value={prompt}
              description="Enter a concise description of email template (max 255 words)."
              onChange={(e) => {
                handleEmailPrompt(e.target.value);
              }}
              required
              error={!isPromptValid(prompt) && prompt !== ''}
              helperText={!isPromptValid(prompt) && prompt !== '' ? `Prompt exceeds ${MAX_WORDS} words limit` : ''}
              classNames={{
                input: "resize-y",
                inputWrapper: [
                  "w-full h-full mt-4",
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
                description: [
                  "pt-2",
                ],
              }}
              startContent={
                <div>
                  {prompt && (
                    <button
                      className="absolute right-4 top-2 flex items-center justify-center rounded-full w-4 h-4 bg-slate-200 hover:bg-slate-400"
                      onClick={() => {
                        setPrompt('');
                        _setIsPromptValid(true);
                      }}
                      type="button"
                    >
                      <X className="w-3 h-3 text-gray-800 cursor-pointer" />
                    </button>
                  )}
                </div>
              }
              endContent={
                <div className="absolute right-8 bottom-1 flex items-center">
                  <span className={`text-tiny ${isPromptValid(prompt) ? 'text-default-400' : 'text-danger'}`}>
                    {wordCount(prompt)}/{MAX_WORDS}
                  </span>
                </div>
              }
            />
            <Button className="bg-black text-white p-4 mt-4" disabled={isLoading} onClick={handleAIGenerate} fullWidth>
              {isLoading ? <AILoadingSpinner /> : 'Generate'}
            </Button>
          </Container>
        ) : (
          <PreviewTemplate />
        )
      ) : (
        <PreviewTemplate />
      )}
      <CalendarPicker />
      <div className="flex flex-col justify-center items-center p-4">
        <TimeInput
          label="Event Time"
          onChange={setTime}
          defaultValue={new Time(11, 45)}
        />
        <Button type="button" className="w-1/2 relative mt-6 p-4" color="primary" onClick={handleScheduleEmail}>Schedule Email</Button>
      </div>
      {showWarning && (
        <Warning
          type={warningType}
          nextTimeUsage={nextTimeUsage}
        />
      )}
    </Container>
  );
};

export default EmailSchedule;

