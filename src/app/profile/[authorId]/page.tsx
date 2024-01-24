"use client"


import Link from "next/link";

import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/react";
import {authOptions} from "next-auth/react";
import getFormattedDate from "lib/getFormattedDate";



export default function Profile({
  params,
}: {
  params: { authorId: string };
}) {
  const { authorId } = params;
//   const session =  getServerAuthSession();
//   const data =  api.post.getAll.query();

  const {data: sessionData} = useSession();
  const {data} = api.post.getAll.useQuery();
    
//   const deletePost = api.post.postDelete.mutate();

  const postsWithFormattedDates = data?.map((post) => {
    return {
      ...post,
      updatedAt: getFormattedDate(post.updatedAt.toISOString()),
    };
  });

//   const handleDelete = async (postId: string) => {
//     try {
//       // Make an API request to delete the post
//       await api.post.postDelete.mutateAsync({ id: postId });
//     } catch (error) {
//       // Handle any errors, such as showing a message to the user
//       console.error("Failed to delete post:", error);
//     }
//   };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white  text-neutral-700">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-[5rem]">
          Profile
        </h1>
      </div>

      {/* BLOG FEED */}

      <div>
        {data
          ?.filter((post) => post.createdById === authorId)
          .map((post) => {
            // Format the updatedAt date
            const formattedDate = getFormattedDate(
              post.updatedAt.toISOString(),
            );

            return (
              <div key={post.id}>
                <li className="my-4 flex max-w-prose flex-col gap-4 rounded-xl bg-neutral-700/10 p-4">
                  <div className="flex items-center justify-between">
                    <Link
                      className="text-2xl font-bold no-underline hover:text-black/70 dark:hover:text-white"
                      href={`/posts/${post.id}`}
                    >
                      {post.Title}
                    </Link>

                    <div className="my-auto flex gap-3 text-sm underline">
                      {/* <button className="text-black/70 hover:text-black">Edit</button> */}
                      <button
                        className="text-black/70 hover:text-black"
                        onClick={() => {
                            // handleDelete(post.id);
                            console.log("Hello World");
                        }}
                      >
                        Delete
                      </button>

                      {/* <button className="text-black/70 hover:text-black">Archive</button> */}
                    </div>
                  </div>
                  <p className="text-xs">{formattedDate}</p>
                  <p className="mt-0 text-justify text-sm">
                    {post.content ? post.content.slice(0, 150) : ""}...
                  </p>
                </li>
              </div>
            );
          })}
      </div>
    </main>
  );
}
