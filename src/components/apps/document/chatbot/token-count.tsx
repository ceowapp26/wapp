import React, { useEffect, useMemo, useState } from 'react';
import { useDocumentStore } from '@/stores/features/apps/document/store';
import { shallow } from 'zustand/shallow';
import { getCountTokensFunc, determineModel } from '@/utils/aiUtils';
import { modelCost } from '@/constants/ai';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDollarSign, FiCpu } from 'react-icons/fi';

const TokenCount = React.memo(() => {
  const [tokenCount, setTokenCount] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const generating = useDocumentStore((state) => state.generating);
  const messages = useDocumentStore(
    (state) =>
      state.chats ? state.chats[state.currentChatIndex].messages : [],
    shallow
  );
  const model = useDocumentStore((state) => state.chatModel);

  const cost = useMemo(() => {
    const price =
      modelCost[model].inputTokens.price *
      (tokenCount / modelCost[model].inputTokens.unit);
    return price.toFixed(4);
  }, [model, tokenCount]);

  useEffect(() => {
    if (!generating) {
      const _inputType = "text-only";
      const _outputType = "text";
      const _inputImage = null;
      const _tokenUsed = getCountTokensFunc(determineModel(model), messages, model, _inputType, _outputType, _inputImage);
      setTokenCount(_tokenUsed);
    }
  }, [messages, generating, model]);

  return (
    <motion.div
      className="fixed top-4 right-4 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center space-x-2">
          <FiCpu className="text-blue-500 dark:text-blue-400" />
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            {tokenCount.toLocaleString()}
          </span>
        </div>
      </motion.div>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            className="mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Model:</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{model}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Tokens:</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{tokenCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Cost:</span>
                <div className="flex items-center space-x-1">
                  <FiDollarSign className="text-green-500" />
                  <span className="font-medium text-gray-800 dark:text-gray-200">{cost}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default TokenCount;