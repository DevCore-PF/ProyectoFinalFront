import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>HOME</h1>
      <div className="flex gap-2">
        <Link href={"/register"}>REGISTER</Link>
        <Link href={"/login"}>LOGIN</Link>
        <Link href={"/role"}>ROLE</Link>
        <Link href={"/professionalForm"}>FORM</Link>
      </div>
    </main>
  );
}
