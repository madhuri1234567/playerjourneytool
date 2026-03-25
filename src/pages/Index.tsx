import TopBar from "@/components/TopBar";
import JourneyMap from "@/components/JourneyMap";
import { SAMPLE_JOURNEY } from "@/data/sampleJourney";

const Index = () => (
  <div className="min-h-screen flex flex-col bg-background">
    <TopBar />
    <JourneyMap points={SAMPLE_JOURNEY} />
  </div>
);

export default Index;
