"use client";

import Link from "next/link";
import { User, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import AuthModal from "../../auth/authmodal";
import CartIcon from "../ui/carticon";
import { useCartStore } from "../../hooks/useCartStore";

interface StoredUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ─── Search ────────────────────────────────────────────────────────────────
  // Local state only — never synced back from URL while user is typing.
  // Initialized once from URL on mount.
  const [searchInput, setSearchInput] = useState(
    () => searchParams.get("q") || ""
  );

  // Only reset input when user leaves the search page entirely (logo click etc.)
  const prevPathRef = useRef(pathname);
  useEffect(() => {
    if (prevPathRef.current === "/search" && pathname !== "/search") {
      setSearchInput("");
    }
    prevPathRef.current = pathname;
  }, [pathname]);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    // Update input immediately — no URL involvement here
    setSearchInput(val);

    // Cancel any pending push
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const trimmed = val.trim();
      if (trimmed === "") {
        if (pathname === "/search") router.push("/search", { scroll: false });
      } else {
        router.push(`/search?q=${encodeURIComponent(trimmed)}&page=1`, {
          scroll: false,
        });
      }
    }, 350);
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);
  // ──────────────────────────────────────────────────────────────────────────

  const fetchCart = useCartStore((s) => s.fetchCart);
  const storeClearCart = useCartStore((s) => (s as any).clearCart);
  const clearCart =
    storeClearCart ||
    (() => {
      useCartStore.setState({ items: [], totalAmount: 0, itemCount: 0 });
    });

  const loadUserCart = (_userId?: number) => {
    if (fetchCart) fetchCart();
  };

  useEffect(() => {
    const syncUser = () => {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          const parsedUser = JSON.parse(stored);
          setUser(parsedUser);
          loadUserCart(parsedUser.id);
        } catch {
          localStorage.removeItem("user");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    syncUser();
    window.addEventListener("auth_change", syncUser);
    return () => window.removeEventListener("auth_change", syncUser);
  }, [fetchCart]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    clearCart();
    window.dispatchEvent(new Event("auth_change"));
    setDropdownOpen(false);
  };

  const firstLetter = user?.name?.charAt(0).toUpperCase() ?? "";

  return (
    <>
      <nav className="sticky top-0 z-50 w-full h-20 border-b border-gray-100 bg-gray-900 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-[24px] font-medium tracking-tight text-white"
            >
              STORE
            </Link>
          </div>

          {/* Search */}
          <div className="w-[stretch] h-12 relative flex items-center mx-10 group">
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Search anything..."
              className="w-full h-full pl-12 pr-4 py-3.5 bg-gray-200 hover:bg-white focus:bg-white border border-gray-900 text-gray-800 placeholder-gray-400 rounded outline-none shadow-sm transition-all duration-300 ease-out"
            />
            <svg
              className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-gray-900 transition-colors duration-300 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Right */}
          <div className="w-[270px]! flex items-center gap-1">
            <CartIcon />

            {user ? (
              <div ref={dropdownRef} className="relative ml-4">
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="flex h-8 items-center gap-2 rounded-full border border-gray-200 bg-white pl-1 pr-3 text-[13px] font-medium text-black transition-colors"
                  aria-label="Account menu"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-[11px] font-medium text-white">
                    {firstLetter}
                  </span>
                  <span className="hidden sm:block">{user.name}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-10 w-44 rounded-lg border border-gray-100 bg-white py-1 shadow-sm">
                    <div className="border-b border-gray-100 px-3 py-2">
                      <p className="text-[13px] font-medium text-black">
                        {user.name}
                      </p>
                      <p className="truncate text-[11px] text-gray-400">
                        {user.email}
                      </p>
                    </div>
                    <DropdownItem href="/account">My account</DropdownItem>
                    <DropdownItem href="/orders">Orders</DropdownItem>
                    {user.role === "SELLER" && (
                      <DropdownItem href="/seller/dashboard">
                        Seller dashboard
                      </DropdownItem>
                    )}
                    <div className="my-1 border-t border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full px-3 py-1.5 text-left text-[13px] text-red-500 transition-colors hover:bg-gray-50"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="ml-1 flex h-8 items-center gap-1.5 rounded-full border bg-white border-gray-200 px-3.5 text-[13px] font-medium text-black transition-colors hover:bg-gray-50"
              >
                <User size={13} />
                Login
              </button>
            )}

            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="ml-1 flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:text-black md:hidden"
              aria-label="Menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-gray-100 bg-white px-5 py-3 md:hidden">
            {["Shop", "Collections", "About"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="block py-2 text-[13px] text-gray-500 transition-colors hover:text-black"
              >
                {item}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        defaultTab="login"
        onLoginSuccess={() => {
          const stored = localStorage.getItem("user");
          if (stored) {
            const parsedUser = JSON.parse(stored);
            loadUserCart(parsedUser.id);
          }
        }}
      />
    </>
  );
};

const DropdownItem = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className="block px-3 py-1.5 text-[13px] text-gray-600 transition-colors hover:bg-gray-50 hover:text-black"
  >
    {children}
  </Link>
);

export default Navbar;