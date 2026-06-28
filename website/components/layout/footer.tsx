import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          
          <div className="col-span-2">
            <h2 className="text-lg font-bold mb-4">STORE.</h2>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              Premium quality products curated for your daily lifestyle. 
              Integrated with our high-performance NestJS API.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-black mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/products" className="hover:text-black">All Products</Link></li>
              <li><Link href="/categories/electronics" className="hover:text-black">Electronics</Link></li>
              <li><Link href="/categories/clothing" className="hover:text-black">Clothing</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-black mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/cart" className="hover:text-black">My Cart</Link></li>
              <li><Link href="/orders" className="hover:text-black">Track Order</Link></li>
              <li><Link href="/auth/profile" className="hover:text-black">Account Details</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-black mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="#" className="hover:text-black">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-black">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            © 2026 YourBrand. Powered by NestJS & Next.js.
          </p>
          <div className="flex gap-6">
             <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
             <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;