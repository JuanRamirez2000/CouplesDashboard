"use client";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { FormEvent, useState } from "react";
import { HeartIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { Input } from "@nextui-org/react";

export default function UserMessagesCard({
  userId,
  dashboardId,
}: {
  userId: Id<"users">;
  dashboardId: Id<"dashboard">;
}) {
  const messages = useQuery(
    api.messages.getChatMessages,
    dashboardId !== null ? { dashboardId: dashboardId } : "skip"
  );
  const submitNewMessage = useMutation(api.messages.saveNewMessage);
  const likeMessage = useMutation(api.messages.likeMessage);
  const [newMessage, setNewMessage] = useState<string>("");
  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submitNewMessage({
      senderId: userId,
      message: newMessage,
      dashboardId: dashboardId,
    });
    setNewMessage("");
  };
  return (
    <div className="h-full w-full bg-slate-800 rounded-lg p-4 flex flex-col gap-2 text-slate-100">
      <h2 className="text-2xl font-medium tracking-tight underline ">
        Message Board
      </h2>
      <div className="overflow-y-auto w-full flex flex-col gap-2 grow">
        {messages?.map((message) => {
          return (
            <div
              key={message._id}
              className={`w-full flex  grow ${
                message.senderId === userId ? "flex-row" : "flex-row-reverse "
              }`}
            >
              <div className="flex flex-col">
                <div className="text-xs opacity-70">
                  <time className="text-sm opacity-80">
                    {new Date(message._creationTime).toLocaleString("en-US", {
                      weekday: "long",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                      year: "numeric",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <div
                  className={`flex ${
                    message.senderId === userId
                      ? "flex-row"
                      : "flex-row-reverse"
                  } `}
                >
                  <p
                    className={`py-3 px-2.5 rounded-lg w-fit text-white ${
                      message.senderId === userId
                        ? "bg-sky-500 rounded-tl-none"
                        : "bg-emerald-500 self-end rounded-tr-none"
                    }`}
                  >
                    {message.message}
                  </p>
                  <button
                    className="self-end hover:text-red-400"
                    onClick={() => likeMessage({ messageId: message._id })}
                  >
                    <HeartIcon
                      className={`h-5 w-5 ${message.liked && "fill-red-400"}`}
                    />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <form onSubmit={handleFormSubmit} className="flex flex-row">
        <Input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="w-1/3 text-black"
        />
        <button type="submit">
          <PaperAirplaneIcon className="h-6 w-6" />
        </button>
      </form>
    </div>
  );
}
