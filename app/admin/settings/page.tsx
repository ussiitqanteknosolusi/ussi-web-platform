import { getSettings } from "@/actions/settings";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="max-w-4xl mx-auto">
      <SettingsForm settings={settings} />
    </div>
  );
}
