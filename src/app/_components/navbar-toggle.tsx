"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaBars, FaGithub } from 'react-icons/fa';
import { CgDarkMode } from 'react-icons/cg';
import SearchInput from './SearchBox';


export default function NavbarToggle({ userId, userName }: { userId: string | null, userName: string | null }) {
  const [isOpen, setIsOpen] = useState(false);



  return (
    <nav className="h-16 top-0 right-0 box-border w-full lg:hidden">
      <div className="prose prose-xl mx-auto flex items-center flex-col justify-items-end">
        {/* Other elements */}
        <button
          className="align-middle lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaBars />
        </button>
        {isOpen && (
          <div 
            className="absolute z-50 top-14 right-0 min-w-full sm:min-w-72 p-4 sm:rounded-bl-xl flex flex-col bg-white/25 backdrop-blur-md text-center shadow-xl sm:text-right"
          >
            
            <div className="prose prose-xl mx-auto flex-row allign-middle gap-10 py-[0.5rem] lg:hidden">
                <SearchInput />
            </div>


            

            {userId && (
              <>
                <Link href={`/profile/${userId}`} className="p-4 hover:bg-neutral-300/30 rounded-xl sm:hidden">{userName}&apos;s Profile</Link>
                <Link href="/create-post" className="p-4 whitespace-nowrap hover:bg-neutral-300/30 rounded-xl sm:hidden">Create New Post</Link>
              </>
            )}
            
            <Link href="/" className='p-4 hover:bg-neutral-300/30 rounded-xl sm:hidden'>Home</Link>
            <Link href="/authors" className='p-4 hover:bg-neutral-300/30 rounded-xl sm:hidden'>Authors</Link>
            <div className="p-4 hover:bg-neutral-300/30 rounded-xl items-center sm:hidden"><Link href="https://github.com/ngk-t/A-Blog-Plarform" >Project&apos;s GitHub</Link></div>
            <div className='mt-4 justify-center m-2 '>
              <Link 
                href={userId ? "/api/auth/signout" : "/api/auth/signin"} 
                className="w-48 rounded-full bg-neutral-900 px-8 py-2 font-semibold no-underline transition hover:bg-neutral-900/80 text-center text-sm text-white"
                >
                  {userId ? "Sign out" : "Sign in"}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
