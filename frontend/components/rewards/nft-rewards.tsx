import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageIcon, Lock, Sparkles } from "lucide-react"

export default function NFTRewards() {
  return (
    <Card className="bg-gray-900/60 border-gray-800 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-blue-900/10" />
      <CardHeader className="relative border-b border-gray-800">
        <CardTitle className="flex items-center text-xl">
          <ImageIcon className="mr-2 h-5 w-5 text-purple-400" />
          NFT Rewards
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 relative">
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-2">Exclusive NFT Collection</h3>
          <p className="text-gray-400 text-sm">Earn unique NFTs by completing challenges and reaching milestones</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: "Cosmic Pilot",
              image: "/placeholder.svg?height=200&width=200",
              rarity: "Rare",
              requirement: "Win 10 games",
              progress: 80,
              unlocked: true,
            },
            {
              name: "Space Voyager",
              image: "/placeholder.svg?height=200&width=200",
              rarity: "Epic",
              requirement: "Reach 10,000 points",
              progress: 65,
              unlocked: true,
            },
            {
              name: "Galactic Commander",
              image: "/placeholder.svg?height=200&width=200",
              rarity: "Legendary",
              requirement: "Top 3 in tournament",
              progress: 0,
              unlocked: false,
            },
            {
              name: "Nebula Explorer",
              image: "/placeholder.svg?height=200&width=200",
              rarity: "Mythic",
              requirement: "30-day streak",
              progress: 13,
              unlocked: false,
            },
          ].map((nft, index) => (
            <Card
              key={index}
              className={`bg-gray-800/50 border-gray-700 ${
                nft.unlocked ? "hover:border-purple-500/50" : "opacity-70"
              } transition-all duration-300 overflow-hidden`}
            >
              <div className="relative aspect-square">
                <img src={nft.image || "/placeholder.svg"} alt={nft.name} className="w-full h-full object-cover" />

                {!nft.unlocked && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <Lock className="h-10 w-10 text-gray-400" />
                  </div>
                )}

                <div
                  className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${
                    nft.rarity === "Rare"
                      ? "bg-blue-500/20 text-blue-400"
                      : nft.rarity === "Epic"
                        ? "bg-purple-500/20 text-purple-400"
                        : nft.rarity === "Legendary"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-pink-500/20 text-pink-400"
                  }`}
                >
                  {nft.rarity}
                </div>
              </div>

              <CardContent className="p-4">
                <h4 className="font-bold mb-1">{nft.name}</h4>
                <p className="text-sm text-gray-400 mb-3">{nft.requirement}</p>

                <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full ${
                      nft.rarity === "Rare"
                        ? "bg-blue-500"
                        : nft.rarity === "Epic"
                          ? "bg-purple-500"
                          : nft.rarity === "Legendary"
                            ? "bg-yellow-500"
                            : "bg-pink-500"
                    }`}
                    style={{ width: `${nft.progress}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-xs text-gray-400 mb-4">
                  <div>Progress</div>
                  <div>{nft.progress}%</div>
                </div>

                <Button
                  className={`w-full ${
                    nft.progress === 100
                      ? "bg-purple-500 hover:bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)] hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  }`}
                  disabled={nft.progress !== 100}
                >
                  {nft.progress === 100 ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Claim NFT
                    </>
                  ) : (
                    "In Progress"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
