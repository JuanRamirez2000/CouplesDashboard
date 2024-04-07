"use client";

import { createClient } from "@/utils/supabase/client";
import {
  faDiscord,
  faGoogle,
  faSpotify,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { login, signup } from "./actions";

const supabase = createClient();

export default function Page() {
  return (
    <main className="w-screen h-screen flex items-center justify-center">
      <section className="w-96 bg-zinc-800 p-8 rounded-xl flex flex-col gap-8 ">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-200 tracking-tight">
            Couple&apos;s Dashboard
          </h1>
          <p className="text-zinc-200/50">
            Sign in today to see your dashboard
          </p>
        </div>
        <div className="flex flex-row gap-2 w-full justify-around">
          <FontAwesomeIcon
            icon={faGoogle}
            className="size-5 py-3 bg-primary rounded-lg text-primary-content cursor-pointer duration-75 hover:scale-110 transition-all w-full"
            onClick={() =>
              supabase.auth.signInWithOAuth({
                provider: "google",
              })
            }
          />
          <FontAwesomeIcon
            icon={faDiscord}
            className="size-5 py-3 bg-primary rounded-lg text-primary-content cursor-pointer duration-75 hover:scale-110 transition-all w-full"
            onClick={() =>
              supabase.auth.signInWithOAuth({
                provider: "discord",
              })
            }
          />
          <FontAwesomeIcon
            icon={faSpotify}
            className="size-5 py-3 bg-primary rounded-lg text-primary-content cursor-pointer duration-75 hover:scale-110 transition-all w-full"
            onClick={() =>
              supabase.auth.signInWithOAuth({
                provider: "spotify",
              })
            }
          />
        </div>
        <div>
          <form className="flex flex-col gap-1">
            <label htmlFor="email" className="">
              Email:
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="rounded-lg p-2"
            />
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="rounded-lg p-2"
            />
            <div className="flex gap-10 pt-8">
              <button
                formAction={signup}
                className="py-2 bg-primary rounded-lg text-primary-content cursor-pointer duration-75 hover:scale-110 transition-all w-1/2"
              >
                Sign up
              </button>
              <button
                formAction={login}
                className="py-2 bg-primary rounded-lg text-primary-content cursor-pointer duration-75 hover:scale-110 transition-all w-1/2"
              >
                Log in
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
