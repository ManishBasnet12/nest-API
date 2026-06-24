import Sidebar from "@/components/layout/myaccountsidebar";

interface AccountLayoutProps {
  children: React.ReactNode;
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <div className="flex w-full gap-8 max-w-7xl mx-auto px-4 py-8">
      <Sidebar />
      
      <div className="flex-1 bg-white">
        {children}
      </div>
    </div>
  );
}