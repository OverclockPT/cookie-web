import { Button } from "~/components/ui/interactive/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tightest sm:text-[5rem]">
          Cookie
        </h1>
        <Button>Click Me</Button>
      </div>
    </main>
  );
}