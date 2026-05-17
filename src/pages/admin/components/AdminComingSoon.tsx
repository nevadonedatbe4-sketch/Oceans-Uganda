interface AdminComingSoonProps {
  title: string;
  description: string;
  icon: string;
  phase: string;
  features: string[];
}

export default function AdminComingSoon({ title, description, icon, phase, features }: AdminComingSoonProps) {
  return (
    <div className="max-w-[640px] mx-auto pt-8">
      <div className="bg-white rounded-lg border border-gray-100 p-10 text-center">
        <div className="w-16 h-16 rounded-xl bg-primary/6 flex items-center justify-center mx-auto mb-5">
          <i className={`${icon} text-3xl text-primary/40`} />
        </div>
        <span className="inline-block px-3 py-1 bg-golden/10 text-golden text-xs font-roboto font-medium rounded-full mb-3">
          Coming in {phase}
        </span>
        <h2 className="text-primary font-jost font-bold text-2xl mb-2">{title}</h2>
        <p className="text-[#7a7a7a] font-roboto text-sm leading-relaxed mb-6">{description}</p>
        <div className="text-left border border-gray-100 rounded-lg p-4 mb-6">
          <p className="text-xs font-roboto font-semibold text-primary/60 uppercase tracking-wide mb-3">Planned Features</p>
          <ul className="space-y-2">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm font-roboto text-primary/70">
                <span className="w-4 h-4 flex items-center justify-center shrink-0">
                  <i className="ri-checkbox-circle-line text-golden text-base" />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-gray-400 font-roboto">
          Complete the current phase first, then we&apos;ll build this module next.
        </p>
      </div>
    </div>
  );
}
