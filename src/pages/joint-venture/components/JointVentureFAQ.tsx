import { useState } from 'react';

const FAQS = [
  {
    q: 'What exactly is a land joint venture?',
    a: 'A landowner contributes the land and an investor contributes capital for development. Instead of a straight sale, both sides agree how the finished value or income — plots, units, or rent — will be split.',
  },
  {
    q: 'How is a fair split usually structured?',
    a: 'Common structures include revenue share once units sell, an equity split in a project company, or a lease payment that converts into a share of the development. The right structure depends on land value versus development cost, which our team helps both sides work through before matching.',
  },
  {
    q: "Is my land title checked before it's listed?",
    a: 'Yes. Every landowner brief goes through a title verification step before it is shared with any investor, and title status is discussed upfront with every enquiry.',
  },
  {
    q: 'Does Oceans Uganda charge a fee?',
    a: 'Submitting a brief is free. A facilitation fee applies only once a joint venture or sale is concluded, agreed upfront with both parties before any introduction is made.',
  },
  {
    q: 'Can I just buy or sell land outright instead of a JV?',
    a: 'Yes — use the same forms above and select "outright sale" or "outright land purchase only". Our team will route your enquiry accordingly.',
  },
];

export default function JointVentureFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-golden text-xs font-roboto tracking-widest uppercase mb-3">Questions</p>
        <h2 className="text-3xl font-prata text-primary mb-8">Before You Submit a Brief</h2>

        <div>
          {FAQS.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={item.q} className="border-t border-stone-200 last:border-b">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left cursor-pointer"
                >
                  <span className="font-prata text-lg text-primary">{item.q}</span>
                  <i className={`ri-add-line text-golden text-xl shrink-0 transition-transform ${open ? 'rotate-45' : ''}`} />
                </button>
                {open && (
                  <p className="text-text-gray font-roboto text-sm leading-relaxed pb-5 max-w-2xl">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
