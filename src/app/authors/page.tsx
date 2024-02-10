import Link from "next/link";
import { api } from "~/trpc/server";

export const metadata = {
    title: "Authors - An Blog Website",
    description: "A Blog Platform by ngk-t",
    icons: [{ rel: "icon", url: "/icon.png" }],
  };
  



export default async function Authors() {
  
  
  // Fetch all authors
  const authorsData = await api.post.getAllAuthors.query();
  // Sort authors alphabetically by name
  const sortedAuthorsData = authorsData.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white  text-neutral-700 overflow-auto mt-24">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
            <h1 className="prose text-left text-4xl font-extrabold tracking-tight sm:text-[3.5rem]">
                <span className="bg-[#ead985] text-3x1 font-serif italic box-decoration-clone text-[#ffffff] pl-4 pr-4 mr-2 py-[0.3rem]">
                    an Blog
                </span>{""}
            website
            </h1>

            <p className="text-3xl font-extrabold">
                All Authors
            </p>
        </div>
        <div className="lg:bg-white  mt-4 rounded-xl w-80">
            {sortedAuthorsData.map((author) => (
              <Link href={`/profile/${author.id}`} key={author.id}>
                <div key={author.id} className="lg:bg-neutral-50/50 hover:bg-neutral-200 w-72 h-15 overflow-visible flex items-center rounded-xl backdrop-blur-2xl lg:shadow-lg lg:gap-2 p-3 m-4">
                  <img
                    src={`${author.image}`}
                    alt={`${author.name}`} 
                    className="h-20 w-20 rounded-full mr-3"
                  />
                  <h3 className="font-semibold lg:font-bold">{author.name}</h3>
                </div>
              </Link>
            ))}
          </div>       
    </main>
)}