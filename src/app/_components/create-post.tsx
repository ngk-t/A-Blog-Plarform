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

  );
}
