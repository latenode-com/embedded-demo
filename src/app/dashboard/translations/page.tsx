"use client";

import { LatenodeEditor } from "@/components/LatenodeEditor";
import { PRESETS } from "@/lib/latenode-configs";

export default function TranslationsPage() {
  return <LatenodeEditor preset={PRESETS.translations} />;
}
