"use client";

import { FC } from "react";
import { api } from "~/utils/api";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Messages from "./Messages";
import ChatInput from "./ChatInput";

const ChatLayout: FC<{ chatId: string }> = ({ chatId }) => {
  const session = useSession().data;
  const chatPartner = api.Chat.chatPartner.useQuery({ chatId }).data as User;
  const initialMessages = api.Chat.ChatMessages.useQuery({
    chatId: chatId,
  }).data;

  if (chatPartner && initialMessages) {
    return (
      <div className="flex h-full max-h-[calc(100vh-6rem)] flex-1 flex-col justify-between">
        <div className="flex justify-between border-b-2 border-gray-200 py-3 sm:items-center">
          <div className="relative flex items-center space-x-4">
            <div className="relative">
              <div className="relative h-8 w-8 sm:h-12 sm:w-12">
                <Image
                  fill
                  referrerPolicy="no-referrer"
                  src={chatPartner.image}
                  alt={`${chatPartner.name} profile picture`}
                  className="rounded-full"
                />
              </div>
            </div>

            <div className="flex flex-col leading-tight">
              <div className="flex items-center text-xl">
                <span className="mr-3 font-semibold text-gray-700">
                  {chatPartner.name}
                </span>
              </div>

              <span className="text-sm text-gray-600">{chatPartner.email}</span>
            </div>
          </div>
        </div>

        <Messages
          chatId={chatId}
          chatPartner={chatPartner}
          sessionImg={session?.user.image}
          sessionId={session?.user.id as string}
          initialMessages={initialMessages}
        />
        <ChatInput chatId={chatId} chatPartner={chatPartner} />
      </div>
    );
  }
};

export default ChatLayout;
