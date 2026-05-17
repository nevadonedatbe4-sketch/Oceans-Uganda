import { Link } from 'react-router-dom';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

function getCurrentDayIndex() {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}

function isCurrentlyOpen(weekdayHours: string, saturdayHours: string) {
  const now = new Date();
  const day = now.getDay();
  const h = now.getHours();
  const m = now.getMinutes();
  const total = h * 60 + m;
  if (day === 0) return false;
  // Simple heuristic: if "Closed" in the hours string, treat as closed
  if (day >= 1 && day <= 5) {
    if (weekdayHours.toLowerCase().includes('closed')) return false;
    return total >= 510 && total < 1050;
  }
  if (day === 6) {
    if (saturdayHours.toLowerCase().includes('closed')) return false;
    return total >= 540 && total < 840;
  }
  return false;
}

const SOCIAL_ICONS: { key: string; icon: string; label: string }[] = [
  { key: 'facebook_url', icon: 'ri-facebook-fill', label: 'Facebook' },
  { key: 'instagram_url', icon: 'ri-instagram-line', label: 'Instagram' },
  { key: 'linkedin_url', icon: 'ri-linkedin-fill', label: 'LinkedIn' },
  { key: 'whatsapp_direct_url', icon: 'ri-whatsapp-line', label: 'WhatsApp' },
  { key: 'twitter_url', icon: 'ri-twitter-x-line', label: 'X / Twitter' },
  { key: 'youtube_url', icon: 'ri-youtube-fill', label: 'YouTube' },
];

export default function ContactSidebar() {
  const { get } = useSiteSettings();

  const phone = get('phone', '+256(0)758671270');
  const whatsapp = get('whatsapp', '+256758671270');
  const whatsappDirect = get('whatsapp_direct_url') || `https://wa.me/${whatsapp.replace(/\D/g, '')}`;
  const email = get('email', 'info@oceans.co.ug');
  const address = get('office_address', '785 Luthuli Avenue, Bugolobi, Kampala, Uganda');
  const weekdayHours = get('working_hours_weekday', 'Monday – Friday: 8:00 AM – 6:00 PM');
  const saturdayHours = get('working_hours_saturday', 'Saturday: 9:00 AM – 4:00 PM');
  const sundayHours = get('working_hours_sunday', 'Sunday: Closed');
  const showSocial = get('social_show_contact_page', 'true') === 'true';
  const sidebarImage = get('cp_sidebar_image', '');

  const todayIdx = getCurrentDayIndex();
  const open = isCurrentlyOpen(weekdayHours, saturdayHours);

  const HOURS = [
    { label: weekdayHours, days: [0, 1, 2, 3, 4] },
    { label: saturdayHours, days: [5] },
    { label: sundayHours, days: [6] },
  ];

  const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-4 md:space-y-5">
      {/* Sidebar image — editable from Admin → Contact Page → Media tab */}
      {sidebarImage && (
        <div className="w-full aspect-square overflow-hidden">
          <img
            src={sidebarImage}
            alt="Oceans Estate &amp; Letting Agents"
            className="w-full h-full object-cover object-top"
          />
        </div>
      )}

      {/* Open/Closed badge */}
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-roboto font-medium ${
          open
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-red-50 text-red-600 border border-red-200'
        }`}
      >
        <span className={`w-2 h-2 rounded-full ${open ? 'bg-emerald-500 animate-pulse' : 'bg-red-400'}`} />
        {open ? "We're Open Now" : 'Currently Closed'}
      </div>

      {/* Office Hours */}
      <div className="bg-white border border-gray-100 p-4 md:p-5" style={{ boxShadow: '0 2px 20px rgba(0,23,49,0.06)' }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 flex items-center justify-center rounded-full" style={{ background: 'rgba(13,89,89,0.08)' }}>
            <i className="ri-time-line text-primary text-xs" />
          </div>
          <h3 className="text-primary font-prata text-sm">Office Hours</h3>
        </div>
        <div className="space-y-1">
          {DAY_NAMES.map((day, idx) => {
            const hourEntry = HOURS.find((h) => h.days.includes(idx));
            const label = hourEntry?.label ?? '';
            const isClosed = label.toLowerCase().includes('closed');
            const isToday = idx === todayIdx;
            return (
              <div
                key={day}
                className={`flex items-center justify-between py-1.5 text-sm font-roboto ${
                  idx < DAY_NAMES.length - 1 ? 'border-b border-gray-50' : ''
                } ${isToday ? 'bg-golden/5 px-2 -mx-2 rounded-sm' : ''}`}
              >
                <span className={`${isToday ? 'text-primary font-semibold' : 'text-text-gray'}`}>
                  {day}
                  {isToday && <span className="ml-2 text-xs text-golden font-normal">(today)</span>}
                </span>
                <span className={isClosed ? 'text-red-400' : isToday ? 'text-primary font-medium' : 'text-text-gray'}>
                  {/* Extract just the time part if format is "Day: HH:MM – HH:MM" */}
                  {label.includes(':') && label.split(':').length > 1
                    ? label.replace(/^[^:]+:\s*/, '')
                    : label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact details */}
      <div className="bg-white border border-gray-100 p-4 md:p-5" style={{ boxShadow: '0 2px 20px rgba(0,23,49,0.06)' }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 flex items-center justify-center rounded-full" style={{ background: 'rgba(13,89,89,0.08)' }}>
            <i className="ri-contacts-line text-primary text-xs" />
          </div>
          <h3 className="text-primary font-prata text-sm">Get In Touch</h3>
        </div>
        <div className="space-y-2.5 md:space-y-3">
          {phone && (
            <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-start gap-2 md:gap-2.5 group cursor-pointer">
              <div className="w-8 h-8 flex items-center justify-center bg-golden/10 rounded-full flex-shrink-0 group-hover:bg-golden/20 transition-colors">
                <i className="ri-phone-line text-golden text-xs" />
              </div>
              <div>
                <p className="text-primary font-roboto text-[10px] font-semibold uppercase tracking-wider mb-0.5">Phone</p>
                <p className="text-text-gray font-roboto text-sm group-hover:text-golden transition-colors">{phone}</p>
              </div>
            </a>
          )}

          {whatsapp && (
            <a
              href={whatsappDirect}
              target="_blank"
              rel="nofollow"
              className="flex items-start gap-2 md:gap-2.5 group cursor-pointer"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-golden/10 rounded-full flex-shrink-0 group-hover:bg-golden/20 transition-colors">
                <i className="ri-whatsapp-line text-golden text-xs" />
              </div>
              <div>
                <p className="text-primary font-roboto text-[10px] font-semibold uppercase tracking-wider mb-0.5">WhatsApp</p>
                <p className="text-text-gray font-roboto text-sm group-hover:text-golden transition-colors">{whatsapp}</p>
              </div>
            </a>
          )}

          {email && (
            <a href={`mailto:${email}`} className="flex items-start gap-2 md:gap-2.5 group cursor-pointer">
              <div className="w-8 h-8 flex items-center justify-center bg-golden/10 rounded-full flex-shrink-0 group-hover:bg-golden/20 transition-colors">
                <i className="ri-mail-line text-golden text-xs" />
              </div>
              <div>
                <p className="text-primary font-roboto text-[10px] font-semibold uppercase tracking-wider mb-0.5">Email</p>
                <p className="text-text-gray font-roboto text-sm group-hover:text-golden transition-colors">{email}</p>
              </div>
            </a>
          )}

          {address && (
            <div className="flex items-start gap-2 md:gap-2.5">
              <div className="w-8 h-8 flex items-center justify-center bg-golden/10 rounded-full flex-shrink-0">
                <i className="ri-map-pin-2-line text-golden text-xs" />
              </div>
              <div>
                <p className="text-primary font-roboto text-[10px] font-semibold uppercase tracking-wider mb-0.5">Office</p>
                <p className="text-text-gray font-roboto text-sm leading-relaxed">{address}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Social links */}
      {showSocial && (
        <div className="bg-white border border-gray-100 p-4 md:p-5" style={{ boxShadow: '0 4px 24px rgba(13,89,89,0.10)' }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 flex items-center justify-center rounded-full" style={{ background: 'rgba(13,89,89,0.08)' }}>
              <i className="ri-share-line text-primary text-xs" />
            </div>
            <h3 className="text-primary font-prata text-sm">Follow Us</h3>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {SOCIAL_ICONS.map((s) => {
              const url = get(s.key);
              return (
                <a
                  key={s.key}
                  href={url || '#'}
                  rel="nofollow"
                  target="_blank"
                  aria-label={s.label}
                  className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full border border-gray-200 text-primary hover:bg-primary hover:text-white hover:border-primary hover:shadow-md hover:shadow-primary/20 transition-all cursor-pointer group"
                >
                  <i className={`${s.icon} text-base md:text-lg`} />
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Valuation CTA */}
      <Link
        to="/landlords"
        className="flex items-center gap-2 md:gap-2.5 p-4 md:p-5 bg-primary group hover:bg-primary/95 transition-colors cursor-pointer"
      >
        <div className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center bg-white/10 rounded-full flex-shrink-0">
          <i className="ri-bar-chart-2-line text-golden text-sm md:text-base" />
        </div>
        <div>
          <p className="text-white font-prata text-sm">Free Property Valuation</p>
          <p className="text-white/60 font-roboto text-xs">Know your property&apos;s worth →</p>
        </div>
      </Link>
    </div>
  );
}
