"use client";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { TrashIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  CardBody,
  RadioGroup,
  Radio,
  Input,
} from "@nextui-org/react";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { useState, FormEvent } from "react";

type moodType = "Happy" | "Sad" | "Angry";

export default function UserCard({
  userData,
  userType,
}: {
  userData: Doc<"users">;
  userType: "user" | "partner";
}) {
  const userNotes = useQuery(
    api.userNotes.grabUserNotes,
    userData?._id !== null ? { userId: userData?._id } : "skip"
  );
  const saveUserNote = useMutation(api.userNotes.saveUsernote);
  const setUserMood = useMutation(api.users.changeMood);
  const deleteUserNote = useMutation(api.userNotes.deleteUserNote);
  const [newUserNote, setNewUserNote] = useState<string>("");

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await saveUserNote({
      note: newUserNote,
      userId: userData?._id,
    });
    setNewUserNote("");
  };

  return (
    <Card
      className={`h-full w-full ${
        userType === "user" ? "bg-sky-500" : "bg-emerald-500"
      }`}
    >
      <CardHeader className="p-2 flex flex-col">
        <small>{userData?.name}</small>
        <div className="relative h-56 w-56">
          <Image
            src={userData?.picture}
            alt={userData?.email}
            fill
            className="rounded-full ring-4 ring-sky-800"
          />
        </div>
      </CardHeader>
      <CardBody className="flex flex-col items-center gap-2">
        <div>
          {userType === "user" ? (
            <RadioGroup orientation="horizontal" defaultValue={userData?.mood}>
              <Radio
                value={"Happy"}
                onClick={() => setUserMood({ mood: "Happy" })}
              >
                Happy
              </Radio>
              <Radio value={"Sad"} onClick={() => setUserMood({ mood: "Sad" })}>
                Sad
              </Radio>
              <Radio
                value={"Angry"}
                onClick={() => setUserMood({ mood: "Angry" })}
              >
                Angry
              </Radio>
            </RadioGroup>
          ) : (
            <div>{userData?.mood}</div>
          )}
        </div>
        <div className="flex flex-col">
          {userNotes?.map((note) => {
            return (
              <div key={note._id}>
                <span className="text-lg"> {note.note} </span>
                <button onClick={() => deleteUserNote({ noteId: note._id })}>
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            );
          })}
          <form className="flex flex-row gap-2" onSubmit={handleFormSubmit}>
            <Input
              type="text"
              value={newUserNote}
              onChange={(e) => setNewUserNote(e.target.value)}
              className="w-3/4 rounded-lg text-black"
            />
            <button type="submit" className="p-2 bg-gray-600 rounded-lg">
              Add
            </button>
          </form>
        </div>
      </CardBody>
    </Card>
  );
}
