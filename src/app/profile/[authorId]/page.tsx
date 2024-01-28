
import Link from "next/link";

import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import getFormattedDate from "lib/getFormattedDate";
import { PostActions } from "~/app/_components/PostActions";





export default async function Profile({ params } : { params : {authorId : string}}) {
  
  const { authorId } = params;
  const session =  await getServerAuthSession();
  const data = await api.post.getAll.query();
  const author = await api.post.getAuthor.query({ id: authorId });



  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white  text-neutral-700 overflow-auto">
      <div className="bg-[#e9d051] p-3 content-center w-full h-64 flex items-center justify-center">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-[5rem]">
          {author?.name}&apos;s Profile
        </h1>
      </div>

      {/* BLOG FEED */}

      <div>
        {data
          ?.filter((post) => {
            // Only show posts that are not archived if the current session ID doesn't match with the author ID
            if (post.createdById !== session?.user.id && post.archived) {
              return false;
            }
            return post.createdById === authorId;
          })
          .map((post) => {
            // Format the updatedAt date
            const formattedDate = getFormattedDate(
              post.createdAt.toISOString(),
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


                    {/* Import PostActions Buttons as client component */}
                    <div>

                      {post.createdById === session?.user.id && <PostActions postId={post.id} archived={post.archived ?? false} />}

                    </div>
                  </div>
                  {/* Shows Date */}
                  <p className="text-xs">{formattedDate}</p>

                  {/* Shows Archive Status */}
                  {post.archived && <p className="text-red-500 font-bold no-underline ">[ARCHIVED]</p>}
                  
                  {/* Shows Post Content Preview */}
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
