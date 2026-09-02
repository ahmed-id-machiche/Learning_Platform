import { redirect } from "next/navigation";

interface SearchPageProps {
  searchParams: Promise<{
    title?: string;
    categoryId?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { title, categoryId } = await searchParams;

  const query = new URLSearchParams();
  if (title) query.set("title", title);
  if (categoryId) query.set("categoryId", categoryId);

  const queryString = query.toString();
  const target = queryString ? `/?${queryString}` : "/";

  return redirect(target);
}