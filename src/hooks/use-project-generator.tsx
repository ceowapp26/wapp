import React, { useCallback, useRef } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { limitMessageTokens, updateTotalTokenUsed, updateTimeLimitTokenUsed, determineModel } from '@/utils/aiUtils';
import { useToken } from './use-token';
import { useCompletion } from 'ai/react';
import { usePortalStore } from '@/stores/features/apps/portal/store';
import { useModelStore } from '@/stores/features/models/store';
import { useGeneralContext } from '@/context/general-context-provider';
import { usePortalContext } from '@/context/portal-context-provider';
import { projectAPIEndpointOptions } from "@/constants/ai";
import { getAPIEndpoint } from "@/utils/aiUtils";
import { validateProjectStructure } from "@/utils/codeUtils";
import { ProjectConfigs } from '@/types/code';
import { MessageInterface } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/navigation";

export type Context = "general" | "selection" | "page" | "q&a";

const convertToMessageInterface = (
  role: string,
  command: string,
  content: string,
  context: Context,
  model: ModelOption
): MessageInterface => ({
  role,
  command,
  content,
  context,
  model,
});

interface useProjectGeneratorProps {
  generating: boolean;
  setGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const useProjectGenerator = ({
  generating,
  setGenerating,
  error,
  setError,
}: useProjectGeneratorProps) => {
  const chatModel = usePortalStore((state) => state.chatModel);
  const chatContext = usePortalStore((state) => state.chatContext);
  const countTotalTokens = useModelStore((state) => state.countTotalTokens);
  const { contextContent, inputType, outputType, setShowWarning, setWarningType, setNextTimeUsage } = useGeneralContext();
  const { checkTokenUsage, updateTokenUsage } = useToken();
  const updateModel = useMutation(api.models.updateModel);
  const createProject = useMutation(api.codes.createProject);
  const models = useQuery(api.models.getAllModels);
  const router = useRouter();
  const currentUser = useQuery(api.users.getCurrentUser);
  const promptMessageRef = useRef<MessageInterface | null>(null);
  const outputMessageRef = useRef<string | null>(null);
  const claude_input_tokens = useRef(0);
  const claude_output_tokens = useRef(0);

  const onCreateProject = async (projectConfigs: ProjectConfigs, projectStructure: ProjectStructure) => {
    const projectInfo = {
      projectId: uuidv4(), 
      projectName: projectConfigs.general.projectName,
      version: projectConfigs.general.version,
      description: projectConfigs.general.description,
      development: {
        language: projectConfigs.development.language,
        framework: projectConfigs.development.framework,
        buildTool: projectConfigs.development.buildTool,
        packageManager: projectConfigs.development.packageManager,
      },
      testing: {
        framework: projectConfigs.testing.framework,
        e2eFramework: projectConfigs.testing.e2eFramework,
      },
      database: {
        type: projectConfigs.database.type,
        name: projectConfigs.database.name,
        orm: projectConfigs.database.orm,
      },
      deployment: {
        platform: projectConfigs.deployment.platform,
        cicdTool: projectConfigs.deployment.cicdTool,
        containerization: projectConfigs.deployment.containerization,
      },
      security: {
        authentication: projectConfigs.security.authentication,
        authorization: projectConfigs.security.authorization,
        dataEncryption: projectConfigs.security.dataEncryption,
      },
      performance: {
        caching: projectConfigs.performance.caching,
        cdn: projectConfigs.performance.cdn,
      },
      structure: projectStructure,
      metadata: {
        developers: projectConfigs.metadata.developers,
        creationDate: projectConfigs.metadata.creationDate,
        lastModifiedDate: projectConfigs.metadata.lastModifiedDate,
        status: projectConfigs.metadata.status,
        license: projectConfigs.metadata.license,
      },
    };

    const promise = createProject({ projectInfo })
      .then((projectId) => {
        router.prefetch(`/myspace/apps/portal/code/${projectId}`);
        router.push(`/myspace/apps/portal/code/${projectId}`);
        return projectId;
      });

    toast.promise(promise, {
      loading: "Creating a new project...",
      success: "New project created!",
      error: "Failed to create a new project."
    });

    return promise;
  };

  const { complete, stop } = useCompletion({
    api: getAPIEndpoint(projectAPIEndpointOptions, chatModel),
    onResponse: async (response) => {
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          console.error("Error parsing JSON:", e);
          errorData = { error: "An unexpected error occurred", status: response.status };
        }
        setError(errorData.error);
        handleErrorResponse(response.status, errorData);
        return null;
      }
      return response;
    },
    onFinish: (prompt, completion) => {
      outputMessageRef.current = completion;
      setGenerating(false);
    },
    onError: (e) => {
      setError(e.message);
      toast.error(e.message);
    },
  });

  const handleErrorResponse = (status: number, errorData: any) => {
    switch (status) {
      case 429:
        setShowWarning?.(true);
        setWarningType?.('CURRENT');
        setNextTimeUsage?.(errorData.nextAllowedTime);
        break;
      case 403:
        if (errorData.error === "Unsupported region") {
          setShowWarning?.(true);
          setWarningType?.('UNSUPPORTED');
        } else {
          toast.error(errorData.error);
        }
        break;
      default:
        toast.error(errorData.error);
    }
  };

  const handleSubmit = useCallback(async (prompt: string, output: ProjectStructure, projectConfigs: projectConfigs) => {
    if (generating || !chatContext || !chatModel) {
      console.warn("Chat context or model is missing, or generating is true.");
      return;
    }
    const inputModelData = models?.find((model) => model.model === chatModel);
    if (!inputModelData) {
      console.error('Input model data not found');
      return; 
    }
    setGenerating(true);
    try {
      const isInsufficientTokens = checkTokenUsage();
      if (isInsufficientTokens) return;            
      const _promptMessage: MessageInterface = convertToMessageInterface("user", "", prompt, chatContext, chatModel);
      promptMessageRef.current = _promptMessage;
      const messages = await limitMessageTokens([_promptMessage], inputModelData.max_tokens, chatModel, determineModel(chatModel), inputType, outputType);
      if (messages.length === 0) {
        toast.error('Message exceeds max token!');
        throw new Error('Message exceeds max token!');
      }
      const requestOption = {
        output: output,
        config: {
          model: chatModel,
          RPM: inputModelData.base_RPM + inputModelData.floor_RPM,
          RPD: inputModelData.base_RPD + inputModelData.floor_RPD,
          max_tokens: inputModelData.max_tokens,
        },
      };
      const completion = await complete(prompt, {
        body: requestOption,
      });
      if (!completion) {
        throw new Error('Failed to get completion');
      }
      const hasCompletion = completion.length > 0;
      if (hasCompletion && determineModel(chatModel) !== "claude") {
        console.log("this is validated structure", validateProjectStructure(completion, output))
        await onCreateProject(projectConfigs, validateProjectStructure(completion, output));
        return completion;
      } else {
        await onCreateProject(projectConfigs, validateProjectStructure(completion.content, output));
        claude_input_tokens.current = completion.usage.input_tokens;
        claude_output_tokens.current = completion.usage.output_tokens; 
        return completion;
      }
    } catch (e: unknown) {
      console.error("Error in POST request:", (e as Error).message);
    } finally {
      setGenerating(false);
      if (countTotalTokens && promptMessageRef.current && outputMessageRef.current) {
        await updateTotalTokenUsed({
          model: chatModel,
          promptMessages: [promptMessageRef.current],
          completionMessage: outputMessageRef.current,
          aiModel: determineModel(chatModel),
          inputType: inputType, 
          outputType: outputType,
          inputModelData: inputModelData,
          updateModel: updateModel,
          claude_input_tokens: claude_input_tokens.current | 0,
          claude_output_tokens: claude_output_tokens.current | 0,
        });
        await updateTimeLimitTokenUsed({
          model: chatModel,
          promptMessages: [promptMessageRef.current],
          completionMessage: outputMessageRef.current,
          aiModel: determineModel(chatModel),
          inputType: inputType, 
          outputType: outputType,
          inputModelData: inputModelData,
          updateModel: updateModel,
          claude_input_tokens: claude_input_tokens.current | 0,
          claude_output_tokens: claude_output_tokens.current | 0,
        });
        await updateTokenUsage();
      }
    }
  }, [chatModel, chatContext, setGenerating, setError, checkTokenUsage, updateTokenUsage, contextContent, inputType, outputType, models, countTotalTokens, determineModel, limitMessageTokens, updateTotalTokenUsed, updateTimeLimitTokenUsed, updateModel, generating]);

  const handleStop = () => {
    setGenerating(false);
  };

  return { handleSubmit, handleStop, error };
};