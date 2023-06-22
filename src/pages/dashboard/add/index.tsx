"use client";
import { FC } from "react";

import { FriendForm } from "~/components/addFriendForm";
import { Sidebar } from "~/components/sideBar";

const AddFriend: FC = ({}) => {
  return (
    <div className="flex h-screen w-full">
      <div className="hidden h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 md:flex">
        <Sidebar />
      </div>
      <aside className="container max-h-screen w-full py-16 md:py-12">
        <main className="pt-8">
          <h1 className="mb-8 text-5xl font-bold">Add a friend</h1>
          <FriendForm />
        </main>
      </aside>
    </div>
  );
};

export default AddFriend;
