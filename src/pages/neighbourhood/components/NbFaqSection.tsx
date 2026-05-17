import { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

interface Props {
  faqs: FaqItem[];
  name: string;
}

export default function NbFaqSection({ faqs, name }: Props) {
  const [open, setOpen] = useState<number | null>(0);

  if (faqs.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-14">
      <div className="max-w-3xl mx-auto">
        <p className="text-[11px] font-roboto font-bold uppercase tracking-widest text-golden mb-2 text-center">Common Questions</p>
        <h2 className="font-prata text-primary text-2xl md:text-3xl mb-8 text-center">
          Frequently Asked About {name}
        </h2>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-stone-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer hover:bg-[#f5f5f5] transition-colors"
              >
                <span className="font-roboto text-sm font-semibold text-primary pr-4">{faq.question}</span>
                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                  <i className={`text-golden text-base transition-transform duration-200 ${open === i ? 'ri-subtract-line' : 'ri-add-line'}`} />
                </div>
              </button>
              {open === i && (
                <div className="px-5 pb-5 border-t border-stone-100">
                  <p className="text-stone-500 font-roboto text-sm leading-relaxed pt-4">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
