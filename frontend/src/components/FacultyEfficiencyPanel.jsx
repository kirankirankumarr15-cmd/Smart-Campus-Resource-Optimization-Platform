import { TrendingDown, Leaf, Award, Zap } from 'lucide-react'

export default function FacultyEfficiencyPanel() {
  return (
    <div className="bg-white rounded-card p-5 border border-gray-100 shadow-sm h-full">
      <div className="flex items-center gap-2 mb-4">
        <Leaf size={20} className="text-green-600" />
        <h3 className="text-nav font-medium text-navy">Sustainability Impact</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-green-50 rounded-xl border border-green-100">
          <p className="text-label uppercase tracking-wider text-green-700">Energy Savings</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-hero font-bold text-green-700">14.2</span>
            <span className="text-label text-green-600">kWh</span>
          </div>
          <p className="text-label text-green-600 mt-1 flex items-center gap-1">
            <TrendingDown size={10} /> 12% vs last month
          </p>
        </div>
        <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
          <p className="text-label uppercase tracking-wider text-orange-700">Room Utility</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-hero font-bold text-orange-700">92</span>
            <span className="text-label text-orange-600">%</span>
          </div>
          <p className="text-label text-orange-600 mt-1">Optimum Sizing</p>
        </div>
      </div>

      <div className="p-4 bg-navy text-white rounded-xl flex items-center gap-4">
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
          <Award size={24} className="text-orange" />
        </div>
        <div>
          <p className="text-body font-medium">Eco-Leader Badge</p>
          <p className="text-label text-white/60">Top 5% in CSE Department for energy optimization</p>
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <p className="text-label text-textmute uppercase tracking-widest font-bold">Optimization Tip</p>
        <p className="text-body text-navy leading-snug">
          Moving your 4PM lab to Block A-002 could save an additional 4.5 kWh/week.
        </p>
      </div>
    </div>
  )
}
