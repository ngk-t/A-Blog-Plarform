"use client";

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";

interface PostActionsProps {
    postId: string;
  }

export function PostActions({ postId }: PostActionsProps){
    // const session = getServerAuthSession()
    
    const router = useRouter();
    // const [postId, setPID] = useState("");
    const [authorId, setAID] = useState("");

    const deletePostMutation = api.post.postDelete.useMutation({ 
        onSuccess: () => {
            router.refresh();
            // setPID("");
            setAID("");
        }, 
    });

    const handleDelete = async (postId: string) => {
        try {
            // Make an API request to delete the post
            await deletePostMutation.mutateAsync({ id: postId });
        } catch (error) {
            // Handle any errors, such as showing a message to the user
            console.error("Failed to delete post:", error);
        }
    };

    return (
        <div className="my-auto flex gap-3 text-sm underline">
            <button className="text-black/70 hover:text-black">Edit</button>
            <button
                className="text-black/70 hover:text-black"
                onClick={() => {
                    handleDelete(postId);
                    console.log("Hello World");
                }}
                >
                Delete
            </button>

            <button className="text-black/70 hover:text-black">Archive</button>
        </div>
    );
}
