"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateSettings } from "@/actions/settings";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

interface SettingsFormProps {
  settings: Record<string, string>;
}

export default function SettingsForm({ settings }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await updateSettings(formData);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <form action={handleSubmit}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your website configuration.</p>
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>
                Basic details about your website.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site_title">Site Title</Label>
                <Input
                  id="site_title"
                  name="setting_site_title"
                  defaultValue={settings.site_title || "USSI ITS"}
                  placeholder="Enter site title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site_description">Site Description</Label>
                <Textarea
                  id="site_description"
                  name="setting_site_description"
                  defaultValue={settings.site_description || ""}
                  placeholder="Enter site description for SEO"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="footer_text">Footer Text</Label>
                <Input
                  id="footer_text"
                  name="setting_footer_text"
                  defaultValue={settings.footer_text || "© 2024 USSI ITS. All rights reserved."}
                  placeholder="Enter footer text"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Settings */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                 Details displayed on the contact page and footer.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="contact_email">Email Address</Label>
                    <Input
                    id="contact_email"
                    name="setting_contact_email"
                    type="email"
                    defaultValue={settings.contact_email || ""}
                    placeholder="contact@ussiits.com"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="contact_phone">Phone Number</Label>
                    <Input
                    id="contact_phone"
                    name="setting_contact_phone"
                    defaultValue={settings.contact_phone || ""}
                    placeholder="+62 812 3456 7890"
                    />
                </div>
               </div>
              <div className="space-y-2">
                <Label htmlFor="contact_address">Office Address</Label>
                <Textarea
                  id="contact_address"
                  name="setting_contact_address"
                  defaultValue={settings.contact_address || ""}
                  placeholder="Enter full office address"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp_url">WhatsApp Link</Label>
                <Input
                  id="whatsapp_url"
                  name="setting_whatsapp_url"
                  defaultValue={settings.whatsapp_url || ""}
                  placeholder="https://wa.me/628..."
                />
                <p className="text-xs text-muted-foreground">Default WhatsApp link for float buttons.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media Settings */}
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>
                Links to your social media profiles.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="social_facebook">Facebook URL</Label>
                    <Input
                      id="social_facebook"
                      name="setting_social_facebook"
                      defaultValue={settings.social_facebook || ""}
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social_instagram">Instagram URL</Label>
                    <Input
                      id="social_instagram"
                      name="setting_social_instagram"
                      defaultValue={settings.social_instagram || ""}
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social_linkedin">LinkedIn URL</Label>
                    <Input
                      id="social_linkedin"
                      name="setting_social_linkedin"
                      defaultValue={settings.social_linkedin || ""}
                      placeholder="https://linkedin.com/company/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social_twitter">Twitter / X URL</Label>
                    <Input
                      id="social_twitter"
                      name="setting_social_twitter"
                      defaultValue={settings.social_twitter || ""}
                      placeholder="https://twitter.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social_youtube">YouTube URL</Label>
                    <Input
                      id="social_youtube"
                      name="setting_social_youtube"
                      defaultValue={settings.social_youtube || ""}
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social_tiktok">TikTok URL</Label>
                    <Input
                      id="social_tiktok"
                      name="setting_social_tiktok"
                      defaultValue={settings.social_tiktok || ""}
                      placeholder="https://tiktok.com/@..."
                    />
                  </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
}
