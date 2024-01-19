import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import getFormattedDate from "lib/getFormattedDate";


// export default function generateMetadata({ params } : { params : {postId : string}}) {
//     const postId = params

// }



export default async function Post({ params } : { params : {postId : string}}) {
    
    const {postId} = params
    const data = await api.post.getOne.query({ id: postId });
    
    if (!data) {
        return notFound()
    }
    
    const formattedDate = getFormattedDate(data.updatedAt.toISOString());

    // const formattedDate = getFormattedDate(Post.updatedAt.toISOString());


    return(
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#ffffff] from-60% to-white to-98%  text-neutral-700">
            
            <div className="flex max-w-prose flex-col gap-4 rounded-xl bg-neutral-200/20 p-4 my-10 ">
                <div className="whitespace-pre-line break-words space-y-4">
                    
                    <h1 className="text-5xl font-bold">{`${data.Title}`}</h1>
                    {/* <p>{`${data?.createdBy.name}`}</p> */}
                    <p className="text-xs">{formattedDate}</p>
                    
                    <p className="text-sm mt-0 text-justify indent-4 leading-relaxed">{`${data.content}`}</p>
                    
                </div>
            </div>
        </main>
        
    )
}