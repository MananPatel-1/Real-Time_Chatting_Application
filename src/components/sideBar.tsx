import { cn } from "~/lib/utils";
import Link from "next/link";
import { Icons } from "./ui/icons";
import { useSession } from "next-auth/react";
import Image from "next/image";
import SignOutButton from "./SignOutButton";
import FriendRequestSidebarOptions from "./FriendRequestSidebarOptions";
import { api } from "~/utils/api";
import SidebarChatList from "./SidebarChatList";

export function Sidebar() {
  const { data: sessionData } = useSession();
  const Icon = Icons["UserPlus"];

  const friends = api.Friend.allFriends.useQuery().data;

  function FriendRequests() {
    const unseenRequestCount = api.Friend.friendRequestID.useQuery().data
      ?.length as number;

    if (unseenRequestCount) {
      return (
        <FriendRequestSidebarOptions
          sessionId={sessionData?.user.id}
          initialUnseenRequestCount={unseenRequestCount}
        />
      );
    }
  }

  return (
    <nav className="flex flex-1 flex-col">
      <Link href="/dashboard" className="flex h-14 shrink-0 items-center">
        <Icons.Logo className="h-8 w-auto text-indigo-600" />
      </Link>
      <ul role="list" className="flex flex-1 flex-col gap-y-7">
        {(friends?.length as number) > 0 ? (
          <div className="py-2">
            <h2 className="text-lg font-semibold tracking-tight">Your Chats</h2>
            <li>
              <SidebarChatList
                friends={friends as User[]}
                sessionId={sessionData?.user.id as string}
              />
            </li>
          </div>
        ) : null}
        <ul role="list" className="-mx-2 mt-2 space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">Discover</h2>
          <li>
            <FriendRequests />
          </li>
          <li>
            <Link
              href={"/dashboard/add"}
              className="group flex gap-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-[0.625rem] font-medium text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600">
                <Icon className="h-4 w-4" />
              </span>

              <span className="truncate">{"Add friend"}</span>
            </Link>
          </li>
        </ul>

        <li className="-mx-6 mt-auto flex items-center">
          <div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900">
            <div className="relative h-8 w-8 bg-gray-50">
              <Image
                fill
                referrerPolicy="no-referrer"
                className="rounded-full"
                src={sessionData?.user.image || ""}
                alt="Your profile picture"
              />
            </div>

            <div className="flex flex-col">
              <span aria-hidden="true">{sessionData?.user.name}</span>
              <span className="text-xs text-zinc-400" aria-hidden="true">
                {sessionData?.user.email}
              </span>
            </div>
            <SignOutButton className="aspect-square h-full" />
          </div>
        </li>
      </ul>
    </nav>
  );
}
