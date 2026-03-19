"use client";

import { logoutAction } from "@/lib/actions";

export function LogoutForm() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
      >
        Log out
      </button>
    </form>
  );
}
