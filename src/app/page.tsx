import Link from "next/link";

import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import getFormattedDate from "lib/getFormattedDate";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
// import { createTRPCReact } from '@trpc/react-query';

export const metadata = {
  title: "An Blog Website - Home",
  description: "A Blog Platform by ngk-t",
  icons: [{ rel: "icon", url: "/icon.png" }],
};

export default async function Home() {
  const hello = await api.post.hello.query({ text: "from tRPC" });
  const session = await getServerAuthSession();
  // const data = await api.post.getAll.query();
  // console.log(data)
  

  const createMarkup = (html: string) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };

  const getPlainText = (html: string) => {
    const dom = new JSDOM(html);
    return dom.window.document.body.textContent ?? "";
  };

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
  const sortedAuthorsData = authorsData.sort((a, b) =>
    (a.name ?? "").localeCompare(b.name ?? ""),
  );

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

      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-28">
        <h1 className="prose text-left text-4xl font-extrabold tracking-tight sm:text-[3.5rem]">
          <span className="bg-[#ead985] text-3x1 font-serif italic box-decoration-clone text-[#ffffff] pl-4 pr-4 mr-2 py-[0.3rem]">
            an Blog
          </span>{""}
          website
        </h1>

        <div className="flex flex-col items-center gap-2">
          {/* <p className="text-2xl text-neutral-700">
            {hello ? hello.greeting : "Loading tRPC query..."}
          </p> */}
          {/* Sign in function */}
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-neutral-700">
              {session && <span>Welcome back, {session.user?.name}</span>}
            </p>
            {/* <Link
              href={session ? "/api/auth/signout" : "/api/auth/signin"}
              className="rounded-full bg-neutral-700/10 px-10 py-3 font-semibold no-underline transition hover:bg-neutral-700/5"
            >
              {session ? "Sign out" : "Sign in"}
            </Link> */}
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

        <div className="flex flex-row gap-2 md:columns-2 lg:columns-3 lg:gap-6">
          {/* AUTHORS */}

          <div className="mt-4  hidden rounded-xl md:w-48 lg:block lg:w-80 lg:bg-white">
            <h2 className="ml-4 mt-6 font-sans text-2xl font-bold lg:ml-8">
              Authors
            </h2>
            {sortedAuthorsData.map((author) => (
              <Link href={`/profile/${author.id}`} key={author.id}>
                <div
                  key={author.id}
                  className="h-15 m-4 flex items-center overflow-visible rounded-xl p-3 backdrop-blur-2xl hover:bg-neutral-200 md:w-36 lg:w-72 lg:gap-2 lg:bg-white/50 "
                >
                  <img
                    src={`${author.image}`}
                    alt={`${author.name}`}
                    className="hidden h-20 w-20 rounded-full lg:block"
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
                    className="relative my-4 flex max-w-prose flex-col gap-4 rounded-xl bg-sky-800 shadow-md"
                    style={{
                      backgroundImage: `url(${post.coverPictureURL})`,
                      backgroundSize: "cover",
                    }}
                  >
                    <Link href={`/posts/${post.id}`}>
                      <div className="mt-12 flex rounded-b-xl bg-neutral-50/70 p-4 backdrop-blur-2xl hover:bg-neutral-200/80 sm:m-4 sm:rounded-xl md:columns-2">
                        {/* Main content */}
                        <div className="flex-grow md:w-96">
                          <Link
                            className="text-2xl font-bold no-underline hover:text-black/70 hover:underline dark:hover:text-white"
                            href={`/posts/${post.id}`}
                          >
                            {post.Title}
                          </Link>
                          <p className="my-2 text-xs">
                            by{" "}
                            <span className="font-bold">{post.authorName}</span>
                          </p>
                          <p className="my-2 text-xs">{formattedDate}</p>
                          <p className="mt-0 text-left text-sm text-neutral-500">
                            {post.content
                              ? getPlainText(post.content).slice(0, 250) + "..."
                              : ""}
                          </p>
                        </div>

                        {/* Author's profile pic */}
                        <div className="hidden md:ml-4 md:block md:h-32 md:w-32">
                          <Link href={`/profile/${post.createdById}`} key={post.createdById} className="text-md flex flex-col items-center hover:underline">
                            <img
                              src={`${post.authorImage}`}
                              alt="Profile Picture"
                              className="mt-4 h-20 w-20 rounded-full"
                            />
                            <span className="mt-6 font-bold">{`${post.authorName}`}</span>
                          </Link>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
          </div>

          {/* Place-holder */}
          <div className="hidden lg:block lg:w-80">{/* Something Here */}</div>
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
