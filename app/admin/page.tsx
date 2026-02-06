import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { MessageSquare, Users, Package, Briefcase, FileText } from "lucide-react";

export default async function AdminDashboard() {
  /* Fetch All Stats in Parallel */
  const [
    inquiryCount, 
    pendingInquiryCount,
    clientCount,
    featuredClientCount,
    productCount,
    serviceCount,
    projectCount,
    ongoingProjectCount,
    postCount,
    publishedPostCount
  ] = await Promise.all([
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: "New" } }),
    prisma.client.count(),
    prisma.client.count({ where: { isFeatured: true } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.service.count({ where: { isActive: true } }),
    prisma.project.count(),
    prisma.project.count({ where: { status: "Ongoing" } }),
    prisma.post.count(),
    prisma.post.count({ where: { status: "published" } }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">System Overview & Key Metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Inquiries Card */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inquiryCount}</div>
            <p className="text-xs text-muted-foreground">
              {pendingInquiryCount} new (pending)
            </p>
          </CardContent>
        </Card>

        {/* Clients Card */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
             <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientCount}</div>
            <p className="text-xs text-muted-foreground">
              {featuredClientCount} featured on homepage
            </p>
          </CardContent>
        </Card>

        {/* Products & Services Card */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products & Services</CardTitle>
             <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productCount + serviceCount}</div>
            <p className="text-xs text-muted-foreground">
              {serviceCount} Services, {productCount} Products
            </p>
          </CardContent>
        </Card>

        {/* Projects Card */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Projects</CardTitle>
             <Briefcase className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectCount}</div>
            <p className="text-xs text-muted-foreground">
              {ongoingProjectCount} ongoing projects
            </p>
          </CardContent>
        </Card>

         {/* Blog Stats Card */}
         <Card className="border-l-4 border-l-pink-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
             <FileText className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{postCount}</div>
            <p className="text-xs text-muted-foreground">
              {publishedPostCount} published, {postCount - publishedPostCount} drafts
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
