"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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
    message: "Le code du module est requis (ex: M101)",
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
      toast.success("Code du module mis à jour");
      form.reset(values);
      router.refresh();
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100/90 rounded-xl p-4 space-y-3">
      <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
        Code Module (OFPPT) :
      </label>

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
                    placeholder="ex: 'M101' ou 'M104'"
                    className="bg-white font-mono text-sm font-semibold border-slate-200 h-10 rounded-lg"
                    {...field}
                  />
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
