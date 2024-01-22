import Link from "next/link";
import { getServerSession } from "next-auth/next"
import { authOptions } from "~/server/auth";
import { redirect } from 'next/navigation';
import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import { CreatePost } from "../_components/create-post";
export default async function Page() {

    const session = await getServerSession(authOptions)

    if (!session) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#ffffff] from-65% to-[#ffffff] to-98%  text-neutral-700">    
        
                <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">    
                
                    <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
                        <span className="text-[#cfb225]">An blog</span> website
                    </h1>

                    <p className="text-3xl font-extrabold">Please log in to create post</p>
                </div>
            </main>
        )
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-white  text-neutral-700">
            <div> 
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-[5rem]">Create new post</h1>
            </div>
            <div className="py-12">
                <CreatePost />
            </div>
        </main>
         
    )
}    

