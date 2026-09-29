import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import Fuse from 'fuse.js';
import { Package, Search, ChevronDown, Check } from 'lucide-react';
import { useTranslation } from '../translations';
import { useBackHandler } from '../native/backHandler';
import { getImageRefs, refsToThumbs } from '../utils/imageUtils';

// "No box" is a real choice, not an absence; see BulkActionModal.
const NO_BOX = { id: '' };

/** "Коледна украса / мазе": two boxes may share a name, so the place goes with it. */
const boxLabel = (box) => (box.location ? `${box.name} / ${box.location}` : box.name);

/**
 * Which box an item is in: a field you type into to narrow the boxes, then
 * pick one.
 *
 * It replaced a native `<select>`, which on a phone is a full-screen wheel
 * scrolled by hand: fine for five boxes, not for fifty. Fuzzy, on name and
 * location, with the same engine as every other search in the app, so a typo
 * still finds the box.
 *
 * Tapping the field raises the keyboard, because typing is the point; the
 * chevron opens the list without it, for someone who would rather scroll. A
 * tap on a row hands focus to the chevron, so the keyboard goes away with the
 * choice made, and Tab carries on from here (the same reasoning as TagInput's
 * chips). Enter picks the highlighted row, which is the best match once
 * something is typed.
 */
export function BoxPicker({ value, onChange, boxes = [] }) {
    const { t, lang } = useTranslation();
    const id = useId();
    const wrapRef = useRef(null);
    const toggleRef = useRef(null);
    const listRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [active, setActive] = useState(0);

    const collator = useMemo(() => new Intl.Collator(lang, { sensitivity: 'base', numeric: true }), [lang]);
    const sorted = useMemo(
        () => [...boxes].sort((a, b) => collator.compare(boxLabel(a), boxLabel(b))),
        [boxes, collator]
    );
    const fuse = useMemo(() => new Fuse(boxes, { keys: ['name', 'location'], threshold: 0.3 }), [boxes]);

    const q = query.trim();
    // Unsearched, "no box" leads and the boxes follow A-Я; a search keeps
    // Fuse's relevance order, so the first row is the one Enter picks.
    const options = useMemo(
        () => (q ? fuse.search(q).map(r => r.item) : [NO_BOX, ...sorted]),
        [q, fuse, sorted]
    );

    const selected = boxes.find(b => b.id === value);
    const selectedLabel = selected ? boxLabel(selected) : value ? t('box.unknown') : t('box.unassignedOption');

    const openList = () => {
        setQuery('');
        setActive(Math.max(0, [NO_BOX, ...sorted].findIndex(o => o.id === value)));
        setOpen(true);
    };

    const close = useCallback(() => {
        setOpen(false);
        setQuery('');
    }, []);

    // Android Back closes the list before it closes the modal.
    useBackHandler(open, close);

    const pick = (option, byKeyboard) => {
        onChange(option.id);
        close();
        if (!byKeyboard) toggleRef.current?.focus({ preventScroll: true });
    };

    // Keep the highlighted row in view, scrolling the list only, not the
    // modal behind it, which would jump under the keyboard.
    useEffect(() => {
        const list = listRef.current;
        const row = list?.querySelector(`[data-index="${active}"]`);
        if (!row) return;
        if (row.offsetTop < list.scrollTop) {
            list.scrollTop = row.offsetTop;
        } else if (row.offsetTop + row.offsetHeight > list.scrollTop + list.clientHeight) {
            list.scrollTop = row.offsetTop + row.offsetHeight - list.clientHeight;
        }
    }, [active, open]);

    const handleKeyDown = (e) => {
        if (e.nativeEvent.isComposing) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (!open) openList();
            else setActive(i => Math.min(i + 1, options.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActive(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter' && open) {
            e.preventDefault();
            if (options[active]) pick(options[active], true);
        } else if (e.key === 'Escape' && open) {
            // Stop here, or the modal's Escape listener closes the whole form.
            e.preventDefault();
            e.stopPropagation();
            close();
        }
    };

    const optionId = (index) => `${id}-opt-${index}`;

    return (
        <div
            ref={wrapRef}
            className="relative"
            // On the wrapper, not the input: the list can be open with focus on
            // the chevron, and Escape there must not close the whole modal.
            onKeyDown={handleKeyDown}
            onBlur={(e) => {
                if (!wrapRef.current?.contains(e.relatedTarget)) close();
            }}
        >
            <label htmlFor={`${id}-input`} className="block text-sm font-medium text-muted mb-1">
                {t('box.label')}
            </label>
            <div className="relative">
                {open ? (
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" aria-hidden="true" />
                ) : (
                    <Package size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" aria-hidden="true" />
                )}
                <input
                    id={`${id}-input`}
                    type="text"
                    role="combobox"
                    aria-expanded={open}
                    aria-controls={`${id}-list`}
                    aria-autocomplete="list"
                    aria-activedescendant={open && options[active] ? optionId(active) : undefined}
                    value={open ? query : selectedLabel}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setActive(0);
                        setOpen(true);
                    }}
                    onClick={() => { if (!open) openList(); }}
                    className="input pl-9 pr-11 truncate"
                    placeholder={t('box.search')}
                    autoComplete="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    enterKeyHint="go"
                />
                <button
                    ref={toggleRef}
                    type="button"
                    tabIndex={-1}
                    onClick={() => (open ? close() : openList())}
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-2.5 text-muted hover:text-content"
                    aria-label={t('box.label')}
                    aria-expanded={open}
                    aria-controls={`${id}-list`}
                >
                    <ChevronDown size={18} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {open && (
                <div
                    ref={listRef}
                    id={`${id}-list`}
                    role="listbox"
                    aria-label={t('box.label')}
                    className="box-picker__list"
                    // Keep focus where it is: a tap on a row must not blur the
                    // field (and close the list) before the click lands.
                    onPointerDown={(e) => e.preventDefault()}
                >
                    {options.map((option, index) => {
                        const isSelected = option.id === value;
                        const thumb = option === NO_BOX ? null : refsToThumbs(getImageRefs(option))[0];
                        return (
                            <div
                                key={option.id || 'none'}
                                id={optionId(index)}
                                data-index={index}
                                role="option"
                                aria-selected={isSelected}
                                onClick={() => pick(option, false)}
                                onPointerMove={() => setActive(index)}
                                className={`picker-row cursor-pointer ${isSelected ? 'picker-row--on' : ''} ${index === active ? 'box-picker__row--active' : ''}`}
                            >
                                {thumb ? (
                                    <img src={thumb} alt="" className="picker-row__thumb" />
                                ) : (
                                    <span className="picker-row__thumb flex items-center justify-center text-muted">
                                        <Package size={18} />
                                    </span>
                                )}
                                <span className="flex-1 min-w-0 text-sm font-medium text-content line-clamp-2 break-words">
                                    {option === NO_BOX ? t('box.unassignedOption') : (
                                        <>
                                            {option.name}
                                            {option.location && (
                                                <span className="font-normal text-muted"> / {option.location}</span>
                                            )}
                                        </>
                                    )}
                                </span>
                                {isSelected && <Check size={18} className="shrink-0 text-primary" />}
                            </div>
                        );
                    })}

                    {options.length === 0 && (
                        <p className="px-3 py-4 text-sm text-muted text-center">
                            {t('search.noMatchFor', { query: q })}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
