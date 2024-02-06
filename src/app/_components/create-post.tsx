"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";
import { z } from "zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form";

import { useForm } from "react-hook-form";
import { Input } from "~/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "~/components/ui/button";
import Tiptap from "./Tiptap";


export function CreatePost() {
  const router = useRouter();
  const [Title, setName] = useState("");
  const [content, setContent] = useState("");
  const [coverPictureURL, setCoverURL] = useState("");
  const [imageUrl, setImageUrl] = useState('');

  const formSchema = z.object({
    Title: z
        .string()
        .min(5, {message: "Title is too short!"})
        .max(100, {message: "Too long!"}),
    coverPictureURL: z
        .string()
        .url({message: "Invalid URL!"}), // This will validate the URL
    content: z
        .string()
        .min(100, {message: "Bit too short mate"}),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
        Title: "",
        coverPictureURL: "",
        content: "",
    }
  });

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setName("");
      setContent("");
      setCoverURL("");
    },
  });


  function onSubmit(values: z.infer<typeof formSchema>) {
    // const createPost = api.post.create.useMutation({
    //   onSuccess: () => {
    //     router.refresh();
    //     setName("");
    //     setContent("");
    //     setCoverURL("");
    //   },
    // });
  
    createPost.mutate(values); // Call the mutate function with the form values
  }
  

  return (
    <Form {...form}>
        <form 
            className="pt-4" 
            // onSubmit={form.handleSubmit(onSubmit)}
            onSubmit={form.handleSubmit(onSubmit)} onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target === e.currentTarget) {
                  e.preventDefault();
                }
              }}
            >
            <FormField
                control={form.control}
                name="Title"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                            <Input placeholder="Title" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="coverPictureURL"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Cover Picture (URL)</FormLabel>
                        <FormControl>
                            <Input 
                                placeholder="URL" {...field}
                                onChange={(e) => {
                                    field.onChange(e);  // call the original onChange
                                    setImageUrl(e.target.value);  // update the imageUrl state
                                }}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            {imageUrl && <div className="m-4 border-4 border-neutral-200 rounded shadow-2xl"><img src={imageUrl} alt="Cover" className="object-contain h-50 w-full" /></div>}
            <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                            <Tiptap 
                                content={""} 
                                onChange={field.onChange} 
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Button className="rounded-full bg-black/100 px-10 py-3 mt-6 font-semibold transition hover:bg-black/60 text-white" disabled={createPost.isLoading}>
                {createPost.isLoading ? "Publishing..." : "Publish"}
            </Button>
        </form>
    </Form>
  );
}
