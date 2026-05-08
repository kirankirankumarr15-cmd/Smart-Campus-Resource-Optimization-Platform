import ScenarioSim from '../components/ScenarioSim.jsx'

export default function Scenarios() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-hero font-medium text-navy">Scenario Simulator</h2>
        <p className="text-body text-textmute mt-1">
          Project headcount changes onto the live twin without touching real data.
        </p>
      </div>
      <ScenarioSim />
    </div>
  )
}
