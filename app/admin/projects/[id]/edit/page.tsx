import ProjectForm from "@/components/admin/ProjectForm";
import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage(props: EditProjectPageProps) {
  const params = await props.params;
  const id = parseInt(params.id);
  if (isNaN(id)) notFound();

  const project = await db.project.findUnique({
    where: { id },
  });

  if (!project) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
      </div>
      <ProjectForm initialData={project} />
    </div>
  );
}
