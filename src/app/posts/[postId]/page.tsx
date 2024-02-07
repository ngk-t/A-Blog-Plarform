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
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#ffffff] from-60% to-white to-98%  text-neutral-700 z-0 relative bg-clip-border">
            <div className="bg-[#e9d051] absolute content-center w-full h-2/3 flex flex-col items-center justify-center top-0 -z-1">
                
                
                
                {/* <h1 className="text-3xl font-extrabold tracking-tight sm:text-[2rem] md:text-[4rem] lg:text-[5rem]">
                Page Title
                </h1> */}
                <div className="h-screen w-screen border-4 border-neutral-200 rounded shadow-2xl ">
                    <img 
                        className="object-fill h-full w-full" 
                        src={`${data.coverPictureURL}`} 
                    />
                </div>

                
            {/* </div> */}
                <div className="flex max-w-prose flex-col gap-4 rounded-xl p-4 mt-30 z-1  absolute top-1/2 text-neutral-800 pb-10">
                    <div className="whitespace-pre-line break-words bg-neutral-50/40 rounded-xl text-pretty p-4 space-y-4 backdrop-blur-2xl transform-gpu shadow-2xl">
                        
                        <h1 className="text-5xl font-bold">{`${data.Title}`}</h1>
                        <p className="text-md">by <span className="font-bold">{`${data?.createdBy.name}`}</span></p>
                        <p className="text-xs">{formattedDate}</p>
                        
                        <div className="text-sm mt-0 text-justify indent-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: data.content ?? "" }}/>
                        
                    </div>
                </div>
            </div>
        </main>
        
    )
}