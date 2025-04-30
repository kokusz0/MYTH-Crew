export default function AboutPage() {
  return (
    <main className="min-h-[calc(100vh-73px)] p-4 bg-gradient-to-b from-blue-950 to-black">
      <div className="max-w-4xl mx-auto bg-black p-8 rounded-lg shadow-md border border-blue-900">
        <h1 className="text-3xl font-bold text-blue-400 mb-6 text-center">About MYTH Crew</h1>

        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-3">Who We Are</h2>
            <p className="text-gray-300">
              MYTH Crew is an elite group of players in the CnR gaming community. Founded with the vision of creating a
              tight-knit, skilled team of dedicated players, we've grown to become one of the most respected crews in
              the game.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-3">Our Mission</h2>
            <p className="text-gray-300">
              Our mission is to provide an exceptional gaming experience for all our members while maintaining a high
              standard of skill, loyalty, and respect. We believe in teamwork, strategic gameplay, and creating lasting
              friendships through our shared passion for CnR.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-3">What We Offer</h2>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>A supportive community of skilled players</li>
              <li>Regular crew events and activities</li>
              <li>Opportunities to improve your gameplay</li>
              <li>Exclusive crew benefits and resources</li>
              <li>A voice in crew decisions and direction</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-3">Join MYTH</h2>
            <p className="text-gray-300">
              We're always looking for dedicated, skilled players to join our ranks. If you're passionate about CnR,
              committed to improving your skills, and looking for a crew that values loyalty and teamwork, we encourage
              you to apply. Check out our application page to start your journey with MYTH.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
