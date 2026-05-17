import { Link } from 'react-router-dom';

interface Props {
  title: string;
  purpose: string;
  listingId: string;
}

export default function PropertyBreadcrumb({ title, purpose, listingId }: Props) {
  const purposeLabel = purpose === 'rent' ? 'For Rent' : 'For Sale';
  const purposeHref  = purpose === 'rent' ? '/rent' : '/buy';

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
  }

  function handlePrint() {
    window.print();
  }

  function handleSave() {
    const saved: string[] = JSON.parse(localStorage.getItem('saved_properties') || '[]');
    if (!saved.includes(listingId)) {
      saved.push(listingId);
      localStorage.setItem('saved_properties', JSON.stringify(saved));
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">

      {/* Breadcrumb left */}
      <nav className="flex items-center gap-1.5 flex-wrap min-w-0" aria-label="Breadcrumb">
        <Link
          to="/"
          className="flex items-center gap-1 text-xs font-roboto whitespace-nowrap hover:opacity-70 transition-opacity cursor-pointer shrink-0"
          style={{ color: '#888' }}
        >
          <div className="w-3.5 h-3.5 flex items-center justify-center">
            <i className="ri-home-4-line text-xs" />
          </div>
          Home
        </Link>

        <div className="w-3 h-3 flex items-center justify-center shrink-0">
          <i className="ri-arrow-right-s-line text-xs" style={{ color: '#ccc' }} />
        </div>

        <Link
          to={purposeHref}
          className="text-xs font-roboto whitespace-nowrap hover:opacity-70 transition-opacity cursor-pointer shrink-0"
          style={{ color: '#888' }}
        >
          {purposeLabel}
        </Link>

      </nav>

      {/* Action icons right */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={handleSave}
          title="Save property"
          className="w-8 h-8 flex items-center justify-center border border-[#ddd] hover:border-[#aaa] transition-colors cursor-pointer"
          style={{ borderRadius: '2px', color: '#555' }}
        >
          <i className="ri-heart-line text-sm" />
        </button>
        <button
          onClick={handleShare}
          title="Share property"
          className="w-8 h-8 flex items-center justify-center border border-[#ddd] hover:border-[#aaa] transition-colors cursor-pointer"
          style={{ borderRadius: '2px', color: '#555' }}
        >
          <i className="ri-share-line text-sm" />
        </button>
        <button
          onClick={handlePrint}
          title="Print property"
          className="w-8 h-8 flex items-center justify-center border border-[#ddd] hover:border-[#aaa] transition-colors cursor-pointer"
          style={{ borderRadius: '2px', color: '#555' }}
        >
          <i className="ri-printer-line text-sm" />
        </button>
      </div>
    </div>
  );
}