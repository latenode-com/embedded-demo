import { LatenodeEditor } from "@/components/LatenodeEditor";
import { PRESETS } from "@/lib/latenode-configs";

export default function TemplatesPage() {
  return (
    <LatenodeEditor
      preset={PRESETS.templates}
      initialRoute="/shared-scenarios"
    />
  );
}
