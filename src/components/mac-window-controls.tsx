type MacWindowControlsProps = {
  className?: string;
};

export function MacWindowControls({ className = "" }: MacWindowControlsProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`} aria-hidden="true">
      <span className="h-3 w-3 rounded-full border border-[#e0443e] bg-[#ff5f57] shadow-inner" />
      <span className="h-3 w-3 rounded-full border border-[#d79a20] bg-[#febc2e] shadow-inner" />
      <span className="h-3 w-3 rounded-full border border-[#24a148] bg-[#28c840] shadow-inner" />
    </div>
  );
}
