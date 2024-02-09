import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { getServerAuthSession } from "~/server/auth";
import { authOptions } from "~/server/auth";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import { EditPost } from "~/app/_components/post-edit";
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

interface PostDataType {
    id: string;
    Title: string;
    archived: boolean | null;
    createdAt: Date;
    updatedAt: Date;
    createdById: string;
    content: string | null;
    coverPictureURL: string | null;
    createdBy: {
      id: string;
      name: string | null;
      email: string | null;
      emailVerified: Date | null;
      image: string | null;
    };
  }

  

export default async function Page({ params } : { params : {postId : string}}) {
  const session = await getServerSession(authOptions);
  const {postId} = params
  const data = await api.post.getOne.query({ id: postId });
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
        <h1 className="prose text-left text-4xl font-extrabold tracking-tight sm:text-[3.5rem]">
          <span className="bg-[#ead985] text-3x1 font-serif italic box-decoration-clone text-[#ffffff] pl-4 pr-4 mr-2 py-[0.3rem]">
            an Blog
          </span>{""}
          website
        </h1>

          <p className="text-3xl font-extrabold">
            Please log in as the author to edit post
          </p>
        </div>
      </main>
    );
  }

  // Check if the user is the creator of the post or if the user is not logged in
  const isAuthorOrNotLoggedIn = !session.user || session.user.id === data?.createdById;

  if (!isAuthorOrNotLoggedIn) {
    return (
      <main className="to-98% flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#ffffff] from-65% to-[#ffffff]  text-neutral-700">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="prose text-left text-4xl font-extrabold tracking-tight sm:text-[3.5rem]">
          <span className="bg-[#ead985] text-3x1 font-serif italic box-decoration-clone text-[#ffffff] pl-4 pr-4 mr-2 py-[0.3rem]">
            an Blog
          </span>{""}
          website
        </h1>

          <p className="text-3xl font-extrabold">
            You do not have permission to edit this post
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#ffffff]  text-neutral-700">
      <div className="w-full md:w-2/3 items-center justify-center  bg-[#e9d051] p-3 content-center h-60">
        <h1 className="text-1xl sm:text-[1.5rem] font-extrabold tracking-tight md:text-[2rem] p-8 pb-10">
          Edit &ldquo;<span className="text-neutral-500 text-1x1 sm:text-[1.6rem]">{data?.Title}</span>&rdquo;
        </h1>
        {data && <CrudShowcase postData={data} />}
      </div>
    </main>
  );
}

async function CrudShowcase({ postData }: { postData: PostDataType }) {
  const session = await getServerAuthSession();
  if (!session?.user) return null;
  // console.log("LOGGGGG", postData)

//   const latestPost = await api.post.getLatest.query();

  return (
    <div className=" max-w-2/3 px-4 mx-3 pt-4 py-8 gap-4 bg-[#ffffff]/40 backdrop-blur-2xl rounded-lg">
      <EditPost postId={postData.id} postTitle={postData.Title} postPicURL={postData.coverPictureURL} postContent={postData.content} />
    </div>
  );
}
