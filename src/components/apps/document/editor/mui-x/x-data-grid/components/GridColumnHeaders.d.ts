import * as React from 'react';
import { UseGridColumnHeadersProps } from '../hooks/features/columnHeaders/useGridColumnHeaders';
interface DataGridColumnHeadersProps extends React.HTMLAttributes<HTMLDivElement>, UseGridColumnHeadersProps {
}
declare const GridColumnHeaders: React.ForwardRefExoticComponent<DataGridColumnHeadersProps & React.RefAttributes<HTMLDivElement>>;
export { GridColumnHeaders };
