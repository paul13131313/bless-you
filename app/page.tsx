import Feed from "@/components/Feed";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <header className="py-6 text-center">
        <h1
          style={{
            fontFamily: "'Caveat', cursive",
            color: "#bbb",
            fontSize: "20px",
            letterSpacing: "2px",
          }}
        >
          yaaawn
        </h1>
      </header>
      <Feed />
    </main>
  );
}
