"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Le titre est requis",
  }),
});

const CreatePage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/courses", values);
      router.push(`/teacher/courses/${response.data.id}`);
      toast.success("Module créé avec succès !");
    } catch {
      toast.error("Une erreur s'est produite lors de la création.");
    }
  };

  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans flex items-center justify-center min-h-[calc(100vh-140px)]">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xl max-w-2xl w-full">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Créer un nouveau module OFPPT
        </h1>
        <p className="text-sm text-slate-600 mt-1 font-medium leading-relaxed">
          Saisissez le titre de votre module. Vous pourrez ensuite définir le code module (ex: M102), choisir la filière et ajouter les chapitres et supports PDF.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-extrabold text-slate-800 text-sm">
                    Titre du module
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="ex: 'M102 - Comptabilité Générale (Principes de Base)'"
                      className="h-11 rounded-xl text-sm font-medium border-slate-300 focus:ring-purple-500 focus:border-purple-500"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-slate-500">
                    Quel est l'intitulé officiel de ce module de formation OFPPT ?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-3 pt-2">
              <Link href="/teacher/courses">
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-xl font-bold text-xs"
                >
                  Annuler
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Continuer
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreatePage;