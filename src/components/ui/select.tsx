"use client";

import {
  Children,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import type {
  ChangeEvent,
  KeyboardEvent,
  OptionHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";

/** 트리거 버튼·레거시 호환용 클래스명 */
export const selectSurfaceClass =
  "w-full rounded-lg border border-amber-900/15 bg-white py-2 pl-3 pr-10 text-left text-sm font-medium text-amber-950 outline-none transition-[border-color,box-shadow] hover:border-amber-900/25 focus:border-amber-900/25 focus:ring-2 focus:ring-amber-400/40 disabled:cursor-not-allowed disabled:opacity-50";

type OptionItem = { value: string; label: ReactNode; disabled?: boolean };

function optionsFromChildren(children: ReactNode): OptionItem[] {
  const out: OptionItem[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (child.type !== "option") return;
    const p = child.props as OptionHTMLAttributes<HTMLOptionElement>;
    out.push({
      value: String(p.value ?? ""),
      label: p.children,
      disabled: !!p.disabled,
    });
  });
  return out;
}

function syntheticChange(value: string): ChangeEvent<HTMLSelectElement> {
  return {
    target: { value } as HTMLSelectElement,
    currentTarget: { value } as HTMLSelectElement,
  } as ChangeEvent<HTMLSelectElement>;
}

export type SelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "className" | "size"
> & {
  /** 래퍼 — 여백·너비 */
  className?: string;
};

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  function Select(
    {
      className = "",
      children,
      value,
      onChange,
      disabled,
      id: idProp,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      ...rest
    },
    ref,
  ) {
    const autoId = useId();
    const listboxId = `${autoId}-listbox`;
    const buttonId = idProp ?? `${autoId}-trigger`;

    const options = useMemo(() => optionsFromChildren(children), [children]);
    const valueStr = String(value ?? "");
    const selected = options.find((o) => o.value === valueStr);
    const label = selected?.label ?? "선택…";

    const [open, setOpen] = useState(false);
    const [highlight, setHighlight] = useState(0);
    const [mounted, setMounted] = useState(false);
    const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

    const wrapRef = useRef<HTMLDivElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

    useEffect(() => setMounted(true), []);

    const updatePosition = useCallback(() => {
      const el = btnRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setPos({ top: r.bottom + 4, left: r.left, width: r.width });
    }, []);

    useLayoutEffect(() => {
      if (!open) return;
      updatePosition();
    }, [open, updatePosition]);

    useEffect(() => {
      if (!open) return;
      const onScrollOrResize = () => updatePosition();
      window.addEventListener("scroll", onScrollOrResize, true);
      window.addEventListener("resize", onScrollOrResize);
      return () => {
        window.removeEventListener("scroll", onScrollOrResize, true);
        window.removeEventListener("resize", onScrollOrResize);
      };
    }, [open, updatePosition]);

    useEffect(() => {
      if (!open) return;
      function onDoc(e: MouseEvent) {
        const t = e.target as Node;
        if (wrapRef.current?.contains(t)) return;
        if (listRef.current?.contains(t)) return;
        setOpen(false);
      }
      document.addEventListener("mousedown", onDoc);
      return () => document.removeEventListener("mousedown", onDoc);
    }, [open]);

    const enabledIndices = useMemo(() => {
      const idx: number[] = [];
      options.forEach((o, i) => {
        if (!o.disabled) idx.push(i);
      });
      return idx;
    }, [options]);

    useEffect(() => {
      if (!open) return;
      const selIdx = options.findIndex((o) => o.value === valueStr);
      const next =
        selIdx >= 0
          ? enabledIndices.includes(selIdx)
            ? selIdx
            : enabledIndices[0] ?? 0
          : enabledIndices[0] ?? 0;
      setHighlight(next);
    }, [open, valueStr, options, enabledIndices]);

    useEffect(() => {
      if (!open) return;
      const el = optionRefs.current[highlight];
      el?.scrollIntoView({ block: "nearest" });
    }, [highlight, open]);

    function pickIndex(i: number) {
      const o = options[i];
      if (!o || o.disabled) return;
      onChange?.(syntheticChange(o.value));
      setOpen(false);
      btnRef.current?.focus();
    }

    function moveHighlight(delta: number) {
      if (options.length === 0) return;
      let i = highlight;
      for (let step = 0; step < options.length + 1; step++) {
        i = (i + delta + options.length) % options.length;
        if (!options[i]?.disabled) {
          setHighlight(i);
          return;
        }
      }
    }

    const onBtnKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (!open) {
          setOpen(true);
          return;
        }
        moveHighlight(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (!open) {
          setOpen(true);
          return;
        }
        moveHighlight(-1);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (open) pickIndex(highlight);
        else setOpen(true);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      } else if (e.key === "Home" && open) {
        e.preventDefault();
        const first = enabledIndices[0];
        if (first != null) setHighlight(first);
      } else if (e.key === "End" && open) {
        e.preventDefault();
        const last = enabledIndices[enabledIndices.length - 1];
        if (last != null) setHighlight(last);
      }
    };

    const listbox = (
      <ul
        ref={listRef}
        id={listboxId}
        role="listbox"
        aria-activedescendant={`${listboxId}-opt-${highlight}`}
        className="fixed z-[9999] max-h-60 overflow-y-auto rounded-lg border border-amber-900/15 bg-white py-1 shadow-lg outline-none ring-1 ring-amber-950/5"
        style={{
          top: pos.top,
          left: pos.left,
          width: Math.max(pos.width, 120),
        }}
      >
        {options.map((o, i) => {
          const selectedOpt = o.value === valueStr;
          const active = i === highlight;
          return (
            <li
              key={`${o.value}-${i}`}
              ref={(el) => {
                optionRefs.current[i] = el;
              }}
              id={`${listboxId}-opt-${i}`}
              role="option"
              aria-selected={selectedOpt}
              aria-disabled={o.disabled}
              tabIndex={-1}
              className={`cursor-pointer px-3 py-1.5 text-sm font-medium leading-snug transition-colors ${
                o.disabled
                  ? "cursor-not-allowed text-amber-900/35"
                  : active
                    ? "bg-amber-100 text-amber-950"
                    : selectedOpt
                      ? "bg-amber-50/90 text-amber-950"
                      : "text-amber-950 hover:bg-amber-50"
              }`}
              onMouseEnter={() => !o.disabled && setHighlight(i)}
              onMouseDown={(e) => {
                e.preventDefault();
                if (!o.disabled) pickIndex(i);
              }}
            >
              {o.label}
            </li>
          );
        })}
      </ul>
    );

    return (
      <div ref={wrapRef} className={`relative w-full ${className}`}>
        <button
          ref={(node) => {
            (btnRef as React.MutableRefObject<HTMLButtonElement | null>).current =
              node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          type="button"
          id={buttonId}
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-haspopup="listbox"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          disabled={disabled}
          className={`${selectSurfaceClass} relative`}
          onClick={() => !disabled && setOpen((o) => !o)}
          onKeyDown={onBtnKeyDown}
        >
          <span className="block min-w-0 truncate pr-1 text-left">{label}</span>
          <span
            className={`pointer-events-none absolute inset-y-0 right-0 flex w-9 items-center justify-center text-amber-900/40 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
            aria-hidden
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </button>

        {/* 숨김: 폼·접근성 도구 호환 */}
        <select
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          value={valueStr}
          onChange={() => {}}
          {...rest}
        >
          {children}
        </select>

        {mounted && open ? createPortal(listbox, document.body) : null}
      </div>
    );
  },
);

Select.displayName = "Select";
