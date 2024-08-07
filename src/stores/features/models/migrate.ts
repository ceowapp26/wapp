import { v4 as uuidv4 } from 'uuid';
import {
  LocalStorageInterfaceV0ToV1,
  LocalStorageInterfaceV1ToV2,
} from '@/types/ai';
import {
  _defaultAIConfig,
  _defaultModel,
} from '@/constants/ai';

export const migrateV0 = (persistedState: LocalStorageInterfaceV0ToV1) => {
  persistedState.countTotalTokens = true;
};

export const migrateV1 = (persistedState: LocalStorageInterfaceV1ToV2) => {
  persistedState.autoAdjustToken = false;
  persistedState.tokenShortage = false;
};

