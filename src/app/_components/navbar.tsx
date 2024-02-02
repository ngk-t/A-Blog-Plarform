import Link from "next/link";
import { FaBars, FaMagnifyingGlass, FaGithub } from "react-icons/fa6";
import { CgDarkMode } from "react-icons/cg";
import { getServerSession } from "next-auth/next"
import { getServerAuthSession } from "~/server/auth";
import { authOptions } from "~/server/auth";
import SearchInput from "./SearchBox";


export default async function Navbar() {

    const session = await getServerAuthSession()
    

    return(
        <nav className="h-25 fixed top-0 z-10 box-border w-full bg-white bg-opacity-25 p-4 backdrop-blur-md border-3 border-white border-opacity-10">
            <div className="prose prose-xl mx-auto flex justify-between flex-col sm:flex-row">
                <div className="prose prose-xl mx-auto">
                    <Link href="/" className="text-black/70 no-underline hover:text-black">Home</Link>
                </div>
                <div className="prose prose-xl mx-auto flex flex-row allign-middle gap-10">
                    <SearchInput />
                </div>
                <div className="prose prose-xl mx-auto flex flex-row allign-middle gap-10">
                    {/* {status === "authenticated" && (<p> <span>Create New Post</span> </p>)} */}
                    <Link href={`/profile/${session?.user?.id}`} className="text-black/70 no-underline hover:text-black"> {session && <span>Profile</span>} </Link>
                    <Link href="/create-post" className="text-black/70 no-underline hover:text-black"> {session && <span>Create New Post</span>} </Link>
                    <Link href="https://github.com/ngk-t/A-Blog-Plarform" ><FaGithub /></Link>
                    <Link href="/" ><CgDarkMode /></Link>
                    {/* <Link href="/" className="text-black/70 no-underline hover:text-black"><FaMagnifyingGlass /></Link> */}
                    <Link href="/" ><FaBars /></Link>
                </div>
            </div>
        </nav>
    )
}

