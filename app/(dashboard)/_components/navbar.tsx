import { Logo } from "./logo";
import { TopNavLinks } from "./top-nav-links";
import { MobileSidebar } from "./mobile-sidebar";
import { NavbarRoutes } from "@/components/navbar-routes";

export const Navbar = () => {
  return (
    <div className="px-4 lg:px-6 h-full flex items-center justify-between bg-white border-b border-slate-200 shadow-2xs gap-x-4">
      {/* Left: Mobile Trigger & Logo */}
      <div className="flex items-center gap-x-4 shrink-0">
        <MobileSidebar />
        <Logo />
      </div>

      {/* Center: Top Navigation Links */}
      <div className="hidden md:flex items-center justify-center flex-1 mx-4">
        <TopNavLinks />
      </div>

      {/* Right: Mode Formateur & User Profile */}
      <div className="flex items-center shrink-0">
        <NavbarRoutes />
      </div>
    </div>
  );
};