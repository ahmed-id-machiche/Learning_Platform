"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Hash } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ModuleCodeFormProps {
  initialData: {
    moduleCode: string | null;
  };
  courseId: string;
}

const formSchema = z.object({
  moduleCode: z.string().min(1, {
    message: "Le code du module est requis (ex: M102)",
  }),
});

export const ModuleCodeForm = ({
  initialData,
  courseId,
}: ModuleCodeFormProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      moduleCode: initialData.moduleCode || "",
    },
  });

  const { isSubmitting, isDirty, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Code du module mis à jour !");
      form.reset(values);
      router.refresh();
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100/90 rounded-2xl p-5 space-y-3 font-sans">
      <div className="flex items-center justify-between">
        <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Hash className="h-4 w-4 text-purple-700" />
          Code Module (OFPPT) :
        </label>
        <span className="text-[10px] font-extrabold text-purple-700 bg-purple-100/80 px-2 py-0.5 rounded-md border border-purple-200">
          ex: M101, M102, M204
        </span>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="moduleCode"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder="ex: M102, M104, M206..."
                    className="bg-white font-mono text-xs font-extrabold border-slate-300 h-10 rounded-xl focus:ring-purple-500 focus:border-purple-500"
                    {...field}
                  />
                </FormControl>
                <p className="text-[11px] text-slate-500 font-medium">
                  Le code officiel attribué par l'OFPPT pour ce module (M1XX = 1ère Année, M2XX = 2ème Année).
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
          {isDirty && (
            <div className="flex items-center justify-end gap-x-2 pt-1 border-t border-slate-200">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
                size="sm"
                className="bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs px-4 py-1.5 rounded-xl shadow-xs cursor-pointer"
              >
                {isSubmitting ? "Enregistrement..." : "Enregistrer le code"}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};
