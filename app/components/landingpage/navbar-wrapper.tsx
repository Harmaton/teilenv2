
import { getAuthUser } from "@/lib/auth";
import Navbar from "./navbar";

export default async function NavbarWrapper() {
  const result = await getAuthUser();
  return <Navbar initialUser={result.success ? result.user : null} />;
}