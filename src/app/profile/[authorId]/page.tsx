
import Link from "next/link";


import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import getFormattedDate from "lib/getFormattedDate";
import { PostActions } from "~/app/_components/PostActions";
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

export async function generateMetadata({ params }: { params: { authorId: string } }) {
  const { authorId } = params;
  const author = await api.post.getAuthor.query({ id: authorId });
  return {
    title: `${author?.name}'s Profile - An Blog Website`, 
    description: "A Blog Platform by ngk-t",
    icons: [{ rel: "icon", url: "/icon.png" }],
  }
}



export default async function Profile({ params } : { params : {authorId : string}}) {
  
  const { authorId } = params;
  const session =  await getServerAuthSession();
  const data = await api.post.getAll.query();
  const author = await api.post.getAuthor.query({ id: authorId });
  
  // Fetch all authors
  const authorsData = await api.post.getAllAuthors.query();
  // Sort authors alphabetically by name
  const sortedAuthorsData = authorsData.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));

  const createMarkup = (html : string) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };
  
  const getPlainText = (html : string) => {
    const dom = new JSDOM(html);
    return dom.window.document.body.textContent ?? "";
  }



  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white  text-neutral-700 overflow-auto">
      <div className="bg-[#e9d051] p-3 content-center w-full h-40 sm:h-64 flex items-center justify-center">
        {/* <h1 className="text-3xl font-extrabold tracking-tight sm:text-[2rem] md:text-[4rem] lg:text-[5rem]">
          {author?.name}&apos;s Profile
        </h1> */}
      </div>

      {/* Profile Pic */}

      <div className="-translate-y-10 md:-translate-y-16 lg:-translate-y-20">
        <img
          src={`${author?.image}`}
          alt={`${author?.name}`} 
          className="h-20 w-20 md:h-32 md:w-32 lg:h-40 lg:w-40 rounded-full"
        />

      <h1 className="text-3xl font-extrabold tracking-tight m-4 sm:text-[3rem] md:text-[4rem] md:mt-10 lg:text-[5rem]">
          {author?.name}&apos;s Profile
        </h1>

      </div>

      {/* Main Content */}
      <div className="flex flex-row gap-2 lg:gap-6 md:columns-2 lg:columns-3">
          
          {/* AUTHORS */}

          <div className="lg:bg-white  mt-4 rounded-xl hidden lg:block md:w-48 lg:w-80">
            <h2 className="mt-6 ml-4 lg:ml-8 font-bold font-sans text-2xl">
              All Authors
            </h2>
            {sortedAuthorsData.map((author) => (
              <Link href={`/profile/${author.id}`} key={author.id}>
                <div key={author.id} className="lg:bg-neutral-50/50 hover:bg-neutral-200 md:w-36 lg:w-72 h-15 overflow-visible flex items-center rounded-xl backdrop-blur-2xl lg:shadow-lg lg:gap-2 p-3 m-4">
                  <img
                    src={`${author.image}`}
                    alt={`${author.name}`} 
                    className="h-20 w-20 rounded-full hidden lg:block"
                  />
                  <h3 className="font-semibold lg:font-bold">{author.name}</h3>
                </div>
              </Link>
            ))}
          </div>


        {/* BLOG FEED */}

        <div>
          {data
            ?.filter((post) => {
              // Only show posts that are not archived if the current session ID doesn't match with the author ID
              if (post.createdById !== session?.user.id && post.archived) {
                return false;
              }
              return post.createdById === authorId;
            })
            .map((post) => {
              // Format the updatedAt date
              const formattedDate = getFormattedDate(
                post.createdAt.toISOString(),
              );

              return (
                <div 
                  key={post.id}
                  className="my-4 mx-4 flex relative max-w-prose flex-col gap-4 rounded-xl shadow-md bg-sky-800" 
                    style={{
                      backgroundImage: `url(${post.coverPictureURL})`,
                      backgroundSize: 'cover',
                    }}
                >
                  
                    <div className="flex max-w-prose flex-col gap-4 rounded-b-xl sm:rounded-xl bg-neutral-50/70 hover:bg-neutral-200/80 backdrop-blur-2xl p-4 mt-12 sm:m-4 ">
                      <div className="flex flex-col sm:flex-none justify-items-start  sm:justify-between">
                        
                        
                        
                        <Link
                          className="text-2xl font-bold no-underline hover:text-black/70 hover:underline dark:hover:text-white"
                          href={`/posts/${post.id}`}
                        >
                          {post.Title}
                        </Link>


                        {/* Import PostActions Buttons as client component */}
                        <div>

                          {post.createdById === session?.user.id && <PostActions postId={post.id} archived={post.archived ?? false} />}

                        </div>
                      </div>
                      {/* Shows Date */}
                      <p className="text-xs">{formattedDate}</p>

                      {/* Shows Archive Status */}
                      {post.archived && <p className="text-red-500 font-bold no-underline ">[ARCHIVED]</p>}
                      
                      {/* Shows Post Content Preview */}
                      <p className="mt-0 text-left text-sm text-neutral-500">
                          {post.content ? getPlainText(post.content).slice(0, 250) + "..." : ""}
                      </p>
                    </div>
                  
                </div>
              );
            })}
        </div>




        {/* Place-holder */}
        <div className="hidden lg:block lg:w-80">
              {/* Something Here */}
        </div>


        
      </div>
    </main>
  );
}
