"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom"; // 👈 Added React Portal import
import { X } from "lucide-react";
import LoginForm from "./loginform";
import RegisterForm from "./register";

type Tab = "login" | "register";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: Tab;
  onLoginSuccess?: () => void;
}

const AuthModal = ({
  isOpen,
  onClose,
  defaultTab = "login",
  onLoginSuccess,
}: AuthModalProps) => {
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [mounted, setMounted] = useState(false); // 👈 Track mounting to prevent SSR issues
  const overlayRef = useRef<HTMLDivElement>(null);
  const prevOpenRef = useRef(false);

  // Handle client-side mount check for Next.js SSR safety
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen && !prevOpenRef.current) setTab(defaultTab);
    prevOpenRef.current = isOpen;
  }, [isOpen, defaultTab]);

  // If the modal isn't open or isn't running on the client yet, render nothing
  if (!isOpen || !mounted) return null;

  const handleLoginSuccess = () => {
    if (onLoginSuccess) {
      onLoginSuccess();
    }
    onClose();
  };

  // The modal layout content
  const modalContent = (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm"
      style={{ animation: "fadeIn .18s ease" }}
    >
      <div
        className="relative flex w-full max-w-[480px] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl"
        style={{ animation: "slideUp .22s cubic-bezier(.16,1,.3,1)" }}
      >
        <div className="hidden w-1.5 flex-shrink-0 bg-black sm:block" />

        <div className="flex flex-1 flex-col">
          <div className="flex items-center border-b border-gray-100 px-7 pt-5">
            {(["login", "register"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`mr-6 pb-3 text-[13px] font-medium uppercase tracking-wide transition-colors ${
                  tab === t
                    ? "border-b-[1.5px] border-black text-black"
                    : "text-gray-300 hover:text-gray-500"
                }`}
              >
                {t === "login" ? "Sign in" : "Register"}
              </button>
            ))}
          </div>

          <div className="px-7 py-6">
            {tab === "login" ? (
              <LoginForm
                onSwitchToRegister={() => setTab("register")}
                onSuccess={handleLoginSuccess}
              />
            ) : (
              <RegisterForm
                onSwitchToLogin={() => setTab("login")}
                onSuccess={() => setTab("login")}
              />
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-md p-1 text-gray-300 transition-colors hover:text-black"
        >
          <X size={16} />
        </button>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(14px) scale(.985) }
          to   { opacity: 1; transform: translateY(0) scale(1) }
        }
      `}</style>
    </div>
  );

  // 3. Render the modal directly into the document body
  return createPortal(modalContent, document.body);
};

export default AuthModal;
