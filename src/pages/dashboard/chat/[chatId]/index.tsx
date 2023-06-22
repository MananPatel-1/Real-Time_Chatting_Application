import { FC } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import NotFound from "~/pages/NotFound";
import { api } from "~/utils/api";
import ChatLayout from "~/components/ChatLayout";
import { Sidebar } from "~/components/sideBar";

const Index: FC = () => {
  const router = useRouter();
  const session = useSession();
  if (!session) return <NotFound />;

  const chatId = router.query.chatId as string;

  return (
    <div className="flex h-screen w-full">
      <div className="hidden h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 md:flex">
        <Sidebar />
      </div>
      <aside className="container max-h-screen w-full py-16 md:py-12">
        <div>{chatId && <ChatLayout chatId={chatId.toString()} />} </div>
      </aside>
    </div>
  );
};

export default Index;
