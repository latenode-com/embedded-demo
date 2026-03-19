"use client";

import { LatenodeEditor } from "@/components/LatenodeEditor";
import { PRESETS } from "@/lib/latenode-configs";

export default function FullEmbedPage() {
  return <LatenodeEditor preset={PRESETS.full} />;
}
