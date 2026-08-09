"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
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
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface PriceFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  price: z.number().min(0),
});

export const PriceForm = ({
  initialData,
  courseId,
}: PriceFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: initialData?.price ?? undefined,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Prix du module mis à jour !");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Une erreur est survenue.");
    }
  };

  return (
    <div className="mt-6 border border-slate-200 bg-slate-50/60 rounded-2xl p-4 shadow-xs">
      <div className="font-bold text-sm text-slate-800 flex items-center justify-between">
        Prix du Module (DH)
        <Button onClick={toggleEdit} variant="ghost" className="text-xs font-semibold hover:bg-slate-200/60 rounded-xl">
          {isEditing ? (
            <>Annuler</>
          ) : (
            <>
              <Pencil className="h-3.5 w-3.5 mr-1.5" />
              Modifier le prix
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            "text-sm font-semibold mt-2",
            !initialData.price && "text-slate-500 italic font-normal"
          )}
        >
          {initialData.price ? `${initialData.price} DH` : "Module gratuit (Aucun prix fixé)"}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-3"
          >
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      disabled={isSubmitting}
                      placeholder="Saisissez un prix (ex: 150)"
                      value={field.value === undefined || field.value === null || field.value === 0 ? "" : field.value}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === "" ? 0 : parseFloat(val));
                      }}
                      className="bg-white border-slate-200 rounded-xl text-xs h-10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
                className="bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs rounded-xl h-9 px-4 cursor-pointer"
              >
                Enregistrer le prix
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
