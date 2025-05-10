import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"

const wallets = [
  { name: "Phantom", icon: "👻", connected: true },
  { name: "Solflare", icon: "🔆", connected: true },
  { name: "Backpack", icon: "🎒", connected: false },
]

export default function WalletSection() {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-green-400">
          Connected Wallets
        </h2>
        <Button variant="outline" className="border-green-500 text-green-400 hover:bg-green-500/10">
          <Plus className="mr-2 h-4 w-4" />
          Add Wallet
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {wallets.map((wallet) => (
          <Card
            key={wallet.name}
            className="bg-gray-900/40 backdrop-blur-md border-gray-800 hover:border-green-500/50 transition-all duration-300 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 to-green-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-3xl mr-3">{wallet.icon}</div>
                  <div>
                    <h3 className="font-bold text-lg">{wallet.name}</h3>
                    {wallet.connected ? (
                      <div className="text-sm text-green-400 flex items-center">
                        <span className="h-2 w-2 rounded-full bg-green-400 mr-2"></span>
                        Connected
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">Not connected</div>
                    )}
                  </div>
                </div>

                {wallet.connected && (
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-red-500/20">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {wallet.connected && (
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">SOL Balance</span>
                    <span className="font-mono font-bold">42.69</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-400">Address</span>
                    <span className="font-mono text-xs">Hx7...3kF9</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
