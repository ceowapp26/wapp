"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Time } from "@internationalized/date";
import { Calendar, Radio, RadioGroup, ButtonGroup, cn, Input, Button, Select, SelectItem, TimeInput, Textarea } from "@nextui-org/react";
import { toast } from "sonner";
import { WELCOMETEMPLATE, SUBSCRIPTIONREMINDERTEMPLATE, NOTIFICATIONREMINDERTEMPLATE } from '@/constants/emailTemplates';
import { today, getLocalTimeZone, startOfWeek, startOfMonth } from "@internationalized/date";
import { useLocale } from "@react-aria/i18n";
import { Grid, Container, Typography } from '@mui/material';
import { Mail, X } from 'lucide-react';
import { GradientLoadingCircle } from "@/components/gradient-loading-circle";
import { useCompletion } from "ai/react";
import MagicIcon from "@/icons/MagicIcon";
import CrazySpinnerIcon from "@/icons/CrazySpinnerIcon";
import { useStore } from "@/redux/features/apps/document/store";
import { useGeneralContext } from '@/context/general-context-provider';
import { useDynamicSubmit } from "@/hooks/use-dynamic-submit";
import { useTranslation } from "react-i18next";
import Warning from '@/components/models/warning'; 

const AILoadingSpinner = () => (
  <div className="flex h-12 w-full justify-center items-center px-4 text-sm font-medium text-muted-foreground text-purple-500">
    <MagicIcon className="mr-2 h-4 w-4 shrink-0" />
      Generating Email
    <div className="ml-2 mt-1">
      <CrazySpinnerIcon />
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
}

const isValidEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const EmailGenerator = () => {
  const { t } = useTranslation('api');
  const MAX_WORDS = 255;

  const options = [
    { key: "one", value: "One Email" },
    { key: "multiple", value: "Multiple Emails" },
    { key: "users", value: "All Users" },
  ];

  const templates = [
    { key: "welcome", value: "Welcome Template" },
    { key: "subscription", value: "Subscription Reminder" },
    { key: "notification", value: "Notification Reminder" },
    { key: "ai", value: "Ask AI" },
  ];

  const [email, setEmail] = useState<string | null>(null);
  const [emails, setEmails] = useState([]);
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
  const allUsers = useQuery(api.users.getAllUsers);
  const { aiContext, aiModel, showWarning, warningType, nextTimeUsage, setAiContext, setAiModel, setInputType, setOutputType, setShowWarning, setWarningType, setNextTimeUsage } = useGeneralContext();
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
  }, [aiContext, isLoading, prompt, handleAIDynamicFunc, handleSetup]);

  const handleAddUserEmails = () => {
    if (allUsers && allUsers.length > 0) {
      const validEmails = allUsers
        .map(user => user.userInfo.email)
        .filter(email => isValidEmail(email));

      if (validEmails.length > 0) {
        setEmails(validEmails);
      } else {
        toast.error("No valid emails found in user list");
      }

      if (validEmails.length < allUsers.length) {
        toast.warning(`Skipped ${allUsers.length - validEmails.length} invalid email(s)`);
      }
    } else {
      toast.error("No users found");
    }
  };

  const handleAddEmail = () => {
    if (email && isValidEmail(email) && !emails.includes(email)) {
      setEmails([...emails, email]);
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
    const option = e.target.value;
    setSelectedOption(option);
    handleRemoveAllEmails();
    if ( option === "users") {
      handleAddUserEmails();
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
      <Container>
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
      <Container className="flex items-center justify-center rounded-md border w-full mt-6 p-4">
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
    <Container maxWidth="lg" className="p-4 overflow-y-auto">
      <Typography variant="h4" align="center" gutterBottom>
        SCHEDULE EMAIL
      </Typography>
      <Grid className="pt-4" container spacing={3}>
        <Grid item xs={12} md={6}>
          <Select
            label="Select Recipients"
            selectionMode="single"
            selectedKeys={[selectedOption]}
            onChange={handleSelectionChange}
            className="max-w-xs"
          >
            {options.map((option) => (
              <SelectItem key={option.key} value={option.key}>
                {option.value}
              </SelectItem>
            ))}
          </Select>
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
          {selectedOption === "multiple" && (
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
                    "h-full mt-4",
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
              <Button className="bg-slate-800 text-white mt-6" onClick={handleAddEmail}>Add Email</Button>
              <div className="mt-4">
                {emails.length > 0 ? (
                  emails.map((email, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-200 w-full rounded-full p-2 mb-2"
                    >
                      <span>{email}</span>
                      <button
                        onClick={() => handleRemoveEmail(email)}
                        className="flex items-center justify-center mr-2 p-1 rounded-full w-5 h-5 text-red-500 hover:bg-slate-400"
                      >
                        <X /> 
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-indigo-500/75">No emails to display.</p>
                )}
              </div>
            </div>
          )}
          {selectedOption === "members" && (
            <div className="mt-4">
              {emails.length > 0 ? (
                emails.map((email, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-200 w-full rounded-full p-2 mb-2"
                  >
                    <span>{email}</span>
                    <button
                      onClick={() => handleRemoveEmail(email)}
                      className="flex items-center justify-center mr-2 p-1 rounded-full w-5 h-5 text-red-500 hover:bg-slate-400"
                    >
                      <X /> 
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-indigo-500/75">No emails to display.</p>
              )}
            </div>
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
          <Container className="flex items-center justify-center rounded-md border w-full mt-6 p-4">
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
      <div className="flex flex-col justify-center items-center pt-4">
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

export default EmailGenerator;



