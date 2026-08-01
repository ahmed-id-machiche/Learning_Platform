"use client"; 
 import { BarChart, Compass, FileCheck, Layout, List, Users } from "lucide-react";
 import {SidebarItem} from "./sidebar-item";
 import { usePathname} from "next/navigation";

 const guestRoutes = [
     {
        icon: Layout,
        label: "Tableau de bord",
        href: "/",
     },
     {
        icon: Compass,
        label: "Catalogue & Modules",
        href: "/search",
     },
 ]

 const teacherRoutes = [

     {
        icon: List,
        label: "Courses",
        href: "/teacher/courses"
     },
     {
        icon: Users,
        label: "Stagiaires",
        href: "/teacher/students",
     },
     {
        icon: FileCheck,
        label: "TP Submissions",
        href: "/teacher/submissions",
     },
     {
        icon: BarChart,
        label: "Analytics",
        href: "/teacher/analytics",
     },
 ]
export const SidebarRoutes = () =>{
    const pathname = usePathname();

    const isTeacherPage = pathname?.includes("/teacher");

    const routes = isTeacherPage ? teacherRoutes : guestRoutes;
    return (
     <div className="flex flex-col w-full">
        {routes.map((route) => (
            <SidebarItem
            key={route.href}
            icon={route.icon}
            label={route.label}
            href={route.href}
            />
        ))}
     </div>

    )
}