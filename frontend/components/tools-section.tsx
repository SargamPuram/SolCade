import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, Wallet, ImageIcon, ArrowRightLeft, LineChart, Settings } from "lucide-react"

const tools = [
  {
    id: 1,
    name: "Portfolio Tracker",
    description: "Track your Solana assets and performance",
    icon: BarChart3,
    gradient: "from-cyan-500 to-cyan-400",
  },
  {
    id: 2,
    name: "NFT Explorer",
    description: "Browse and manage your NFT collection",
    icon: ImageIcon,
    gradient: "from-green-500 to-green-400",
  },
  {
    id: 3,
    name: "DEX Interface",
    description: "Swap tokens with the best rates",
    icon: ArrowRightLeft,
    gradient: "from-pink-500 to-pink-400",
  },
  {
    id: 4,
    name: "Wallet Manager",
    description: "Manage multiple wallets in one place",
    icon: Wallet,
    gradient: "from-yellow-500 to-yellow-400",
  },
  {
    id: 5,
    name: "Analytics Dashboard",
    description: "Advanced charts and market insights",
    icon: LineChart,
    gradient: "from-red-500 to-red-400",
  },
  {
    id: 6,
    name: "Settings & Preferences",
    description: "Customize your dashboard experience",
    icon: Settings,
    gradient: "from-blue-500 to-blue-400",
  },
]

export default function ToolsSection() {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-green-400">
          Tools & Utilities
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <Card
            key={tool.id}
            className="bg-gray-900/40 backdrop-blur-md border-gray-800 hover:border-green-500/50 transition-all duration-300 group cursor-pointer overflow-hidden"
          >
            <CardContent className="p-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 to-green-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="flex items-center gap-4 relative">
                <div
                  className={`h-12 w-12 rounded-lg bg-gradient-to-br ${tool.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <tool.icon className="h-6 w-6 text-white" />
                </div>

                <div>
                  <h3 className="font-bold">{tool.name}</h3>
                  <p className="text-sm text-gray-400">{tool.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
