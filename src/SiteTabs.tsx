// This file guarantees site selections use the same public SlidingTabs as distributed demos.
import SlidingTabs from "./library/components/sliding-tabs";

export function SiteTabs<Value extends string>({
  items,
  value,
  onValueChange,
  label,
  panelId,
  tabIdPrefix,
  className = "",
  labels,
}: {
  items: readonly Value[];
  value: Value;
  onValueChange: (value: Value) => void;
  label: string;
  panelId?: string;
  tabIdPrefix?: string;
  className?: string;
  labels?: readonly string[];
}) {
  return (
    <SlidingTabs<number>
      items={labels ?? items}
      value={Math.max(0, items.indexOf(value))}
      onValueChange={(index) => onValueChange(items[index])}
      tablistLabel={label}
      panelId={panelId}
      tabIdPrefix={tabIdPrefix}
      className={`site-tabs ${className}`}
    />
  );
}
