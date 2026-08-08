"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

interface CategoryFormProps {
  initialData: Course;
  courseId: string;
  options: { label: string; value: string }[];
}

const formSchema = z.object({
  categoryId: z.string().min(1, {
    message: "La catégorie est requise",
  }),
});

export const CategoryForm = ({
  initialData,
  courseId,
  options,
}: CategoryFormProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: initialData?.categoryId || "",
    },
  });

  const { isSubmitting, isDirty, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Catégorie mise à jour");
      form.reset(values);
      router.refresh();
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  const handleSelectChange = (val: string) => {
    form.setValue("categoryId", val, { shouldDirty: true });
    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="mt-6 border bg-slate-100/90 rounded-xl p-4 space-y-3">
      <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
        Catégorie Pédagogique :
      </label>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <select
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer shadow-xs"
                    disabled={isSubmitting}
                    value={field.value}
                    onChange={(e) => handleSelectChange(e.target.value)}
                  >
                    <option value="" disabled>
                      -- Sélectionner une catégorie --
                    </option>
                    {options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isDirty && (
            <div className="flex items-center justify-end gap-x-2 pt-1">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
                size="sm"
                className="bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs px-4 py-1.5 rounded-lg"
              >
                {isSubmitting ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};
