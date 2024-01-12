import Link from "next/link";
import { FaBars, FaMagnifyingGlass, FaGithub } from "react-icons/fa6";
import { CgDarkMode } from "react-icons/cg";

export default function Navbar() {
    return(
        <nav className="h-25 fixed top-0 z-10 box-border w-full bg-white bg-opacity-25 p-4 backdrop-blur-md border-3 border-white border-opacity-10 shadow-lg shadow-neutral-200/80">
            <div className="prose prose-xl mx-auto flex justify-between flex-col sm:flex-row">
                <div className="prose prose-xl mx-auto">
                    <Link href="/" className="text-black/70 no-underline hover:text-black">Home</Link>
                </div>
                <div className="prose prose-xl mx-auto">
                    <Link href="/" className="text-black/70 no-underline hover:text-black">Home</Link>
                </div>
                <div className="prose prose-xl mx-auto flex flex-row allign-middle gap-10">
                    <Link href="https://github.com/ngk-t/A-Blog-Plarform" ><FaGithub /></Link>
                    <Link href="/" ><CgDarkMode /></Link>
                    <Link href="/" className="text-black/70 no-underline hover:text-black"><FaMagnifyingGlass /></Link>
                    <Link href="/" ><FaBars /></Link>
                </div>
            </div>
        </nav>
    )
}

