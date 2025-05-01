import Image from "next/image"

type LeaderProps = {
  name: string
  role: string
  imageUrl: string
  description: string
}

const Leader = ({ name, role, imageUrl, description }: LeaderProps) => {
  return (
    <div className="flex flex-col items-center p-6 bg-black/60 backdrop-blur-sm border border-blue-900 rounded-xl">
      <div className="relative w-32 h-32 mb-4 overflow-hidden">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={`${name} - ${role}`}
          fill
          className="object-cover rounded-xl shadow-lg"
          sizes="(max-width: 768px) 100vw, 128px"
        />
      </div>
      <h3 className="text-xl font-bold text-blue-400">{name}</h3>
      <p className="text-sm text-blue-300 mb-2">{role}</p>
      <p className="text-gray-300 text-center text-sm">{description}</p>
    </div>
  )
}

export default function LeadershipSection() {
  // Replace these URLs with actual image URLs
  const leaderImageUrl = "https://i.pinimg.com/736x/e9/39/27/e939270303cebaa9a1d459cfb2996240.jpg"
  const coLeaderImageUrl = "/placeholder.svg?height=400&width=400"

  return (
    <section className="w-full max-w-4xl mx-auto mt-16 px-4">
      <h2 className="text-3xl font-bold text-blue-400 text-center mb-8">Our Leadership</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Leader
          name="Kokusz"
          role="Founder & Leader"
          imageUrl={leaderImageUrl}
          description="Founder of MYTH Crew with years of experience in CnR. Dedicated to building the most elite crew in the game."
        />

        <Leader
          name="Patryk"
          role="Co-Leader"
          imageUrl={coLeaderImageUrl}
          description="Right-hand of the leader, helping manage crew operations and ensuring everyone follows the crew's principles."
        />
      </div>
    </section>
  )
}
