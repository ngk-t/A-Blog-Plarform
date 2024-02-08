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
        <nav className="h-16 fixed top-0 z-10 box-border w-full bg-white bg-opacity-25  backdrop-blur-md border-3 border-white border-opacity-10 ">
            <div className="prose prose-xl mx-auto flex justify-between flex-col sm:flex-row">
                <div className="prose prose-xl mx-auto allign-middle pt-4 hidden sm:block">
                    <Link href="/" className="text-black/70 no-underline hover:text-black">Home</Link>
                </div>
                <div className="prose prose-xl mx-auto flex-row allign-middle gap-10 py-[0.5rem] hidden lg:block">
                    <SearchInput />
                </div>
                <div className="prose prose-xl sm:mx-auto flex flex-row allign-middle gap-10 pt-4">
                    {/* {status === "authenticated" && (<p> <span>Create New Post</span> </p>)} */}
                    <Link href={`/profile/${session?.user?.id}`} className="text-black/70 no-underline hover:text-black hidden sm:flex "> {session && <span>Profile</span>} </Link>
                    <Link href="/create-post" className="text-black/70 no-underline hover:text-black hidden sm:flex "> {session && <span>Create New Post</span>} </Link>
                    <Link href="https://github.com/ngk-t/A-Blog-Plarform" className="text-black/70 no-underline hover:text-black hidden sm:flex "><FaGithub /></Link>
                    <Link href="/" className="text-black/70 no-underline hover:text-black hidden sm:flex "><CgDarkMode /></Link>
                    {/* <Link href="/" className="text-black/70 no-underline hover:text-black"><FaMagnifyingGlass /></Link> */}
                    <button
                        className="m-auto allign-middle lg:hidden"
                    >
                        <FaBars />
                    </button>
                </div>

            </div>
        </nav>
    )
}

