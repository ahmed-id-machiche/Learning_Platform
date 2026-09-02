import { Logo } from "./logo";
import { TopNavLinks } from "./top-nav-links";
import { MobileSidebar } from "./mobile-sidebar";
import { NavbarRoutes } from "@/components/navbar-routes";
import { SearchInput } from "@/components/search-input";

export const Navbar = () => {
  return (
    <div className="px-4 lg:px-6 h-full flex items-center justify-between bg-white border-b border-slate-200 shadow-2xs gap-x-4">
      {/* 1. Left: Mobile Sidebar & Brand Logo */}
      <div className="flex items-center gap-x-3 shrink-0">
        <MobileSidebar />
        <Logo />
      </div>

      {/* 2. Nav Links */}
      <div className="hidden lg:flex items-center shrink-0">
        <TopNavLinks />
      </div>

      {/* 3. Center: Udemy-style Search Bar */}
      <div className="hidden md:flex items-center justify-center flex-1 max-w-xl mx-2">
        <SearchInput />
      </div>

      {/* 4. Right: Mode Formateur & Profile */}
      <div className="flex items-center shrink-0">
        <NavbarRoutes />
      </div>
    </div>
  );
};