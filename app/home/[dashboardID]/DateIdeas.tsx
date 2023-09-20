"use client";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { FormEvent, useState } from "react";
import { Input } from "@nextui-org/react";

export default function DateIdeas({
  dashboardId,
}: {
  dashboardId: Id<"dashboard">;
}) {
  const ideas = useQuery(
    api.dateIdea.getDateIdeas,
    dashboardId !== null ? { dashboardId: dashboardId } : "skip"
  );
  const submitNewIdea = useMutation(api.dateIdea.saveDateIdea);
  const deleteIdea = useMutation(api.dateIdea.deleteDateIdea);
  const [newIdea, setNewIdea] = useState<string>("");
  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submitNewIdea({
      dashboardId: dashboardId,
      idea: newIdea,
    });
    setNewIdea("");
  };
  return (
    <div className="h-full w-full bg-slate-800 text-slate-100 rounded-lg p-4 flex flex-col gap-2 ">
      <h2 className="text-2xl font-medium tracking-tight underline">
        Date Ideas
      </h2>
      <div className="grow overflow-y-auto">
        {ideas?.map((idea) => {
          return (
            <div key={idea._id} className="flex flex-row items-baseline">
              <span className="text-lg">{idea.idea}</span>
              <button onClick={() => deleteIdea({ idea: idea?._id })}>
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
      <form onSubmit={handleFormSubmit} className="flex flex-row gap-2">
        <Input
          type="text"
          value={newIdea}
          onChange={(e) => setNewIdea(e.target.value)}
          className="w-64 rounded-l-lg text-black"
        />
        <button type="submit" className="p-2 bg-gray-600 rounded-lg">
          Add
        </button>
      </form>
    </div>
  );
}
