import { type NextPage } from "next";
import { Sidebar } from "~/components/sideBar";
import AddFriend from "./add";
import Link from "next/link";
import { Icons } from "~/components/ui/icons";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import NotFound from "../NotFound";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  if (!sessionData?.user) return <NotFound />;

  return (
    <>
      <div className="flex h-screen w-full">
        <div className="hidden h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 md:flex">
          <Sidebar />
        </div>
        <aside className="container max-h-screen w-full py-16 md:py-12"></aside>
      </div>
    </>
  );
};

export default Home;
