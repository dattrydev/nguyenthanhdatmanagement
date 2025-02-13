import React from "react";

export type TableFilterConfig = {
    label: string;
    key: string;
    type: "text" | "select" | "date" | "number" | "multi-select";
    options?: { label: string; value: string }[];
    defaultValue?: string;
    placeholder?: string;
    className?: string;
    style?: React.CSSProperties;
    onChange?: (value: string) => void;
    onClear?: () => void;
    onSearch?: (value: string) => void;
    onFilter?: (value: string) => void;
    onSort?: (value: string) => void;
    onDateChange?: (value: string) => void;
    onNumberChange?: (value: string) => void;
}

export const getTableFilterConfig = (
    filters: {
        key: string;
        label?: string;
        type?: TableFilterConfig["type"];
        options?: { label: string; value: string }[];
        defaultValue?: string;
        onChange?: (value: string) => void;
        onClear?: () => void;
        onSearch?: (value: string) => void;
        onFilter?: (value: string) => void;
        onSort?: (value: string) => void;
        onDateChange?: (value: string) => void;
        onNumberChange?: (value: string) => void;
    }[]
): TableFilterConfig[] => {
    return filters.map(({key, label, type = "text", options, defaultValue, ...callbacks}) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        key,
        type,
        options: options || undefined,
        defaultValue,
        placeholder: `Search ${label ?? key}`,
        className: "w-full",
        style: {},
        ...callbacks,
    }));
};
