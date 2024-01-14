"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export function CreatePost() {
  const router = useRouter();
  const [Title, setName] = useState("");
  const [content, setContent] = useState("");
  const [coverPictureURL, setCoverURL] = useState("");

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setName("");
      setContent("");
      setCoverURL("");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createPost.mutate({ Title, content, coverPictureURL });
      }}
      className="flex flex-col gap-2"
    >
      <input
        type="text"
        placeholder="Title"
        value={Title}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />

      <input
        type="text"
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />

      <input
        type="text"
        placeholder="Cover Picture URL"
        value={coverPictureURL}
        onChange={(e) => setCoverURL(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />

      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={createPost.isLoading}
      >
        {createPost.isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
