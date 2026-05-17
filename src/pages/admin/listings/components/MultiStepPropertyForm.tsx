import { useState, useEffect, useRef } from 'react';
import { ListingFormData, ListingImage, AgentOption, NeighborhoodOption, CardDisplaySettings } from '@/pages/admin/listings/types';
import StepBasicInfo from './steps/StepBasicInfo';
import StepPriceDetails from './steps/StepPriceDetails';
import StepLocation from './steps/StepLocation';
import StepMedia from './steps/StepMedia';
import StepFeatures from './steps/StepFeatures';
import StepContactPublish from './steps/StepContactPublish';

interface Props {
  formData: ListingFormData;
  agents: AgentOption[];
  neighborhoods: NeighborhoodOption[];
  saving: boolean;
  isEdit: boolean;
  onChange: (field: keyof ListingFormData, value: string | boolean | number | string[] | CardDisplaySettings) => void;
  onImagesChange: (images: ListingImage[]) => void;
  onAmenitiesChange: (amenities: string[]) => void;
  onSave: () => void;
  onSubmit: () => void;
  onPublish: () => void;
  onCancel: () => void;
}

interface Step {
  key: string;
  label: string;
  icon: string;
  description: string;
}

const STEPS: Step[] = [
  { key: 'description_price', label: 'Description', icon: 'ri-file-text-line', description: 'Title, type & write-up' },
  { key: 'property_details', label: 'Details', icon: 'ri-home-4-line', description: 'Price, size & rooms' },
  { key: 'features', label: 'Features', icon: 'ri-list-check', description: 'Amenities & highlights' },
  { key: 'media', label: 'Media', icon: 'ri-image-2-line', description: 'Photos & floor plans' },
  { key: 'location', label: 'Location', icon: 'ri-map-pin-2-line', description: 'Address & map' },
  { key: 'property_settings', label: 'Settings', icon: 'ri-settings-3-line', description: 'Agent, SEO & publish' },
];

function isStepValid(key: string, formData: ListingFormData): boolean {
  switch (key) {
    case 'description_price': return formData.title.trim().length > 0 && formData.property_type !== '';
    case 'location': return formData.location.trim().length > 0;
    case 'property_details': return formData.price.trim().length > 0 || formData.price_on_request;
    default: return true;
  }
}

function renderStepContent(
  key: string, formData: ListingFormData, agents: AgentOption[],
  neighborhoods: NeighborhoodOption[], saving: boolean,
  onChange: Props['onChange'], onImagesChange: Props['onImagesChange'],
  onAmenitiesChange: Props['onAmenitiesChange'], onSave: () => void,
  onSaveSection: () => void, savingSection: boolean, isEdit: boolean,
) {
  switch (key) {
    case 'description_price': return <StepBasicInfo data={formData} onChange={onChange} />;
    case 'property_details': return <StepPriceDetails data={formData} onChange={onChange} />;
    case 'features': return <StepFeatures data={formData} onChange={onChange} onAmenitiesChange={onAmenitiesChange} />;
    case 'media': return <StepMedia data={formData} onChange={onChange} onImagesChange={onImagesChange} />;
    case 'location': return <StepLocation data={formData} neighborhoods={neighborhoods} onChange={onChange} />;
    case 'property_settings': return <StepContactPublish data={formData} agents={agents} onChange={onChange} onSaveSection={onSaveSection} savingSection={savingSection} isEdit={isEdit} />;
    default: return null;
  }
}

/* ─── Finish Later Modal ─────────────────────────────────────────────────── */
interface FinishLaterModalProps {
  formData: ListingFormData;
  currentStep: number;
  totalSteps: number;
  saving: boolean;
  onSaveDraftAndExit: () => void;
  onPublishAndExit: () => void;
  onDiscardAndExit: () => void;
  onKeepEditing: () => void;
}

function FinishLaterModal({ formData, currentStep, totalSteps, saving, onSaveDraftAndExit, onPublishAndExit, onDiscardAndExit, onKeepEditing }: FinishLaterModalProps) {
  const hasTitle = formData.title.trim().length > 0;
  const hasPrice = formData.price.trim().length > 0 || formData.price_on_request;
  const hasLocation = formData.location.trim().length > 0;
  const hasImages = formData.images.length > 0;
  const hasAmenities = formData.amenities.length > 0;
  const hasDescription = formData.full_description.trim().length > 0 || formData.short_description.trim().length > 0;
  const filledCount = [hasTitle, hasPrice, hasLocation, hasImages, hasAmenities, hasDescription].filter(Boolean).length;
  const progressPct = Math.round(((currentStep + 1) / totalSteps) * 100);

  const summaryItems = [
    { label: 'Property title', filled: hasTitle, value: hasTitle ? formData.title : null },
    { label: 'Price', filled: hasPrice, value: formData.price_on_request ? 'Price on request' : hasPrice ? `${formData.currency} ${Number(formData.price).toLocaleString()}` : null },
    { label: 'Location', filled: hasLocation, value: hasLocation ? formData.location : null },
    { label: 'Photos', filled: hasImages, value: hasImages ? `${formData.images.length} photo${formData.images.length > 1 ? 's' : ''} uploaded` : null },
    { label: 'Description', filled: hasDescription, value: hasDescription ? 'Added' : null },
    { label: 'Amenities', filled: hasAmenities, value: hasAmenities ? `${formData.amenities.length} selected` : null },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onKeepEditing} />
      <div className="relative bg-white w-full sm:max-w-md overflow-hidden rounded-t-2xl sm:rounded-xl" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-5 sm:pb-6 border-b border-[#e8edf2]">
          {/* Drag handle on mobile */}
          <div className="w-10 h-1 bg-[#e8edf2] rounded-full mx-auto mb-4 sm:hidden" />
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-light text-[#0d1f2d] tracking-wide">Save &amp; Exit</h2>
              <p className="text-sm text-[#7a8a99] mt-1 font-light">
                Step {currentStep + 1} of {totalSteps} complete — your draft will be saved privately.
              </p>
            </div>
            <button type="button" onClick={onKeepEditing} className="w-8 h-8 flex items-center justify-center text-[#7a8a99] hover:text-[#0d1f2d] transition-colors cursor-pointer shrink-0">
              <i className="ri-close-line text-lg" />
            </button>
          </div>
        </div>

        <div className="px-6 sm:px-8 py-5 sm:py-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-[#F5F5F5] relative">
              <div className="absolute inset-y-0 left-0 bg-[#0d5959] transition-all duration-500" style={{ width: `${progressPct}%`, height: '2px', top: '-0.5px' }} />
            </div>
            <span className="text-xs font-medium text-[#0d5959] whitespace-nowrap">{progressPct}%</span>
          </div>

          <p className="text-xs uppercase tracking-widest text-[#7a8a99] mb-3">Progress — {filledCount}/6 sections filled</p>
          <div className="space-y-1">
            {summaryItems.map((item) => (
              <div key={item.label} className="flex items-center gap-3 py-1.5 border-b border-[#F5F5F5]">
                <div className={`w-4 h-4 flex items-center justify-center shrink-0 ${item.filled ? 'text-[#0d5959]' : 'text-[#ddd]'}`}>
                  <i className={item.filled ? 'ri-checkbox-circle-fill text-sm' : 'ri-circle-line text-sm'} />
                </div>
                <span className={`text-sm flex-1 ${item.filled ? 'text-[#0d1f2d]' : 'text-[#7a8a99]'}`}>{item.label}</span>
                {item.value && <span className="text-xs text-[#7a8a99] truncate max-w-[120px]">{item.value}</span>}
              </div>
            ))}
          </div>

          <p className="text-xs text-[#7a8a99] mt-4 leading-relaxed">
            Saved drafts remain <strong className="text-[#0d1f2d] font-medium">hidden from the public</strong> until you publish.
          </p>
        </div>

        <div className="px-6 sm:px-8 pb-6 sm:pb-8 flex flex-col gap-2">
          <button
            type="button"
            onClick={onPublishAndExit}
            disabled={saving}
            className="w-full py-3.5 text-sm bg-[#0d5959] text-white font-medium cursor-pointer disabled:opacity-50 whitespace-nowrap transition-colors hover:bg-[#1B5E20] tracking-wide rounded-md"
          >
            {saving ? 'Publishing…' : 'Publish Now & Exit'}
          </button>
          <button
            type="button"
            onClick={onSaveDraftAndExit}
            disabled={saving}
            className="w-full py-3.5 text-sm bg-[#0d1f2d] text-white font-medium cursor-pointer disabled:opacity-50 whitespace-nowrap transition-colors hover:bg-[#1a3347] tracking-wide rounded-md"
          >
            {saving ? 'Saving…' : 'Save Draft & Exit'}
          </button>
          <button
            type="button"
            onClick={onDiscardAndExit}
            disabled={saving}
            className="w-full py-3 text-sm border border-[#e8edf2] text-[#7a8a99] font-light cursor-pointer disabled:opacity-40 whitespace-nowrap transition-colors hover:text-red-500 hover:border-red-200 rounded-md"
          >
            Discard &amp; Exit
          </button>
          <button type="button" onClick={onKeepEditing} className="w-full py-2 text-sm text-[#7a8a99] hover:text-[#0d1f2d] font-light cursor-pointer whitespace-nowrap transition-colors">
            Keep editing
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Mobile Step Pill Bar ───────────────────────────────────────────────── */
interface MobileStepBarProps {
  steps: Step[];
  currentStep: number;
  visitedSteps: Set<number>;
  dirtySections: Set<string>;
  onStepClick: (idx: number) => void;
}

function MobileStepBar({ steps, currentStep, visitedSteps, dirtySections, onStepClick }: MobileStepBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const active = el.children[currentStep] as HTMLElement;
    if (active) {
      active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [currentStep]);

  return (
    <div className="bg-white border-b border-[#e8edf2] px-3 py-2">
      {/* Progress bar */}
      <div className="h-0.5 bg-[#F5F5F5] rounded-full mb-2.5 overflow-hidden">
        <div
          className="h-full bg-[#0d5959] transition-all duration-500 rounded-full"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>
      {/* Scrollable step pills */}
      <div ref={scrollRef} className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-0.5">
        {steps.map((step, idx) => {
          const isActive = idx === currentStep;
          const isCompleted = visitedSteps.has(idx) && idx < currentStep;
          const isClickable = visitedSteps.has(idx) || idx <= currentStep;
          const isDirty = dirtySections.has(step.key);

          return (
            <button
              key={step.key}
              type="button"
              onClick={() => isClickable && onStepClick(idx)}
              disabled={!isClickable}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-[#0d1f2d] text-white'
                  : isCompleted
                  ? 'bg-[#0d5959]/10 text-[#0d5959] border border-[#0d5959]/20'
                  : isClickable
                  ? 'bg-[#F5F5F5] text-[#7a8a99]'
                  : 'bg-[#F5F5F5] text-[#ccc] cursor-not-allowed'
              }`}
            >
              {isCompleted
                ? <i className="ri-checkbox-circle-fill text-[10px]" />
                : <i className={`${step.icon} text-[10px]`} />
              }
              {step.label}
              {isDirty && !isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Quick Controls Bar ─────────────────────────────────────────────────── */
interface QuickControlsBarProps {
  purpose: string;
  featured: boolean;
  status: string;
  onPurposeChange: (p: string) => void;
  onFeaturedToggle: () => void;
  onStatusChange: (s: string) => void;
  isEdit: boolean;
}

const PURPOSE_PILLS = [
  { value: 'sale', label: 'For Sale', icon: 'ri-price-tag-3-line', activeClass: 'bg-[#0d1f2d] text-white border-[#0d1f2d]' },
  { value: 'rent', label: 'For Rent', icon: 'ri-home-heart-line', activeClass: 'bg-teal-600 text-white border-teal-600' },
  { value: 'new_dev', label: 'New Development', icon: 'ri-building-2-line', activeClass: 'bg-amber-600 text-white border-amber-600' },
];

function QuickControlsBar({ purpose, featured, status, onPurposeChange, onFeaturedToggle, onStatusChange, isEdit }: QuickControlsBarProps) {
  return (
    <div className="bg-[#f8f9fb] border-b border-[#e8edf2] px-4 sm:px-8 py-2.5 flex flex-wrap items-center gap-2 sm:gap-3">
      {/* Label */}
      <span className="text-[10px] uppercase tracking-widest text-[#b0bec5] font-semibold shrink-0 hidden sm:block">Quick Set:</span>

      {/* Purpose pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {PURPOSE_PILLS.map((pill) => (
          <button
            key={pill.value}
            type="button"
            onClick={() => onPurposeChange(pill.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold border rounded-md transition-all cursor-pointer whitespace-nowrap ${
              purpose === pill.value
                ? pill.activeClass
                : 'bg-white text-[#7a8a99] border-[#e8edf2] hover:border-[#0d1f2d] hover:text-[#0d1f2d]'
            }`}
          >
            <i className={`${pill.icon} text-[11px]`} />
            {pill.label}
          </button>
        ))}
      </div>

      {/* Status pills — EDIT MODE ONLY (status control stays out of Add flow) */}
      {isEdit && (
        <>
          <div className="w-px h-5 bg-[#e8edf2] hidden sm:block" />
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => onStatusChange('published')}
              className={`px-3 py-1.5 text-[11px] font-semibold border rounded-md transition-all cursor-pointer whitespace-nowrap ${
                status === 'published'
                  ? 'bg-emerald-500 text-white border-emerald-500'
                  : 'bg-white text-[#7a8a99] border-[#e8edf2] hover:border-[#7a8a99] hover:text-[#7a8a99]'
              }`}
            >
              Published
            </button>
            <button
              type="button"
              onClick={() => onStatusChange('on_hold')}
              className={`px-3 py-1.5 text-[11px] font-semibold border rounded-md transition-all cursor-pointer whitespace-nowrap ${
                status === 'on_hold'
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-[#7a8a99] border-[#e8edf2] hover:border-[#7a8a99] hover:text-[#7a8a99]'
              }`}
            >
              On Hold
            </button>
            <button
              type="button"
              onClick={() => onStatusChange('archived')}
              className={`px-3 py-1.5 text-[11px] font-semibold border rounded-md transition-all cursor-pointer whitespace-nowrap ${
                status === 'archived'
                  ? 'bg-gray-400 text-white border-gray-400'
                  : 'bg-white text-[#7a8a99] border-[#e8edf2] hover:border-[#7a8a99] hover:text-[#7a8a99]'
              }`}
            >
              Archived
            </button>
          </div>
        </>
      )}

      <div className="w-px h-5 bg-[#e8edf2] hidden sm:block" />

      {/* Featured star toggle */}
      <button
        type="button"
        onClick={onFeaturedToggle}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold border rounded-md transition-all cursor-pointer whitespace-nowrap ${
          featured
            ? 'bg-white text-[#0d5959] border-[#0d5959]'
            : 'bg-white text-[#7a8a99] border-[#e8edf2] hover:border-[#0d5959] hover:text-[#0d5959]'
        }`}
      >
        <i className={`${featured ? 'ri-star-fill' : 'ri-star-line'} text-[11px]`} />
        {featured ? 'Featured' : 'Mark Featured'}
      </button>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function MultiStepPropertyForm({
  formData, agents, neighborhoods, saving, isEdit,
  onChange, onImagesChange, onAmenitiesChange, onSave, onSubmit, onPublish, onCancel,
}: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([0]));
  const [showFinishLater, setShowFinishLater] = useState(false);
  const [dirtySections, setDirtySections] = useState<Set<string>>(new Set());
  const [savingSection, setSavingSection] = useState(false);

  useEffect(() => {
    if (isEdit) {
      // In edit mode, unlock all steps so the user can jump anywhere
      setCurrentStep(0);
      setVisitedSteps(new Set(STEPS.map((_, i) => i)));
    } else {
      // New listing: start from step 0
      setCurrentStep(0);
      setVisitedSteps(new Set([0]));
    }
  }, []);

  const totalSteps = STEPS.length;
  const activeStep = STEPS[currentStep];
  const isLastStep = currentStep === totalSteps - 1;
  const canProceed = isStepValid(activeStep.key, formData);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      setVisitedSteps((prev) => new Set([...prev, next]));
    }
  };

  const handleBack = () => { if (currentStep > 0) setCurrentStep((prev) => prev - 1); };

  const handleStepClick = (idx: number) => {
    if (visitedSteps.has(idx) || idx <= currentStep) {
      setCurrentStep(idx);
      setVisitedSteps((prev) => new Set([...prev, idx]));
    }
  };

  const handleBackToListings = () => {
    const hasAnyData = formData.title.trim().length > 0 || formData.price.trim().length > 0 || formData.price_on_request || formData.images.length > 0;
    if (hasAnyData) { setShowFinishLater(true); } else { onCancel(); }
  };

  const handleSaveDraftAndExit = async () => { await onSave(); onCancel(); };
  const handleDiscardAndExit = () => { setShowFinishLater(false); onCancel(); };

  const handlePurposeChange = (val: string) => {
    onChange('purpose', val);
    // Auto-sync listing_status badges
    const purposeBadgeMap: Record<string, string[]> = {
      sale: ['for_sale'],
      rent: ['for_rent'],
      short_stay: ['for_rent', 'short_stay'],
      new_dev: ['for_sale', 'new_development'],
    };
    const autoBadges = purposeBadgeMap[val] ?? ['for_sale'];
    const AUTO_BADGE_VALUES = ['for_sale', 'for_rent', 'short_stay', 'new_development'];
    const customTags = (formData.listing_status || []).filter((s) => !AUTO_BADGE_VALUES.includes(s));
    onChange('listing_status', [...autoBadges, ...customTags]);
  };

  const handleSaveSection = async () => {
    setSavingSection(true);
    await onSave();
    setDirtySections((prev) => {
      const next = new Set(prev);
      next.delete(activeStep.key);
      return next;
    });
    setSavingSection(false);
  };

  /* ── Wrapped change handlers with dirty tracking ────────────────────── */
  const wrappedOnChange = (
    field: keyof ListingFormData,
    value: string | boolean | number | string[] | CardDisplaySettings
  ) => {
    setDirtySections((prev) => new Set([...prev, activeStep.key]));
    onChange(field, value);
  };

  const wrappedOnImagesChange = (images: ListingImage[]) => {
    setDirtySections((prev) => new Set([...prev, 'media']));
    onImagesChange(images);
  };

  const wrappedOnAmenitiesChange = (amenities: string[]) => {
    setDirtySections((prev) => new Set([...prev, 'features']));
    onAmenitiesChange(amenities);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      {showFinishLater && (
        <FinishLaterModal
          formData={formData} currentStep={currentStep} totalSteps={totalSteps} saving={saving}
          onSaveDraftAndExit={handleSaveDraftAndExit}
          onPublishAndExit={() => { setShowFinishLater(false); onPublish(); }}
          onDiscardAndExit={handleDiscardAndExit}
          onKeepEditing={() => setShowFinishLater(false)}
        />
      )}

      {/* ── Top Bar ── */}
      <div className="bg-white border-b border-[#e8edf2] px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3 sm:gap-5 min-w-0">
          <button
            type="button"
            onClick={handleBackToListings}
            className="flex items-center gap-1.5 sm:gap-2 text-xs uppercase tracking-widest text-[#7a8a99] hover:text-[#0d1f2d] transition-colors cursor-pointer whitespace-nowrap font-medium shrink-0"
          >
            <i className="ri-arrow-left-line text-sm" />
            <span className="hidden sm:inline">Listings</span>
          </button>
          <div className="w-px h-4 bg-[#e8edf2] hidden sm:block" />
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-widest text-[#7a8a99] font-medium hidden sm:block">
              {isEdit ? 'Edit Property' : 'New Listing'}
            </p>
            <p className="text-sm font-medium text-[#0d1f2d] sm:font-light truncate max-w-[160px] sm:max-w-sm">
              {formData.title || (isEdit ? 'Edit Property' : 'New Listing')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setShowFinishLater(true)}
            className="text-xs text-[#7a8a99] hover:text-[#0d1f2d] font-medium cursor-pointer whitespace-nowrap transition-colors px-2 sm:px-4 py-2 hover:bg-[#F5F5F5] rounded hidden sm:block"
          >
            Save later
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="text-xs text-[#0d1f2d] font-medium cursor-pointer whitespace-nowrap transition-colors disabled:opacity-40 px-2.5 sm:px-4 py-2 border border-[#e8edf2] hover:bg-[#F5F5F5] rounded"
          >
            {saving ? 'Saving…' : 'Draft'}
          </button>
          {isLastStep && (
            <div className="flex items-center gap-2">
              {!isEdit && (
                <button
                  type="button"
                  onClick={onPublish}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-3 sm:px-6 py-2 text-xs bg-[#0d5959] text-white font-medium cursor-pointer disabled:opacity-40 whitespace-nowrap transition-colors hover:bg-[#1B5E20] rounded"
                >
                  {saving ? 'Publishing…' : 'Publish Now'}
                  <i className="ri-rocket-line text-sm" />
                </button>
              )}
              {isEdit && (
                <button
                  type="button"
                  onClick={onSave}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-3 sm:px-6 py-2 text-xs bg-[#0d1f2d] text-white font-medium cursor-pointer disabled:opacity-40 whitespace-nowrap transition-colors hover:bg-[#1a3347] rounded"
                >
                  {saving ? 'Saving…' : 'Save'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Quick Controls Bar ── */}
      <div className="sticky top-[53px] sm:top-[65px] z-20">
        <QuickControlsBar
          purpose={formData.purpose}
          featured={formData.featured}
          status={formData.status}
          onPurposeChange={handlePurposeChange}
          onFeaturedToggle={() => wrappedOnChange('featured', !formData.featured)}
          onStatusChange={(s) => wrappedOnChange('status', s)}
          isEdit={isEdit}
        />
      </div>

      {/* ── Mobile Step Bar (visible on mobile only) ── */}
      <div className="sm:hidden sticky top-[97px] z-10">
        <MobileStepBar
          steps={STEPS}
          currentStep={currentStep}
          visitedSteps={visitedSteps}
          dirtySections={dirtySections}
          onStepClick={handleStepClick}
        />
      </div>

      {/* ── Body: Sidebar + Content ── */}
      <div className="flex flex-1">

        {/* ── Left Sidebar (desktop only) ── */}
        <aside className="hidden sm:flex w-64 shrink-0 bg-white border-r border-[#e8edf2] sticky top-[105px] self-start h-[calc(100vh-105px)] overflow-y-auto flex-col">
          {/* Listing label */}
          <div className="px-8 pt-8 pb-6 border-b border-[#F5F5F5]">
            <p className="text-[10px] uppercase tracking-widest text-[#7a8a99] mb-2">Listing form</p>
            <h2 className="text-base font-light text-[#0d1f2d] leading-snug">
              {isEdit ? 'Edit Property' : 'Add New Property'}
            </h2>
            {/* Mini status summary */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                formData.purpose === 'sale' ? 'bg-[#0d1f2d] text-white'
                : formData.purpose === 'rent' ? 'bg-teal-600 text-white'
                : formData.purpose === 'new_dev' ? 'bg-amber-600 text-white'
                : 'bg-gray-200 text-gray-600'
              }`}>
                {formData.purpose === 'sale' ? 'For Sale' : formData.purpose === 'rent' ? 'For Rent' : formData.purpose === 'new_dev' ? 'New Dev' : formData.purpose}
              </span>
              {formData.featured && (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide bg-[#0d5959] text-white">
                  Featured
                </span>
              )}
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                formData.status === 'published' ? 'bg-emerald-100 text-emerald-700'
                : formData.status === 'on_hold' ? 'bg-orange-100 text-orange-700'
                : formData.status === 'pending_review' ? 'bg-blue-100 text-blue-700'
                : formData.status === 'draft' ? 'bg-gray-100 text-gray-500'
                : 'bg-gray-100 text-gray-500'
              }`}>
                {formData.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Steps nav */}
          <nav className="flex-1 py-4">
            {STEPS.map((step, idx) => {
              const isActive = idx === currentStep;
              const isCompleted = visitedSteps.has(idx) && idx < currentStep;
              const isVisited = visitedSteps.has(idx);
              const isClickable = isVisited || idx <= currentStep;
              const isDirty = dirtySections.has(step.key);

              return (
                <button
                  key={step.key}
                  type="button"
                  onClick={() => isClickable && handleStepClick(idx)}
                  disabled={!isClickable}
                  className={`w-full text-left px-8 py-4 flex items-start gap-4 transition-all group relative cursor-pointer
                    ${isActive ? 'bg-[#F5F5F5]' : isClickable ? 'hover:bg-[#F5F5F5]/60' : 'opacity-40 cursor-not-allowed'}
                  `}
                >
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#d3bb6e]" />}
                  <div className={`w-6 h-6 flex items-center justify-center shrink-0 mt-0.5 transition-colors
                    ${isActive ? 'text-[#d3bb6e]' : isCompleted ? 'text-[#0d5959]' : 'text-[#ccc]'}
                  `}>
                    {isCompleted
                      ? <i className="ri-checkbox-circle-fill text-base" />
                      : <span className="text-xs font-semibold">{idx + 1}</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-bold leading-tight transition-colors
                        ${isActive ? 'text-[#0d1f2d]' : isCompleted ? 'text-[#0d5959]' : isVisited ? 'text-[#0d1f2d]' : 'text-[#7a8a99]'}
                      `}>
                        {step.label}
                      </p>
                      {isDirty && !isActive && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" title="Unsaved changes" />
                      )}
                    </div>
                    <p className="text-xs text-[#7a8a99] mt-0.5 leading-tight">{step.description}</p>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Progress at bottom of sidebar */}
          <div className="px-8 py-6 border-t border-[#F5F5F5]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-[#7a8a99] font-light">Progress</p>
              <p className="text-xs font-medium text-[#0d1f2d]">{Math.round(((currentStep + 1) / totalSteps) * 100)}%</p>
            </div>
            <div className="h-px bg-[#F5F5F5] relative">
              <div
                className="absolute left-0 top-0 h-px bg-[#0d5959] transition-all duration-500"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              />
            </div>
            <p className="text-xs text-[#7a8a99] mt-2 font-light">
              Step {currentStep + 1} of {totalSteps}
            </p>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 min-w-0 pb-24 sm:pb-0">
          {/* Section header — desktop only */}
          <div className="hidden sm:flex bg-[#001731] border-l-2 border-[#d3bb6e] px-10 py-7 items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#d3bb6e] mb-1.5 font-semibold">
                {activeStep.description}
              </p>
              <h1 className="text-2xl font-jost font-semibold text-white tracking-tight">{activeStep.label}</h1>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium">
                <span className="text-[#d3bb6e] font-bold">{currentStep + 1}</span>
                <span className="text-white/60"> / {totalSteps}</span>
              </p>
            </div>
          </div>

          {/* Mobile section header */}
          <div className="sm:hidden bg-white border-b border-[#e8edf2] px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0d1f2d]/5 text-[#0d1f2d]">
              <i className={`${activeStep.icon} text-sm`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0d1f2d]">{activeStep.label}</p>
              <p className="text-[11px] text-[#7a8a99]">{activeStep.description}</p>
            </div>
            <div className="ml-auto text-[11px] text-[#7a8a99] font-medium">{currentStep + 1}/{totalSteps}</div>
          </div>

          {/* Step content */}
          <div className="px-4 sm:px-10 py-4 sm:py-10">
            <div className="bg-white border border-[#e8edf2] p-4 sm:p-8 rounded-lg sm:rounded-none">
              {renderStepContent(activeStep.key, formData, agents, neighborhoods, saving, wrappedOnChange, wrappedOnImagesChange, wrappedOnAmenitiesChange, onSave, handleSaveSection, savingSection, isEdit)}
            </div>

            {/* Bottom nav — desktop only */}
            <div className="hidden sm:flex mt-6 items-center justify-between w-full">
              <div>
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-widest text-[#0d1f2d] font-medium cursor-pointer whitespace-nowrap transition-colors border-2 border-[#0d1f2d] rounded-md hover:bg-[#0d1f2d] hover:text-white"
                  >
                    <i className="ri-arrow-left-line" />
                    Back
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4">
                {!isLastStep ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!canProceed}
                    className="flex items-center gap-2 px-8 py-3 text-xs uppercase tracking-widest bg-[#0d1f2d] text-white font-medium cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap transition-colors hover:bg-[#1a3347] rounded-md"
                  >
                    Next
                    <i className="ri-arrow-right-line text-sm" />
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    {!isEdit && (
                      <button
                        type="button"
                        onClick={onPublish}
                        disabled={saving}
                        className="flex items-center gap-2 px-8 py-3 text-xs uppercase tracking-widest bg-[#0d5959] text-white font-medium cursor-pointer disabled:opacity-40 whitespace-nowrap transition-colors hover:bg-[#1B5E20] rounded-md"
                      >
                        {saving ? 'Publishing…' : 'Publish Now'}
                        <i className="ri-rocket-line" />
                      </button>
                    )}
                    {isEdit && (
                      <button
                        type="button"
                        onClick={onSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-8 py-3 text-xs uppercase tracking-widest bg-[#0d1f2d] text-white font-medium cursor-pointer disabled:opacity-40 whitespace-nowrap transition-colors hover:bg-[#1a3347] rounded-md"
                      >
                        {saving ? 'Saving…' : 'Save Changes'}
                        <i className="ri-check-line" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ── Mobile Sticky Bottom Nav ── */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-[#e8edf2] px-4 py-3 flex items-center gap-3">
        {currentStep > 0 ? (
          <button
            type="button"
            onClick={handleBack}
            className="px-4 py-2.5 text-sm font-medium text-[#7a8a99] border border-[#e8edf2] rounded-lg cursor-pointer whitespace-nowrap"
          >
            Back
          </button>
        ) : (
          <button
            type="button"
            onClick={handleBackToListings}
            className="px-4 py-2.5 text-sm font-medium text-[#7a8a99] border border-[#e8edf2] rounded-lg cursor-pointer whitespace-nowrap"
          >
            Cancel
          </button>
        )}

        <div className="flex-1" />

        {!isLastStep ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0d1f2d] text-white text-sm font-medium rounded-lg cursor-pointer disabled:opacity-40 whitespace-nowrap transition-colors"
          >
            Next
            <i className="ri-arrow-right-line text-sm" />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            {!isEdit && (
              <button
                type="button"
                onClick={onPublish}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0d5959] text-white text-sm font-medium rounded-lg cursor-pointer disabled:opacity-40 whitespace-nowrap hover:bg-[#1B5E20] transition-colors"
              >
                {saving ? 'Publishing…' : 'Publish'}
                <i className="ri-rocket-line text-sm" />
              </button>
            )}
            {isEdit && (
              <button
                type="button"
                onClick={onSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-[#0d1f2d] text-white text-sm font-medium rounded-lg cursor-pointer disabled:opacity-40 whitespace-nowrap transition-colors"
              >
                {saving ? 'Saving…' : 'Save'}
                <i className="ri-check-line text-sm" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
