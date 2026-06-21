"use client";

import { useState, useCallback } from "react";
import { Mail, Lock, User, ShoppingCart, Store } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import {
  FieldLabel,
  InputField,
  PasswordField,
  SubmitButton,
  ErrorBanner,
  SwitchText,
} from "./auth-ui";

import { registerUser, type Role } from "../services/auth.service";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onSuccess: () => void;
}

const ROLE_OPTIONS: {
  value: Role;
  label: string;
  Icon: React.ElementType;
}[] = [
  {
    value: "USER",
    label: "Customer",
    Icon: ShoppingCart,
  },
  {
    value: "SELLER",
    label: "Seller",
    Icon: Store,
  },
];

export default function RegisterForm({
  onSwitchToLogin,
  onSuccess,
}: RegisterFormProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "USER" as Role,
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  const { mutate, isPending, error } = useMutation({
    mutationFn: registerUser,
    onSuccess,
  });

  const updateField = useCallback((field: keyof typeof form, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setValidationError(null);

      if (form.password !== form.confirmPassword) {
        setValidationError("Passwords do not match");
        return;
      }

      mutate({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
    },
    [form, mutate],
  );

  const errorMessage =
    validationError ||
    (error instanceof Error
      ? error.message
      : error
        ? "Something went wrong"
        : null);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <h2 className="text-[20px] font-medium tracking-tight text-black">
          Create account
        </h2>
        <p className="mt-0.5 text-[13px] font-light text-gray-400">
          Join as a customer or seller
        </p>
      </div>

      {errorMessage && <ErrorBanner message={errorMessage} />}

      <div className="mt-2 flex flex-col gap-3">
        <div>
          <FieldLabel>Full name</FieldLabel>
          <InputField
            icon={<User size={14} />}
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            required
          />
        </div>

        <div>
          <FieldLabel>Email</FieldLabel>
          <InputField
            icon={<Mail size={14} />}
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            required
          />
        </div>

        <div>
          <FieldLabel>Password</FieldLabel>
          <PasswordField
            icon={<Lock size={14} />}
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
            required
          />
        </div>

        <div>
          <FieldLabel>Confirm password</FieldLabel>
          <PasswordField
            icon={<Lock size={14} />}
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={(e) => updateField("confirmPassword", e.target.value)}
            required
          />
        </div>

        <div>
          <FieldLabel>I am a</FieldLabel>

          <div className="flex gap-2">
            {ROLE_OPTIONS.map(({ value, label, Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => updateField("role", value)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-md border py-2 text-[12px] font-medium transition-all ${
                  form.role === value
                    ? "border-black bg-black text-white"
                    : "border-gray-200 text-gray-400 hover:border-gray-400"
                }`}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-2 flex flex-col gap-3">
        <SubmitButton loading={isPending} label="Create account" />

        <SwitchText
          label="Already have an account?"
          actionLabel="Sign in"
          onAction={onSwitchToLogin}
        />
      </div>
    </form>
  );
}
