import { Dashboard } from "../features/DashboardCard";

function App() {
  return (
    <>
    <div className="min-h-screen bg-background text-primary">
      <p className='text-3xl bg-red-400 font-bold underline'>My App</p>
      <Dashboard />
    </div>
    </>
  )
}

export default App;
