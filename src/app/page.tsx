import Link from "next/link";

import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import getFormattedDate from "lib/getFormattedDate";
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
// import { createTRPCReact } from '@trpc/react-query';

export default async function Home() {
  const hello = await api.post.hello.query({ text: "from tRPC" });
  const session = await getServerAuthSession();
  // const data = await api.post.getAll.query();
  // console.log(data)

  const createMarkup = (html : string) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };
  
  const getPlainText = (html : string) => {
    const dom = new JSDOM(html);
    return dom.window.document.body.textContent ?? "";
  }

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

  const oldData: PostData[] = await api.post.getAll.query();

  // Add author's name to each post
  const newData: Post[] = await Promise.all(
    oldData.map(async (post: PostData) => {
      const author = await api.post.getAuthor.query({ id: post.createdById });
      return {
        ...post,
        authorName: author?.name,
        authorImage: author?.image,
      } as Post;
    }),
  );

  // Fetch all authors
  const authorsData = await api.post.getAllAuthors.query();
  // Sort authors alphabetically by name
  const sortedAuthorsData = authorsData.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));


  // Now TypeScript knows that newData is an array of Post objects

  // console.log(newData);

  // const getAllQuery = useQuery(['getAll'], api.post.getAll);

  return (
    <main className="to-98% flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#ffffff] from-60% to-white  text-neutral-700">
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


        <div className="flex flex-row gap-2 lg:gap-6 md:columns-2 lg:columns-3">
          
          {/* AUTHORS */}

          <div className="lg:bg-white  mt-4 rounded-xl hidden lg:block md:w-48 lg:w-80">
            <h2 className="mt-6 ml-4 lg:ml-8 font-bold font-sans text-2xl">Authors</h2>
            {sortedAuthorsData.map((author) => (
              <Link href={`/profile/${author.id}`} key={author.id}>
                <div key={author.id} className="lg:bg-neutral-50/50 hover:bg-neutral-200 md:w-36 lg:w-72 h-15 overflow-visible flex items-center rounded-xl backdrop-blur-2xl lg:shadow-lg lg:gap-2 p-3 m-4">
                  <img
                    src={`${author.image}`}
                    alt={`${author.name}`} 
                    className="h-20 w-20 rounded-full hidden lg:block"
                  />
                  <h3 className="font-semibold lg:font-bold">{author.name}</h3>
                </div>
              </Link>
            ))}
          </div>
          
          
          
          
          
          
          {/* BLOG FEED */}

          <div>
            {newData
              ?.filter((post) => !post.archived)
              .map((post) => {
                // Format the updatedAt date
                const formattedDate = getFormattedDate(
                  post.createdAt.toISOString(),
                );
                // const author = getAuthor(post.createdById);

                return (
                  <div 
                    key={post.id} 
                    className="my-4 flex relative max-w-prose flex-col gap-4 rounded-xl shadow-md bg-sky-800" 
                    style={{
                      backgroundImage: `url(${post.coverPictureURL})`,
                      backgroundSize: 'cover',
                    }}
                  >

                  <Link href={`/posts/${post.id}`}>

                    <div className="flex bg-neutral-50/70 rounded-b-xl sm:rounded-xl p-4 hover:bg-neutral-200/80 backdrop-blur-2xl mt-12 sm:m-4 md:columns-2"  >
                      
                      {/* Main content */}
                      <div className="flex-grow md:w-96">
                    
                        <Link
                          className="text-2xl font-bold no-underline hover:text-black/70 hover:underline dark:hover:text-white"
                          href={`/posts/${post.id}`}
                        >
                          {post.Title}
                        </Link>
                        <p className="text-xs my-2">
                          by <span className="font-bold">{post.authorName}</span>
                        </p>
                        <p className="text-xs my-2">{formattedDate}</p>
                        <p className="mt-0 text-justify text-sm text-neutral-500">
                          {post.content ? getPlainText(post.content).slice(0, 250) + "..." : ""}
                        </p>
                      </div>

                      {/* Author's profile pic */}
                      <div className="md:w-32 md:h-32 hidden md:ml-4 md:block">
                        <div className="text-md flex flex-col items-center">
                          <img
                            src={`${post.authorImage}`}
                            alt="Profile Picture"
                            className="h-20 w-20 mt-4 rounded-full"
                          />
                          <span className="mt-6 font-bold">{`${post.authorName}`}</span>
                        </div>
                      </div>  

                    </div>
                    </Link>
                  </div>
                );
              })}
          </div>

          {/* Place-holder */}
          <div className="hidden lg:block lg:w-80">
              {/* Something Here */}
          </div>

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
