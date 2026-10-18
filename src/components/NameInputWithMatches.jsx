import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import Fuse from 'fuse.js';
import { Package, ChevronRight } from 'lucide-react';
import { useBackHandler } from '../native/backHandler';
import { getImageRefs, refsToThumbs } from '../utils/imageUtils';

const MIN_QUERY = 2;
const MAX_MATCHES = 5;

/**
 * The name field of a create form, with the existing boxes or items whose
 * names look like what is being typed listed under it, so "Зимно яке" is
 * opened rather than created a second time.
 *
 * A hint, not a gate: the form's own button still creates, and Enter still
 * submits unless the arrows have reached a row first. Not an autocomplete
 * either, which is why the list is headed by `heading` ("you already have")
 * and a pick opens the existing entry instead of filling in the field.
 * `heading` is a function of the number of matches, for the plural.
 *
 * Fuzzy on the name only, so a typo still finds the duplicate;
 * `ignoreLocation` because a long name is as likely to match in the middle as
 * at the start. Combobox mechanics follow BoxPicker.
 */
export function NameInputWithMatches({
    label,
    value,
    onChange,
    placeholder,
    candidates = [],
    heading,
    renderLabel,
    onPick,
}) {
    const id = useId();
    const wrapRef = useRef(null);
    const listRef = useRef(null);
    const [focused, setFocused] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    // -1 = nothing highlighted, so Enter submits the form as before. Only the
    // arrows move it (no hover tracking, unlike BoxPicker): a pointer resting
    // on a row must not turn Enter into "open this one".
    const [active, setActive] = useState(-1);

    const fuse = useMemo(
        () => new Fuse(candidates, { keys: ['name'], threshold: 0.3, ignoreLocation: true }),
        [candidates]
    );

    const q = value.trim();
    const matches = useMemo(
        () => (q.length >= MIN_QUERY ? fuse.search(q, { limit: MAX_MATCHES }).map(r => r.item) : []),
        [q, fuse]
    );

    const open = focused && !dismissed && matches.length > 0;

    const close = useCallback(() => {
        setDismissed(true);
        setActive(-1);
    }, []);

    // Android Back closes the list before it closes the modal.
    useBackHandler(open, close);

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
            if (!matches.length) return;
            e.preventDefault();
            setDismissed(false);
            setActive(i => (open ? Math.min(i + 1, matches.length - 1) : 0));
        } else if (e.key === 'ArrowUp' && open) {
            e.preventDefault();
            setActive(i => Math.max(i - 1, -1));
        } else if (e.key === 'Enter' && open && matches[active]) {
            e.preventDefault();
            onPick(matches[active]);
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
            onFocus={() => setFocused(true)}
            onBlur={(e) => {
                if (!wrapRef.current?.contains(e.relatedTarget)) {
                    setFocused(false);
                    setActive(-1);
                }
            }}
        >
            <label htmlFor={`${id}-input`} className="block text-sm font-medium text-muted mb-1">
                {label}
            </label>
            <input
                id={`${id}-input`}
                type="text"
                required
                role="combobox"
                aria-expanded={open}
                aria-controls={`${id}-list`}
                aria-autocomplete="list"
                aria-activedescendant={open && matches[active] ? optionId(active) : undefined}
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    setDismissed(false);
                    setActive(-1);
                }}
                onKeyDown={handleKeyDown}
                className="input"
                placeholder={placeholder}
            />

            {open && (
                <div
                    ref={listRef}
                    id={`${id}-list`}
                    role="listbox"
                    aria-label={heading(matches.length)}
                    className="box-picker__list"
                    // Keep focus where it is: a tap on a row must not blur the
                    // field (and close the list) before the click lands.
                    onPointerDown={(e) => e.preventDefault()}
                >
                    <div aria-hidden="true" className="px-2 pt-1.5 pb-1 text-xs font-semibold uppercase tracking-wider text-muted">
                        {heading(matches.length)}
                    </div>
                    {matches.map((entry, index) => {
                        const thumb = refsToThumbs(getImageRefs(entry))[0];
                        return (
                            <div
                                key={entry.id}
                                id={optionId(index)}
                                data-index={index}
                                role="option"
                                aria-selected={index === active}
                                onClick={() => onPick(entry)}
                                className={`picker-row cursor-pointer ${index === active ? 'box-picker__row--active' : ''}`}
                            >
                                {thumb ? (
                                    <img src={thumb} alt="" className="picker-row__thumb" />
                                ) : (
                                    <span className="picker-row__thumb flex items-center justify-center text-muted">
                                        <Package size={18} />
                                    </span>
                                )}
                                <span className="flex-1 min-w-0">{renderLabel(entry)}</span>
                                <ChevronRight size={18} className="shrink-0 text-muted" aria-hidden="true" />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
