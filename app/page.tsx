import BirdMark from "./components/BirdMark";
import Hills from "./components/Hills";
import ViewerCount from "./components/ViewerCount";
import Waitlist from "./components/Waitlist";

export default function Home() {
  return (
    <section className="hero">
      <Hills />
      <div className="shade" />

      <a className="brand" href="/" aria-label="Wrenyn">
        <BirdMark />
        <span>wrenyn</span>
      </a>

      <main>
        <h1>Developer tools <span>that just work.</span></h1>
        <p className="sub">Fast, focused tools for the work you do every day as a developer. Join the waitlist for early access.</p>
        <Waitlist />
      </main>

      <ViewerCount />
    </section>
  );
}
