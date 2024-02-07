import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { getServerAuthSession } from "~/server/auth";
import { authOptions } from "~/server/auth";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import { CreatePost } from "../_components/create-post";
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

export default async function Page() {
  const session = await getServerSession(authOptions);
  const createMarkup = (html : string) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };
  
  const getPlainText = (html : string) => {
    const dom = new JSDOM(html);
    return dom.window.document.body.textContent ?? "";
  }

  if (!session) {
    return (
      <main className="to-98% flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#ffffff] from-65% to-[#ffffff]  text-neutral-700">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            <span className="text-[#cfb225]">An blog</span> website
          </h1>

          <p className="text-3xl font-extrabold">
            Please log in to create post
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#ffffff]  text-neutral-700">
      <div className="w-2/3 items-center justify-center  bg-[#e9d051] p-3 content-center h-60">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-[5rem] p-8 pb-10">
          Create new post
        </h1>
        <CrudShowcase />
      </div>
    </main>
  );
}

async function CrudShowcase() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const latestPost = await api.post.getLatest.query();

  return (
    <div className="max-w-2/3 px-4 mx-3 pt-4 py-8 gap-4 bg-[#ffffff]/40 backdrop-blur-2xl rounded-lg">
      {latestPost ? (
        <p className="truncate font-bold">Your most recent post: {latestPost.Title}</p>
      ) : (
        <p className="font-bold">You have no posts yet.</p>
      )}
      

      <CreatePost />
    </div>
  );
}
