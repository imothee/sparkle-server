"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function Page() {
  const [password, setPassword] = useState("");

  return (
    <section className="h-screen">
      <div className="h-full">
        <div className="container mx-auto p-4">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              signIn("credentials", {
                redirect: false,
                password,
                //callbackUrl: `${window.location.origin}/admin`,
              });
            }}
          >
            <div className="relative my-6" data-te-input-wrapper-init>
              <input
                type="password"
                name="password"
                className="peer block min-h-[auto] w-full rounded border-0 px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                id="exampleFormControlInput22"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <label
                htmlFor="exampleFormControlInput22"
                className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[1.15rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
              >
                Password
              </label>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
