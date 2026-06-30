// website/src/components/LoginForm.tsx
"use client";

import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import {
  FieldLabel,
  InputField,
  PasswordField,
  SubmitButton,
  ErrorBanner,
  SwitchText,
} from "./auth-ui";
import { useCartStore } from "../hooks/useCartStore";
import { loginUser, persistAuthSession } from "../services/auth.service";

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onSuccess: () => void;
}

const LoginForm = ({ onSwitchToRegister, onSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const fetchCart = useCartStore((s) => s.fetchCart);
  const syncLocalCart = useCartStore((s) => s.syncLocalCart);

  const { mutate, isPending, error } = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      persistAuthSession(data);
      await syncLocalCart();
      await fetchCart();
      window.dispatchEvent(new Event("auth_change"));
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email, password });
  };

  const errorMessage =
    error instanceof Error ? error.message : error ? "Something went wrong" : null;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <p className="text-[20px] font-medium tracking-tight text-black">Welcome back</p>
        <p className="mt-0.5 text-[13px] font-light text-gray-400">
          Sign in to continue to your account
        </p>
      </div>

      {errorMessage && <ErrorBanner message={errorMessage} />}

      <div className="mt-2 flex flex-col gap-3">
        <div>
          <FieldLabel>Email</FieldLabel>
          <InputField
            icon={<Mail size={14} />}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <FieldLabel>Password</FieldLabel>
          <PasswordField
            icon={<Lock size={14} />}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="text-[12px] text-gray-400 hover:text-black transition-colors"
          >
            Forgot password?
          </button>
        </div>
      </div>

      <div className="mt-2 flex flex-col gap-3">
        <SubmitButton loading={isPending} label="Sign in" />
        <SwitchText
          label="No account?"
          actionLabel="Create one"
          onAction={onSwitchToRegister}
        />
      </div>
    </form>
  );
};

export default LoginForm;