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

interface EditPostProps {
    postId: string;
    postTitle: string;
    postContent: string | null;
    postPicURL: string | null;
}

export function EditPost({ postId, postTitle, postPicURL , postContent }:EditPostProps) {
    const router = useRouter();

    // If the values are null, assign them to an empty string
    postTitle = postTitle ?? "";
    postContent = postContent ?? "";
    postPicURL = postPicURL ?? "";

    const [Title, setName] = useState(postTitle);
    const [content, setContent] = useState(postContent);
    const [coverPictureURL, setCoverURL] = useState(postPicURL);
  
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
          Title: Title,
          coverPictureURL: coverPictureURL,
          content: content,
      }
    });
  
    const updatePost = api.post.postUpdate.useMutation({
      onSuccess: () => {
        router.refresh();
        setName("");
        setContent("");
        setCoverURL("");
      },
    });
  
    function onSubmit(values: z.infer<typeof formSchema>) {  
      updatePost.mutate({ id: postId, ...values }); // Call the mutate function with the form values and id
    }
    
  
    return (
      <Form {...form}>
          <form 
            className="pt-4" 
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
                              <Input placeholder="URL" {...field} />
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                  )}
              />
              <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                      <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                              <Tiptap content={postContent} onChange={field.onChange}/>
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                  )}
              />
              <Button className="rounded-full bg-black/100 px-10 py-3 mt-6 font-semibold transition hover:bg-black/60 text-white" disabled={updatePost.isLoading}>
                  {updatePost.isLoading ? "Updating..." : "Update"}
              </Button>
          </form>
      </Form>
    );
  }
  