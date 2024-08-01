import React from 'react';
import styled from "@emotion/styled";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { checkJsonFormat } from "@/utils/checkJsonFormat";
import { AIFallbackView } from "./ai-fallback-view";
import { toast } from "sonner";
import { FormattedData } from "@/types/aiResponse";

const StyleWrapper = styled.div`
  font-family: 'Inter', sans-serif;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
  }
`;

const DashboardHeader = styled.div`
  background-color: #f3f4f6;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
`;

const MainTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

const ContentSection = styled.div`
  padding: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
`;

const Summary = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #4b5563;
  margin-bottom: 1.5rem;
`;

const KeywordSection = styled.div`
  margin-bottom: 2rem;
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 1.5rem;
`;

const StyledTable = styled(Table)`
  --nextui-colors-border: #e5e7eb;

  .nextui-table-container {
    border-radius: 8px;
    overflow: hidden;
  }

  .nextui-table-header-column {
    background-color: #f3f4f6;
    font-weight: 600;
  }

  .nextui-table-cell {
    padding: 1rem;
  }
`;

const AIDashboardNodeView = ({ data }: any) => {
  let formattedData: FormattedData | null = null;
  try {
    const parsedData = JSON.parse(data);
    if (checkJsonFormat(parsedData)) {
      formattedData = parsedData;
    }
  } catch (error) {
    console.error("Error parsing data:", error);
  }

  if (!formattedData) {
    return <AIFallbackView data={data} />;
  }

  if (!data) {
    return <AIFallbackView data={"There is no available data"} />;
  }

  return (
    <StyleWrapper>
      <DashboardHeader>
        <MainTitle>{formattedData.mainKeyword} Dashboard</MainTitle>
      </DashboardHeader>
      <ContentSection>
        <SectionTitle>Main Summary</SectionTitle>
        <Summary>{formattedData.summary}</Summary>
        <Summary>{formattedData.textSpan}</Summary>

        {formattedData.associatedKeywords.map((associatedKeyword) => (
          <KeywordSection key={associatedKeyword.keyword}>
            <SectionTitle>{associatedKeyword.keyword}</SectionTitle>
            <StyledTable aria-label="Associated Keywords Table" striped>
              <TableHeader>
                <TableColumn>Keyword</TableColumn>
                <TableColumn>Summary</TableColumn>
                <TableColumn>Text Span</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow key={associatedKeyword.keyword}>
                  <TableCell>{associatedKeyword.keyword}</TableCell>
                  <TableCell>{associatedKeyword.summary}</TableCell>
                  <TableCell>{associatedKeyword.textSpan}</TableCell>
                </TableRow>
                {associatedKeyword.subKeywords && associatedKeyword.subKeywords.length > 0 && (
                  associatedKeyword.subKeywords.map((subKeyword) => (
                    <TableRow key={subKeyword.keyword}>
                      <TableCell>{subKeyword.keyword}</TableCell>
                      <TableCell>{subKeyword.summary}</TableCell>
                      <TableCell>{subKeyword.textSpan}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </StyledTable>
          </KeywordSection>
        ))}
      </ContentSection>
    </StyleWrapper>
  );
};

AIDashboardNodeView.displayName = "AIDashboardNodeView";

export { AIDashboardNodeView };