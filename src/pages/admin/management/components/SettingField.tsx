import { type ChangeEvent, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';

export type FieldType =
  | 'text'
  | 'url'
  | 'email'
  | 'tel'
  | 'number'
  | 'textarea'
  | 'toggle'
  | 'select'
  | 'color'
  | 'image_url'
  | 'image_upload'
  | 'radio';

export interface FieldOption {
  value: string;
  label: string;
}

interface Props {
  label: string;
  hint?: string;
  type?: FieldType;
  value: string;
  onChange: (value: string) => void;
  options?: FieldOption[];
  placeholder?: string;
  min?: number;
  max?: number;
  unit?: string;
  readOnly?: boolean;
}

export default function SettingField({
  label,
  hint,
  type = 'text',
  value,
  onChange,
  options = [],
  placeholder = '',
  min,
  max,
  unit,
  readOnly = false,
}: Props) {
  const baseInput =
    'w-full border border-stone-200 rounded-md px-3 py-2 text-sm text-stone-800 focus:outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332]/20 transition-colors bg-white disabled:bg-[#f5f5f5] disabled:text-stone-400';

  // --- image_upload type ---
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const ext = file.name.split('.').pop();
      const fileName = `hero-bg-${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from('property-images')
        .upload(fileName, file, { upsert: true, contentType: file.type });
      if (error) throw error;
      const { data: urlData } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName);
      onChange(urlData.publicUrl);
    } catch {
      setUploadError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (type === 'image_upload') {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-700 block">{label}</label>

        {/* Preview */}
        {value && (
          <div className="relative w-full h-28 rounded-lg overflow-hidden bg-stone-100 border border-stone-200">
            <img
              src={value}
              alt="preview"
              className="w-full h-full object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors cursor-pointer"
              title="Remove image"
            >
              <i className="ri-close-line text-xs" />
            </button>
          </div>
        )}

        {/* Upload button */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || readOnly}
            className="flex items-center gap-2 px-4 py-2 bg-[#1B4332] text-white text-sm rounded-md hover:bg-[#163828] disabled:opacity-60 cursor-pointer whitespace-nowrap transition-colors"
          >
            {uploading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <i className="ri-upload-cloud-2-line text-base" />
                {value ? 'Replace Image' : 'Upload from Device'}
              </>
            )}
          </button>
          {value && (
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="or paste URL…"
              className={`${baseInput} flex-1 text-xs`}
            />
          )}
        </div>

        {!value && (
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="or paste a URL directly…"
            className={baseInput}
          />
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />

        {uploadError && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <i className="ri-error-warning-line" /> {uploadError}
          </p>
        )}
        {hint && <p className="text-xs text-stone-400">{hint}</p>}
      </div>
    );
  }

  if (type === 'toggle') {
    return (
      <div className="flex items-start justify-between gap-4 py-3 border-b border-stone-100 last:border-0">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-stone-700">{label}</p>
          {hint && <p className="text-xs text-stone-400 mt-0.5">{hint}</p>}
        </div>
        <button
          type="button"
          onClick={() => !readOnly && onChange(value === 'true' ? 'false' : 'true')}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
            value === 'true' ? 'bg-[#1B4332]' : 'bg-stone-200'
          } ${readOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              value === 'true' ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    );
  }

  if (type === 'select') {
    return (
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-stone-700 block">{label}</label>
        <select
          value={value}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
          disabled={readOnly}
          className={baseInput}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {hint && <p className="text-xs text-stone-400">{hint}</p>}
      </div>
    );
  }

  if (type === 'radio') {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-700 block">{label}</label>
        <div className="space-y-2">
          {options.map((o) => (
            <label key={o.value} className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => !readOnly && onChange(o.value)}
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                  value === o.value ? 'border-[#1B4332] bg-[#1B4332]' : 'border-stone-300 bg-white'
                } ${readOnly ? 'opacity-50' : 'cursor-pointer'}`}
              >
                {value === o.value && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <span className="text-sm text-stone-700">{o.label}</span>
            </label>
          ))}
        </div>
        {hint && <p className="text-xs text-stone-400 mt-1">{hint}</p>}
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-stone-700 block">{label}</label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={readOnly}
          placeholder={placeholder}
          rows={3}
          className={`${baseInput} resize-y`}
        />
        {hint && <p className="text-xs text-stone-400">{hint}</p>}
      </div>
    );
  }

  if (type === 'color') {
    return (
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-stone-700 block">{label}</label>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="color"
              value={value || '#000000'}
              onChange={(e) => onChange(e.target.value)}
              disabled={readOnly}
              className="w-10 h-10 rounded border border-stone-200 p-0.5 cursor-pointer"
            />
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={readOnly}
            placeholder="#000000"
            className={`${baseInput} flex-1 uppercase`}
          />
        </div>
        {hint && <p className="text-xs text-stone-400">{hint}</p>}
      </div>
    );
  }

  if (type === 'image_url') {
    return (
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-stone-700 block">{label}</label>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={readOnly}
          placeholder="https://..."
          className={baseInput}
        />
        {value && (
          <div className="relative w-full h-20 rounded overflow-hidden bg-stone-100 border border-stone-200">
            <img
              src={value}
              alt="preview"
              className="w-full h-full object-contain"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        )}
        {hint && <p className="text-xs text-stone-400">{hint}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-stone-700 block">{label}</label>
      <div className={unit ? 'flex items-center gap-2' : undefined}>
        <input
          type={type === 'number' ? 'number' : type === 'url' ? 'url' : type === 'email' ? 'email' : type === 'tel' ? 'tel' : 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={readOnly}
          placeholder={placeholder}
          min={min}
          max={max}
          className={`${baseInput} ${unit ? 'flex-1' : ''}`}
        />
        {unit && <span className="text-sm text-stone-500 shrink-0">{unit}</span>}
      </div>
      {hint && <p className="text-xs text-stone-400">{hint}</p>}
    </div>
  );
}
