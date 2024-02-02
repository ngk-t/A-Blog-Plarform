"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import getFormattedDate from "lib/getFormattedDate";

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

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  console.log("SEARCH PARAMS:",searchQuery)

  const searchPosts = api.post.getSearch.useQuery({query: searchQuery});

  useEffect(() => {
    const fetchData = async () => {
      if (encodedSearchQuery) {
        setLoading(true);
        await searchPosts.refetch();
      }
    };
  
    fetchData();
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
        <h1 className="text-3xl font-extrabold tracking-tight ">
          Search Results for: {searchQuery}
        </h1>
      </div>
      <div>
        {postsData.filter(post => !post.archived).map((post) => {
            
            const formattedDate = getFormattedDate(post.createdAt.toISOString());

            return (
                <div key={post.id}>
                    <li className="flex max-w-prose flex-col gap-4 rounded-xl bg-neutral-700/10 p-4 hover:bg-neutral-700/20 my-4">
                        <Link className="hover:text-black/70 dark:hover:text-white no-underline text-2xl font-bold" href={`/posts/${post.id}`}>{post.Title}</Link>
                        <p className="text-xs">by <span className="font-bold">{post.createdBy.name}</span></p>
                        <p className="text-xs">{formattedDate}</p>
                        <p className="text-sm mt-0 text-justify">{post.content ? post.content.slice(0, 150) : ''}...</p>
                    </li>
                </div>
            )
          
        })}
      </div>
    </main>
  );
};

export default SearchPage;
