import { db } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Edit, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { deleteProject } from "@/actions/projects";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminProjectsPage() {
  const projects = await db.project.findMany({
    orderBy: { createdAt: "desc" },
    include: { client: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Manajemen Portofolio</h1>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Project
          </Link>
        </Button>
      </div>

      <div className="border rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Project Title</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-32 text-muted-foreground">
                  Belum ada project. Silakan tambah project baru.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div className="relative h-12 w-12 rounded overflow-hidden bg-muted">
                        {project.thumbnailUrl ? (
                            <Image 
                                src={project.thumbnailUrl} 
                                alt={project.title} 
                                fill 
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-xs text-muted-foreground">No Img</div>
                        )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {project.title}
                    <div className="text-xs text-muted-foreground mt-1 truncate max-w-[200px]">
                        {project.slug}
                    </div>
                  </TableCell>
                  <TableCell>{project.client?.name || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={project.status === "Completed" ? "default" : "secondary"}>
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/projects/${project.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteButton 
                        onDelete={deleteProject.bind(null, project.id)} 
                        title={`Hapus Project ${project.title}?`}
                        description="Tindakan ini tidak dapat dibatalkan. Project akan dihapus."
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
