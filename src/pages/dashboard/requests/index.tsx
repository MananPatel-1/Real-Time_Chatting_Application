import FriendRequests from "~/components/FriendRequests";
import { api } from "~/utils/api";
import { Sidebar } from "~/components/sideBar";

const index = () => {
  const { data } = api.Friend.incomingFriendRequests.useQuery();

  if (data) {
    return (
      <div className="flex h-screen w-full">
        <div className="hidden h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 md:flex">
          <Sidebar />
        </div>
        <aside className="container max-h-screen w-full py-16 md:py-12">
          <main className="pt-8">
            <h1 className="mb-8 text-5xl font-bold">Add a friend</h1>
            <div className="flex flex-col gap-4">
              <FriendRequests incomingFriendRequests={data} />
            </div>
          </main>
        </aside>
      </div>
    );
  }
};

export default index;
