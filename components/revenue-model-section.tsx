"use client"

import { Button } from "@/components/ui/button"

export function RevenueModelSection() {
  return (
    <section className="py-20 bg-[#1c1c1c]">
      <div className="container mx-auto px-4">
        <h2 className="font-['Bebas_Neue'] text-4xl md:text-5xl text-center mb-4 tracking-wide">
          HOW YOU <span className="text-[#f23c21]">EARN</span>
        </h2>
        <p className="text-center text-gray-300 max-w-2xl mx-auto mb-16">
          Multiple revenue streams mean more opportunities to monetize your passion. Here's how Sportyfy.live creators
          make money.
        </p>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#252525] p-6 rounded-sm border-t-2 border-[#f23c21]">
            <h3 className="font-['Bebas_Neue'] text-2xl mb-4 tracking-wide">VIEWER TIPS</h3>
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-[#1c1c1c] rounded-full flex items-center justify-center text-2xl mr-4">
                1
              </div>
              <div>
                <p className="text-gray-300">Viewers can send tips during your live streams</p>
                <p className="text-[#f23c21] font-medium mt-1">You keep 80% of all tips</p>
              </div>
            </div>
            <div className="bg-[#1c1c1c] p-4 rounded-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Average per stream</span>
                <span className="font-medium">₹500 - ₹2,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Top earners per stream</span>
                <span className="font-medium">₹5,000+</span>
              </div>
            </div>
          </div>

          <div className="bg-[#252525] p-6 rounded-sm border-t-2 border-[#f23c21]">
            <h3 className="font-['Bebas_Neue'] text-2xl mb-4 tracking-wide">SUBSCRIPTIONS</h3>
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-[#1c1c1c] rounded-full flex items-center justify-center text-2xl mr-4">
                2
              </div>
              <div>
                <p className="text-gray-300">Fans can subscribe to your channel monthly</p>
                <p className="text-[#f23c21] font-medium mt-1">Recurring revenue every month</p>
              </div>
            </div>
            <div className="bg-[#1c1c1c] p-4 rounded-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Subscription price</span>
                <span className="font-medium">₹99 - ₹499 / month</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">You keep</span>
                <span className="font-medium">70% of subscription fees</span>
              </div>
            </div>
          </div>

          <div className="bg-[#252525] p-6 rounded-sm border-t-2 border-[#f23c21]">
            <h3 className="font-['Bebas_Neue'] text-2xl mb-4 tracking-wide">SPONSORSHIPS</h3>
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-[#1c1c1c] rounded-full flex items-center justify-center text-2xl mr-4">
                3
              </div>
              <div>
                <p className="text-gray-300">Get sponsored by brands as you grow</p>
                <p className="text-[#f23c21] font-medium mt-1">We connect you with relevant sponsors</p>
              </div>
            </div>
            <div className="bg-[#1c1c1c] p-4 rounded-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Sponsorship deals</span>
                <span className="font-medium">₹5,000 - ₹50,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Requirements</span>
                <span className="font-medium">500+ regular viewers</span>
              </div>
            </div>
          </div>

          <div className="bg-[#252525] p-6 rounded-sm border-t-2 border-[#f23c21]">
            <h3 className="font-['Bebas_Neue'] text-2xl mb-4 tracking-wide">DISCOVERY BONUSES</h3>
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-[#1c1c1c] rounded-full flex items-center justify-center text-2xl mr-4">
                4
              </div>
              <div>
                <p className="text-gray-300">Get bonuses when scouts find talent on your streams</p>
                <p className="text-[#f23c21] font-medium mt-1">Earn from helping others succeed</p>
              </div>
            </div>
            <div className="bg-[#1c1c1c] p-4 rounded-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Referral bonus</span>
                <span className="font-medium">₹2,500 - ₹10,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Success stories</span>
                <span className="font-medium">350+ and counting</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-[#252525] p-6 rounded-sm">
            <h3 className="font-['Bebas_Neue'] text-2xl mb-6 tracking-wide text-center">EARNINGS SCENARIOS</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#1c1c1c] p-4 rounded-sm">
                <h4 className="font-medium mb-2">Beginner Creator</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-400">Viewers</span>
                    <span>100-300</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Streams/week</span>
                    <span>2-3</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Tips</span>
                    <span>₹500-1,000/stream</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Subscribers</span>
                    <span>10-30</span>
                  </li>
                </ul>
                <div className="mt-4 pt-4 border-t border-[#252525]">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Monthly</span>
                    <span className="font-medium text-[#f23c21]">₹5,000-15,000</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#1c1c1c] p-4 rounded-sm">
                <h4 className="font-medium mb-2">Established Creator</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-400">Viewers</span>
                    <span>500-1,000</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Streams/week</span>
                    <span>3-4</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Tips</span>
                    <span>₹2,000-4,000/stream</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Subscribers</span>
                    <span>50-150</span>
                  </li>
                </ul>
                <div className="mt-4 pt-4 border-t border-[#252525]">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Monthly</span>
                    <span className="font-medium text-[#f23c21]">₹25,000-50,000</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#1c1c1c] p-4 rounded-sm">
                <h4 className="font-medium mb-2">Top Creator</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-400">Viewers</span>
                    <span>1,000+</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Streams/week</span>
                    <span>4-5</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Tips</span>
                    <span>₹5,000+/stream</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Subscribers</span>
                    <span>200+</span>
                  </li>
                </ul>
                <div className="mt-4 pt-4 border-t border-[#252525]">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Monthly</span>
                    <span className="font-medium text-[#f23c21]">₹75,000-150,000+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button className="bg-[#f23c21] hover:bg-[#d32c15] text-white font-medium px-8 py-6 text-lg rounded-sm">
            START EARNING <span className="ml-1">→</span>
          </Button>
        </div>
      </div>
    </section>
  )
}
