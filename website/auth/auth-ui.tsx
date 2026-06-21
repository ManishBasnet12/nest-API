"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

// ─── Field Label ─────────────────────────────────────────────────────────────

export const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.4px] text-gray-400">
    {children}
  </p>
);

// ─── Input Field ─────────────────────────────────────────────────────────────

export const InputField = ({
  icon,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { icon: React.ReactNode }) => (
  <div className="flex h-10 items-center gap-2 rounded-md border border-gray-200 px-3 transition-colors focus-within:border-black">
    <span className="shrink-0 text-gray-300">{icon}</span>
    <input
      {...props}
      className="flex-1 bg-transparent text-[13px] text-black placeholder-gray-300 outline-none"
    />
  </div>
);

// ─── Password Field ───────────────────────────────────────────────────────────

export const PasswordField = ({
  placeholder,
  value,
  onChange,
  required,
  icon,
}: {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  icon: React.ReactNode;
}) => {
  const [show, setShow] = useState(false);
  return (
    <div className="flex h-10 items-center gap-2 rounded-md border border-gray-200 px-3 transition-colors focus-within:border-black">
      <span className="shrink-0 text-gray-300">{icon}</span>
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="flex-1 bg-transparent text-[13px] text-black placeholder-gray-300 outline-none"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="shrink-0 text-gray-300 transition-colors hover:text-black"
      >
        {show ? <Eye size={14} /> : <EyeOff size={14} />}
      </button>
    </div>
  );
};

// ─── Submit Button ────────────────────────────────────────────────────────────

export const SubmitButton = ({
  loading,
  label,
}: {
  loading: boolean;
  label: string;
}) => (
  <button
    type="submit"
    disabled={loading}
    className="group flex h-[42px] w-full items-center justify-center gap-2 rounded-md bg-black text-[13px] font-medium text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {loading ? (
      <Loader2 size={15} className="animate-spin" />
    ) : (
      <>
        {label}
        <ArrowRight
          size={14}
          className="transition-transform group-hover:translate-x-0.5"
        />
      </>
    )}
  </button>
);

// ─── Error Banner ─────────────────────────────────────────────────────────────

export const ErrorBanner = ({ message }: { message: string }) => (
  <div className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-[12px] text-red-500">
    {message}
  </div>
);

// ─── Switch Text ──────────────────────────────────────────────────────────────

export const SwitchText = ({
  label,
  actionLabel,
  onAction,
}: {
  label: string;
  actionLabel: string;
  onAction: () => void;
}) => (
  <p className="text-center text-[12px] text-gray-400">
    {label}{" "}
    <button
      type="button"
      onClick={onAction}
      className="font-medium text-black underline-offset-2 hover:underline"
    >
      {actionLabel}
    </button>
  </p>
);
