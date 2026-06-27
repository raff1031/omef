const styles = {
  green: {
    wrapper: "bg-green-100 text-green-800 border border-green-200",
    dot: "bg-green-500",
  },
  amber: {
    wrapper: "bg-amber-100 text-amber-800 border border-amber-200",
    dot: "bg-amber-500",
  },
  red: {
    wrapper: "bg-red-100 text-red-800 border border-red-200",
    dot: "bg-red-500",
  },
};

const sizes = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-3 py-1",
};

export default function StatusBadge({ status = "green", label, size = "md" }) {
  const { wrapper, dot } = styles[status] ?? styles.green;
  const sizeClass = sizes[size] ?? sizes.md;

  return (
    <span
      className={[
        "rounded-full font-medium inline-flex items-center gap-1",
        wrapper,
        sizeClass,
      ].join(" ")}
    >
      <span className={["rounded-full flex-shrink-0", dot, size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"].join(" ")} />
      {label}
    </span>
  );
}
