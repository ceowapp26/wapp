import { CloudModelConfigInterface } from "@/types/ai"; 

export function isValidConfig(config: any): config is CloudModelConfigInterface {
  return (
    typeof config === "object" &&
    typeof config.model === "string" &&
    typeof config.base_RPM === "number" && config.base_RPM > 0 &&
    typeof config.base_RPD === "number" && config.base_RPD > 0 &&
    typeof config.base_TPM === "number" && config.base_TPM > 0 &&
    typeof config.base_TPD === "number" && config.base_TPD > 0 &&
    typeof config.max_RPM === "number" &&
    typeof config.ceiling_RPM === "number" &&
    typeof config.floor_RPM === "number" &&
    typeof config.max_inputTokens === "number" &&
    typeof config.ceiling_inputTokens === "number" &&
    typeof config.floor_inputTokens === "number" &&
    typeof config.avg_inputTokens === "number" &&
    typeof config.max_outputTokens === "number" &&
    typeof config.ceiling_outputTokens === "number" &&
    typeof config.floor_outputTokens === "number" &&
    typeof config.avg_outputTokens === "number" &&
    (typeof config.temperature === "number" || typeof config.temperature === "undefined") &&
    (typeof config.presence_penalty === "number" || typeof config.presence_penalty === "undefined") &&
    (typeof config.top_p === "number" || typeof config.top_p === "undefined") &&
    (typeof config.frequency_penalty === "number" || typeof config.frequency_penalty === "undefined")
  );
}
