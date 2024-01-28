import Link from "next/link";

import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import getFormattedDate from "lib/getFormattedDate";
// import { createTRPCReact } from '@trpc/react-query';

export default async function Home() {
  const hello = await api.post.hello.query({ text: "from tRPC" });
  const session = await getServerAuthSession();
  // const data = await api.post.getAll.query();

  // let data: any = await api.post.getAll.query();

  // data = await Promise.all(data.map(async (post: any) => {
  //   const author = await api.post.getAuthor.query({ id: post.createdById });
  //   return { ...post, authorName: author?.name, authorImage: author?.image };
  // }));


  // console.log(data)
 

  type PostData = {
    id: string;
    Title: string;
    archived: boolean | null;
    createdAt: Date;
    updatedAt: Date;
    createdById: string;
    content: string | null;
    coverPictureURL: string | null;
  };
  
  type Post = PostData & {
    authorName: string | null;
    authorImage: string | null;
  };
  
  let oldData: PostData[] = await api.post.getAll.query();

  // Add author's name to each post
  let newData: Post[] = await Promise.all(oldData.map(async (post: PostData) => {
    const author = await api.post.getAuthor.query({ id: post.createdById });
    return { ...post, authorName: author?.name, authorImage: author?.image } as Post;
  }));

  // Now TypeScript knows that newData is an array of Post objects


  
  console.log(newData)
  


  // const getAllQuery = useQuery(['getAll'], api.post.getAll);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#ffffff] from-60% to-white to-98%  text-neutral-700">
      
    {/* <!-- NAVIGATION BAR --> */}
      {/* <div className="h-25 fixed top-0 z-10 box-border w-full bg-white bg-opacity-25 p-4 ">
        <div className="flex flex-row">
          <p>Menu bar</p>
          <div className="ml-auto shrink-0">
            <img src="https://assets.stickpng.com/images/588a6507d06f6719692a2d15.png" className="h-6"></img>
          </div>
        </div>
      </div> */}





      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-20 ">    
        
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem] ">
          <span className="text-[#cfb225]">An blog</span> website
        </h1>

        <div className="flex flex-col items-center gap-2">
          {/* <p className="text-2xl text-neutral-700">
            {hello ? hello.greeting : "Loading tRPC query..."}
          </p> */}
{/* Sign in function */}
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-neutral-700">
              {session && <span>Logged in as {session.user?.name}</span>}
            </p>
            <Link
              href={session ? "/api/auth/signout" : "/api/auth/signin"}
              className="rounded-full bg-neutral-700/10 px-10 py-3 font-semibold no-underline transition hover:bg-neutral-700/5"
            >
              {session ? "Sign out" : "Sign in"}
            </Link>
          </div>
        </div>


{/* 
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-neutral-700/10 p-4 hover:bg-neutral-700/20"
            href="https://create.t3.gg/en/usage/first-steps"
            target="_blank"
          >
            <h3 className="text-2xl font-bold">First Steps →</h3>
            <div className="text-lg">
              Just the basics - Everything you need to know to set up your
              database and authentication.
            </div>
          </Link>
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-neutral-700/10 p-4 hover:bg-neutral-700/20"
            href="https://create.t3.gg/en/introduction"
            target="_blank"
          >
            <h3 className="text-2xl font-bold">Documentation →</h3>
            <div className="text-lg">
              Learn more about Create T3 App, the libraries it uses, and how to
              deploy it.
            </div>
          </Link>
        </div> */}
        

        {/* <CrudShowcase /> */}




        {/* BLOG FEED */}

        <div>
          {newData?.filter(post => !post.archived).map((post) => {
            // Format the updatedAt date
            const formattedDate = getFormattedDate(post.createdAt.toISOString());
            // const author = getAuthor(post.createdById);
            

            return (
              <div key={post.id}>
                <li className="flex max-w-prose flex-col gap-4 rounded-xl bg-neutral-700/10 p-4 hover:bg-neutral-700/20 my-4">
                  <Link className="hover:text-black/70 dark:hover:text-white no-underline text-2xl font-bold" href={`/posts/${post.id}`}>{post.Title}</Link>
                  <p className="text-xs">by <span className="font-bold">{post.authorName}</span></p>
                  <p className="text-xs">{formattedDate}</p>
                  <p className="text-sm mt-0 text-justify">{post.content ? post.content.slice(0, 150) : ''}...</p>
                </li>
              </div>
            );
          })}
        </div>


      </div>
    </main>
  );
}

async function CrudShowcase() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const latestPost = await api.post.getLatest.query();

  return (
    <div className="w-full max-w-xs">
      {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.Title}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}

      <CreatePost />
    </div>
  );
}
