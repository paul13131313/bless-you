import Feed from "@/components/Feed";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <header className="py-6 text-center">
        <h1
          className="text-sm tracking-wide"
          style={{
            fontFamily: "'EB Garamond', serif",
            color: "#999",
            fontSize: "15px",
          }}
        >
          bless you
        </h1>
      </header>
      <Feed />
    </main>
  );
}
