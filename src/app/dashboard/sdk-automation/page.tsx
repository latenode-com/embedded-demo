"use client";

import { LatenodeEditor } from "@/components/LatenodeEditor";
import { PRESETS } from "@/lib/latenode-configs";

export default function SdkAutomationPage() {
  return <LatenodeEditor preset={PRESETS.automation} showAutomationControls />;
}
