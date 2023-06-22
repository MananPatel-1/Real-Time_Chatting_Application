"use client";
import { Check, UserPlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { api } from "~/utils/api";

interface FriendRequestsProps {
  incomingFriendRequests: IncomingFriendRequest[];
}

const FriendRequests: FC<FriendRequestsProps> = ({
  incomingFriendRequests,
}) => {
  const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(
    incomingFriendRequests
  );

  const accept = api.Friend.acceptFriend.useMutation();

  const deny = api.Friend.denyFriend.useMutation();

  const acceptFriend = (senderId: string) => {
    accept.mutate({ idToAdd: senderId });
    setFriendRequests((prev) =>
      prev.filter((request) => request.senderId !== senderId)
    );
  };

  const denyFriend = (senderId: string) => {
    deny.mutate({ idToDeny: senderId });
    setFriendRequests((prev) =>
      prev.filter((request) => request.senderId !== senderId)
    );
  };

  return (
    <>
      {friendRequests.length === 0 ? (
        <p className="text-sm text-zinc-500">Nothing to show here...</p>
      ) : (
        friendRequests.map((request) => (
          <div key={request.senderId} className="flex items-center gap-4">
            <UserPlus className="text-black" />
            <p className="text-lg font-medium">{request.senderEmail}</p>
            <button
              onClick={() => {
                acceptFriend(request.senderId);
              }}
              disabled={accept.isLoading}
              aria-label="accept friend"
              className="grid h-8 w-8 place-items-center rounded-full bg-indigo-600 transition hover:bg-indigo-700 hover:shadow-md"
            >
              <Check className="h-3/4 w-3/4 font-semibold text-white" />
            </button>

            <button
              onClick={() => denyFriend(request.senderId)}
              disabled={deny.isLoading}
              aria-label="deny friend"
              className="grid h-8 w-8 place-items-center rounded-full bg-red-600 transition hover:bg-red-700 hover:shadow-md"
            >
              <X className="h-3/4 w-3/4 font-semibold text-white" />
            </button>
          </div>
        ))
      )}
    </>
  );
};

export default FriendRequests;
