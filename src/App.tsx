import { useSorokit } from "@/context/SorokitProvider";
import { ConnectScreen } from "@/screens/ConnectScreen";
import { Dashboard } from "@/screens/Dashboard";

export default function App() {
  const { isConnected } = useSorokit();
  return isConnected ? <Dashboard /> : <ConnectScreen />;
}
