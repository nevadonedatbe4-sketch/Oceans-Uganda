import { useRef, useEffect, useState, useCallback } from 'react';

/* ── Styles injected once ─────────────────────────────────── */
const EDITOR_STYLES = `
.rich-editor-content b,
.rich-editor-content strong { font-weight: 700 !important; }
.rich-editor-content i,
.rich-editor-content em { font-style: italic !important; }
.rich-editor-content u { text-decoration: underline !important; }
.rich-editor-content span[style*="font-size"] { line-height: 1.4; }
`;

const FONT_OPTIONS = [
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Playfair', value: '"Playfair Display", serif' },
  { label: 'Roboto', value: 'Roboto, sans-serif' },
  { label: 'Jost', value: 'Jost, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Courier', value: '"Courier New", monospace' },
];

const SIZE_OPTIONS = [
  { label: 'Small', value: '12px', cmd: 'fontSize', arg: '2' },
  { label: 'Normal', value: '14px', cmd: 'fontSize', arg: '3' },
  { label: 'Large', value: '18px', cmd: 'fontSize', arg: '5' },
  { label: 'XL', value: '24px', cmd: 'fontSize', arg: '6' },
];

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  className?: string;
}

function ToolbarButton({
  icon,
  active,
  onClick,
  title,
}: {
  icon: string;
  active?: boolean;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`w-7 h-7 flex items-center justify-center rounded-md transition-all cursor-pointer ${
        active
          ? 'bg-[#0d5959] text-white'
          : 'bg-white/80 text-[#7a8a99] hover:bg-white hover:text-[#0d1f2d]'
      }`}
    >
      <i className={`${icon} text-xs`} />
    </button>
  );
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  rows = 8,
  maxLength,
  className = '',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeCommands, setActiveCommands] = useState<Set<string>>(new Set());
  const [currentFont, setCurrentFont] = useState(FONT_OPTIONS[0].value);
  const [currentSize, setCurrentSize] = useState(SIZE_OPTIONS[1].value);
  const [charCount, setCharCount] = useState(0);
  const hasInsertedStyles = useRef(false);

  /* Insert CSS once */
  useEffect(() => {
    if (hasInsertedStyles.current) return;
    const style = document.createElement('style');
    style.textContent = EDITOR_STYLES;
    document.head.appendChild(style);
    hasInsertedStyles.current = true;
  }, []);

  /* Sync external value → editor */
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    // Only overwrite if the user isn't actively editing AND the value differs
    if (document.activeElement === el) return;
    if (el.innerHTML !== value) {
      el.innerHTML = value || '';
    }
  }, [value]);

  /* Update char count whenever content changes */
  const updateStats = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const text = el.innerText || '';
    setCharCount(text.length);
  }, []);

  const handleInput = () => {
    const el = editorRef.current;
    if (!el) return;
    updateStats();
    onChange(el.innerHTML);
  };

  const execCmd = useCallback(
    (command: string, valueArg: string | undefined = undefined) => {
      const el = editorRef.current;
      if (!el) return;
      el.focus();
      document.execCommand(command, false, valueArg);
      handleInput();
      refreshToolbar();
    },
    [onChange]
  );

  const refreshToolbar = useCallback(() => {
    const next = new Set<string>();
    try {
      if (document.queryCommandState('bold')) next.add('bold');
      if (document.queryCommandState('italic')) next.add('italic');
      if (document.queryCommandState('underline')) next.add('underline');
    } catch {
      // ignore
    }
    setActiveCommands(next);
  }, []);

  const handleFontChange = (font: string) => {
    setCurrentFont(font);
    execCmd('fontName', font);
  };

  const handleSizeChange = (sizeLabel: string) => {
    const opt = SIZE_OPTIONS.find((s) => s.value === sizeLabel);
    if (!opt) return;
    setCurrentSize(sizeLabel);
    execCmd('fontSize', opt.arg);
  };

  /* Placeholder handling */
  const showPlaceholder = !value || value === '<br>' || value === '<div><br></div>';

  const editorHeight = rows * 24;

  return (
    <div className={`relative ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
        {/* Formatting */}
        <ToolbarButton
          icon="ri-bold"
          active={activeCommands.has('bold')}
          onClick={() => execCmd('bold')}
          title="Bold"
        />
        <ToolbarButton
          icon="ri-italic"
          active={activeCommands.has('italic')}
          onClick={() => execCmd('italic')}
          title="Italic"
        />
        <ToolbarButton
          icon="ri-underline"
          active={activeCommands.has('underline')}
          onClick={() => execCmd('underline')}
          title="Underline"
        />

        <div className="w-px h-5 bg-[#e8edf2] mx-1" />

        {/* Font family */}
        <div className="relative">
          <select
            value={currentFont}
            onChange={(e) => handleFontChange(e.target.value)}
            className="text-xs font-medium text-[#0d1f2d] bg-white border-2 border-[#e8edf2] rounded-md px-2 py-1 outline-none focus:border-[#0d5959] cursor-pointer appearance-none pr-6"
            style={{ fontFamily: currentFont }}
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                {f.label}
              </option>
            ))}
          </select>
          <i className="ri-arrow-down-s-line absolute right-1.5 top-1/2 -translate-y-1/2 text-xs text-[#7a8a99] pointer-events-none" />
        </div>

        {/* Font size */}
        <div className="relative">
          <select
            value={currentSize}
            onChange={(e) => handleSizeChange(e.target.value)}
            className="text-xs font-medium text-[#0d1f2d] bg-white border-2 border-[#e8edf2] rounded-md px-2 py-1 outline-none focus:border-[#0d5959] cursor-pointer appearance-none pr-6"
          >
            {SIZE_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <i className="ri-arrow-down-s-line absolute right-1.5 top-1/2 -translate-y-1/2 text-xs text-[#7a8a99] pointer-events-none" />
        </div>
      </div>

      {/* Editable area */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onKeyUp={refreshToolbar}
          onMouseUp={refreshToolbar}
          onFocus={refreshToolbar}
          className="rich-editor-content w-full text-sm font-medium border-2 border-[#e8edf2] px-4 py-3 text-[#0d1f2d] outline-none focus:border-[#0d5959] focus:ring-4 focus:ring-[#0d5959]/10 transition-all bg-white resize-y overflow-auto"
          style={{ minHeight: `${editorHeight}px` }}
          suppressContentEditableWarning
        />
        {showPlaceholder && placeholder && (
          <div className="absolute top-3 left-4 pointer-events-none text-[#b0bec5] text-sm font-normal select-none">
            {placeholder}
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="flex justify-end mt-1 gap-3">
        {maxLength && (
          <span className="text-xs text-[#7a8a99] font-semibold">
            {charCount}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}