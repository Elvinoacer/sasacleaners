import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";

export default async function AdminContact() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/admin/login");
  }
  return (
    <main>
      <h1>Contact Submissions</h1>
      {/* List/view contact form submissions */}
    </main>
  );
}
