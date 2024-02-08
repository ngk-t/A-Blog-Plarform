import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import getFormattedDate from "lib/getFormattedDate";

// export default function generateMetadata({ params } : { params : {postId : string}}) {
//     const postId = params

// }

export default async function Post({ params }: { params: { postId: string } }) {
  const { postId } = params;
  const data = await api.post.getOne.query({ id: postId });

  if (!data) {
    return notFound();
  }

  const formattedDate = getFormattedDate(data.updatedAt.toISOString());

  // const formattedDate = getFormattedDate(Post.updatedAt.toISOString());

  return (
    <main className=" flex min-h-screen flex-col items-center justify-center text-neutral-700">
      {/* <div className="bg-[#e9d051]  content-center w-full h-2/3 flex flex-col items-center justify-center top-0 -z-30 overflow-hidden bg-gradient-to-b from-[#ffffff] from-60% to-white to-98% "> */}

      {/* <h1 className="text-3xl font-extrabold tracking-tight sm:text-[2rem] md:text-[4rem] lg:text-[5rem]">
                Page Title
                </h1> */}
      <div className="h-[32rem] w-full rounded border-0 border-neutral-200 bg-orange-300 shadow-2xl">
        <img
          className="h-[32rem] w-full object-cover"
          alt="Cover Picture"
          src={`${data.coverPictureURL}`}
        />
      </div>

      {/* </div> */}
      <div className="my-10 flex max-w-prose -translate-y-40 flex-col gap-4 rounded-xl bg-neutral-50/40 p-8 pb-12 shadow-xl backdrop-blur-3xl">
        <div className="space-y-4 whitespace-pre-line break-words">
          <h1 className="text-5xl font-bold text-neutral-800">{`${data.Title}`}</h1>
          <p className="text-md flex items-center">
            <img
              src={`${data.createdBy.image}`}
              alt="Profile Picture"
              className="h-10 w-10 rounded-full"
            />
            <span className="ml-2 font-bold">{`${data?.createdBy.name}`}</span>
          </p>
          <p className="mb-10 text-xs">{formattedDate}</p>

          <div
            className="space-y-4 text-justify indent-4 text-lg leading-relaxed"
            dangerouslySetInnerHTML={{ __html: data.content ?? "" }}
          />
          <p className="text-md pt-4 text-right">
            - <span className="font-bold">{`${data?.createdBy.name}`}</span>
          </p>
        </div>
      </div>
      {/* </div> */}
    </main>
  );
}
