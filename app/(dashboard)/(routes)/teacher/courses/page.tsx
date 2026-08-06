import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { Breadcrumbs } from "@/components/breadcrumb";
import { List } from "lucide-react";

const CoursesPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const courses = await db.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6 space-y-4">
      <Breadcrumbs
        items={[
          { label: "Espace Formateur", href: "/teacher/courses" },
          { label: "Modules de Formation", icon: List },
        ]}
      />
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default CoursesPage;