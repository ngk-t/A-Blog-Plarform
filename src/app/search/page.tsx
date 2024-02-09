"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import getFormattedDate from "lib/getFormattedDate";
// import DOMPurify from 'dompurify';
// import { JSDOM } from 'jsdom';

type Post = {
  id: string;
  Title: string;
  content: string;
  createdBy: {
    name: string;
  };
};

const SearchPage = () => {
  const search = useSearchParams();
  const searchQuery = (search ? search.get('q') : null) ?? "";
  const encodedSearchQuery = encodeURI(searchQuery ?? "");


  const stripHTMLTags = (html: string) => {
    return html.replace(/<[^>]*>?/gm, '');
  }


  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  console.log("SEARCH PARAMS:",searchQuery)

  const searchPosts = api.post.getSearch.useQuery({query: searchQuery});

  useEffect(() => {
    const fetchData = async () => {
      if (encodedSearchQuery) {
        setLoading(true);
        try {
          await searchPosts.refetch();
        } catch (error) {
          console.error("An error occurred:", error);
        }
      }
    };
    
    fetchData().catch(error => console.error("An error occurred:", error));
  }, [encodedSearchQuery]);
  
  
  

  if (searchPosts.status === 'loading') {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-white  text-neutral-700 overflow-auto">
            <div className="bg-[#f4f4f4] p-3 content-center w-full h-64 flex items-center justify-center">
                <h1 className="text-3xl font-extrabold tracking-tight ">
                Loading...
                </h1>
            </div>
        </main>
    );
  }

  if (searchPosts.status === 'error') {
    return <div>Error: {searchPosts.error?.message}</div>;
  }

  const postsData = searchPosts.data ?? [];
  console.log("SEARCH RESULTS", postsData)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white  text-neutral-700 overflow-auto">
      <div className="bg-[#f4f4f4] p-3 content-center w-full h-64 flex items-center justify-center">
        <h1 className="text-3xl sm:text-[3.3rem] font-extrabold tracking-tight">
          Search Results for: &ldquo;{searchQuery}&rdquo;
        </h1>
      </div>



      <div>
        {postsData.filter(post => !post.archived).map((post) => {
            
            const formattedDate = getFormattedDate(post.createdAt.toISOString());

            return (
                <div 
                  key={post.id}
                  className="my-4 m-4 flex relative max-w-prose flex-col gap-4 rounded-xl shadow-md bg-sky-800" 
                  style={{
                    backgroundImage: `url(${post.coverPictureURL})`,
                    backgroundSize: 'cover',
                  }}
                >
                    <div className="flex bg-neutral-50/70 rounded-b-xl sm:rounded-xl p-4 hover:bg-neutral-200/80 backdrop-blur-2xl mt-12 sm:m-4 sm:columns-2">
                      {/* Main content */}
                      <div className="flex-grow sm:w-96">
                        <Link className="hover:text-black/70 hover:underline dark:hover:text-white no-underline text-2xl font-bold" href={`/posts/${post.id}`}>{post.Title}</Link>
                        <p className="text-xs my-2">by <span className="font-bold">{post.createdBy.name}</span></p>
                        <p className="text-xs my-2">{formattedDate}</p>
                        <p className="mt-0 text-left text-sm text-neutral-500">
                          {post.content ? stripHTMLTags(post.content).slice(0, 250) + "..." : ""}
                        </p>
                      </div>
                      
                      
                      {/* Author's profile pic */}
                      <div className="sm:w-32 sm:h-32 hidden sm:ml-4 sm:block">
                        <Link href={`/profile/${post.createdById}`} key={post.createdById} className="text-md flex flex-col items-center hover:underline">
                          <img
                            src={`${post.createdBy.image}`}
                            alt="Profile Picture"
                            className="h-20 w-20 mt-4 rounded-full"
                          />
                          <span className="mt-6 font-bold">{`${post.createdBy.name}`}</span>
                        </Link>
                      </div>  



                    </div>
                </div>
            )
          
        })}

        {postsData.length === 0 && <p className="font-bold p-4" >No results found</p>}

      </div>
    </main>
  );
};

export default SearchPage;
