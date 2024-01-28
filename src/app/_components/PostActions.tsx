"use client";

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";

interface PostActionsProps {
    postId: string;
    archived: boolean | null;
}

export function PostActions({ postId, archived }: PostActionsProps){
    const router = useRouter();


    // Delete Post const
    const deletePostMutation = api.post.postDelete.useMutation({ 
        onSuccess: () => {
            router.refresh();
        }, 
    });

    //Delete Post handle
    const handleDelete = async () => {
        try {
            // Make an API request to delete the post
            await deletePostMutation.mutateAsync({ id: postId });
        } catch (error) {
            // Handle any errors, such as showing a message to the user
            console.error("Failed to delete post:", error);
        }
    };

    // Archive Post const
    const toggleArchiveMutation = api.post.postToggleArchive.useMutation({
        onSuccess: () => {
            router.refresh();
        },
    });

    // Archive Post handle
    const handleToggleArchive = async () => {
        try {
            // Make an API request to toggle the archived status of the post
            await toggleArchiveMutation.mutateAsync({ id: postId });
        } catch (error) {
            // Handle any errors, such as showing a message to the user
            console.error("Failed to toggle archive status:", error);
        }
    };





    return (
        <div className="my-auto flex gap-3 text-sm underline">
            <button className="text-black/70 hover:text-black">Edit</button>
            <button
                className="text-black/70 hover:text-black"
                onClick={handleDelete}
                >
                Delete
            </button>

            <button 
                className="text-black/70 hover:text-black"
                onClick={handleToggleArchive}
                >
                    {archived ? "Show on Profile" : "Archive"}
                </button>
        </div>
    );
}
