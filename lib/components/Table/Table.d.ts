import React, { ReactNode } from 'react';
declare type TableProps = {
    isSelectable?: boolean;
    displayCheckbox?: boolean;
    children?: ReactNode;
};
declare const Table: {
    ({ isSelectable, displayCheckbox, children, ...rest }: TableProps): JSX.Element;
    Header: React.ForwardRefExoticComponent<{
        children?: React.ReactNode;
    } & React.RefAttributes<HTMLTableSectionElement>>;
    HeaderCell: React.ForwardRefExoticComponent<{
        isSortable?: boolean | undefined;
        onDirectionChange?: ((direction: "none" | "ascending" | "descending") => void) | undefined;
        sortDirection?: "none" | "ascending" | "descending" | undefined;
        children?: React.ReactNode;
    } & React.RefAttributes<HTMLTableHeaderCellElement>>;
    Body: React.ForwardRefExoticComponent<{
        children?: React.ReactNode;
    } & React.RefAttributes<HTMLTableSectionElement>>;
    Row: React.ForwardRefExoticComponent<{
        children?: React.ReactNode;
        onSelectToggle?: ((isSelected: boolean) => void) | undefined;
        isSelected?: boolean | undefined;
        onClick?: ((event: React.SyntheticEvent<Element, Event>) => void) | undefined;
    } & React.RefAttributes<HTMLTableRowElement>>;
    Cell: React.ForwardRefExoticComponent<{
        children?: React.ReactNode;
    } & React.RefAttributes<HTMLTableCellElement>>;
    ActionCell: React.ForwardRefExoticComponent<{
        children?: React.ReactNode;
    } & React.RefAttributes<HTMLTableCellElement>>;
};
export { Table };
