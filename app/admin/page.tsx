import { auth } from "@/lib/auth";
import Login from "@/components/login";

export default async function Page() {
  const session = await auth();

  if (session === null) {
    return <Login />;
  }

  return (
    <div>
      <h1>Admin</h1>
    </div>
  );
}
