// This file guarantees site search uses the public ClearInput without demo controls.
import type { Ref } from "react";
import ClearInput from "./library/components/clear-input";

export function SiteSearch({
  value,
  onValueChange,
  label,
  placeholder = "Search",
  inputRef,
  className = "",
}: {
  value: string;
  onValueChange: (value: string) => void;
  label: string;
  placeholder?: string;
  inputRef?: Ref<HTMLInputElement>;
  className?: string;
}) {
  return (
    <ClearInput
      value={value}
      onValueChange={onValueChange}
      showReset={false}
      clearLabel="Clear search"
      inputProps={{
        type: "search",
        "aria-label": label,
        placeholder,
        ref: inputRef,
      }}
      className={`site-search ${className}`}
    />
  );
}
