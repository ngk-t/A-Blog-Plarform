"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { FaBars, FaMagnifyingGlass, FaGithub } from "react-icons/fa6";

const SearchInput = () => {
  const search = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string | null>(
    search ? search.get("q") : "",
  );
  const router = useRouter();

  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();

    if (typeof searchQuery !== "string") {
      return;
    }

    const encodedSearchQuery = encodeURI(searchQuery);
    router.push(`/search?q=${encodedSearchQuery}`);
  };

  return (
    <form className="flex w-full justify-center" onSubmit={onSearch}>
      <input
        value={searchQuery ?? ""}
        onChange={(event) => setSearchQuery(event.target.value)}
        className="w-full rounded-l-full border-y-2 border-l-2 border-neutral-900 bg-neutral-400/25 px-4 py-2 text-left text-black focus:outline-none"
        placeholder="Search"
      />
      <button
        type="submit"
        className="rounded-r-full bg-neutral-400/25 border-y-2 border-r-2 border-neutral-900 px-4 py-3 font-semibold no-underline transition hover:bg-neutral-400/10"
      >
        <FaMagnifyingGlass />
      </button>
    </form>
  );
};

export default SearchInput;
