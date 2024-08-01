import { SubKeyword, AssociatedKeyword, FormattedData } from "@/types/aiReponse";

export const checkJsonFormat = (data: any): data is FormattedData => {
  const isSubKeywordValid = (subKeyword: any): subKeyword is SubKeyword =>
    typeof subKeyword.keyword === 'string' &&
    typeof subKeyword.summary === 'string' &&
    typeof subKeyword.textSpan === 'string' &&
    (subKeyword.subKeywords === undefined || 
      (Array.isArray(subKeyword.subKeywords) && subKeyword.subKeywords.every(isSubKeywordValid))
    );

  const isAssociatedKeywordValid = (keyword: any): keyword is AssociatedKeyword =>
    typeof keyword.keyword === 'string' &&
    typeof keyword.summary === 'string' &&
    typeof keyword.textSpan === 'string' &&
    (keyword.subKeywords === undefined || 
      (Array.isArray(keyword.subKeywords) && keyword.subKeywords.every(isSubKeywordValid))
    );

  return (
    typeof data === 'object' &&
    typeof data.mainKeyword === 'string' &&
    typeof data.summary === 'string' &&
    typeof data.textSpan === 'string' &&
    Array.isArray(data.associatedKeywords) &&
    data.associatedKeywords.every(isAssociatedKeywordValid)
  );
};



