interface Props {
  icon: string;
  title: string;
  description: string;
  badge?: string;
}

export default function SectionHeader({ icon, title, description, badge }: Props) {
  return (
    <div className="flex items-start gap-4 pb-5 border-b border-stone-100 mb-6">
      <div className="w-10 h-10 flex items-center justify-center bg-[#1B4332]/10 rounded-lg shrink-0">
        <i className={`${icon} text-[#1B4332] text-lg`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-stone-800">{title}</h2>
          {badge && (
            <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-amber-100 text-amber-700 rounded-full">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-stone-500 mt-0.5">{description}</p>
      </div>
    </div>
  );
}
