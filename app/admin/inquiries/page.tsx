"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import { updateInquiryStatus, deleteInquiry } from "@/actions/inquiries";

type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  message: string;
  status: string;
  createdAt: string;
};

export default function InquiriesPage() {
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const queryClient = useQueryClient();

  const { data: inquiries, isLoading, isError } = useQuery<Inquiry[]>({
    queryKey: ["inquiries"],
    queryFn: async () => {
      const res = await fetch("/api/inquiries");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "New" | "Processed" | "Closed" }) => {
      return await updateInquiryStatus(parseInt(id), status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await deleteInquiry(parseInt(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
    },
  });

  const handleStatusChange = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status: status as "New" | "Processed" | "Closed" });
  };

  const handleDelete = (id: string) => {
    if (confirm("Yakin ingin menghapus inquiry ini?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isError) {
    return <div className="p-4 text-red-500">Failed to load inquiries.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Inquiries</h2>
        <p className="text-muted-foreground">
          Manage incoming leads and messages.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : inquiries?.length === 0 ? (
                <TableRow>
                   <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No inquiries found.
                   </TableCell>
                </TableRow>
              ) : (
                inquiries?.map((inquiry: Inquiry) => (
                  <TableRow key={inquiry.id}>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(inquiry.createdAt), "dd MMM yyyy", { locale: id })}
                    </TableCell>
                    <TableCell className="font-medium">{inquiry.name}</TableCell>
                    <TableCell>
                      <div className="text-xs">{inquiry.email}</div>
                      <div className="text-xs text-muted-foreground">{inquiry.phone}</div>
                    </TableCell>
                    <TableCell>{inquiry.company || "-"}</TableCell>
                    <TableCell>
                      <Select
                        value={inquiry.status}
                        onValueChange={(value) => handleStatusChange(inquiry.id, value)}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="Processed">Processed</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground" title={inquiry.message}>
                      {inquiry.message}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedInquiry(inquiry)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(inquiry.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Inquiry Detail</DialogTitle>
            <DialogDescription>
              Submitted on {selectedInquiry && format(new Date(selectedInquiry.createdAt), "dd MMMM yyyy, HH:mm", { locale: id })}
            </DialogDescription>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-base font-medium">{selectedInquiry.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Company</label>
                  <p className="text-base">{selectedInquiry.company || "-"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <a href={`mailto:${selectedInquiry.email}`} className="text-base text-primary hover:underline block">
                    {selectedInquiry.email}
                  </a>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <a href={`tel:${selectedInquiry.phone}`} className="text-base text-primary hover:underline block">
                    {selectedInquiry.phone}
                  </a>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  <Badge variant={selectedInquiry.status === "New" ? "default" : selectedInquiry.status === "Processed" ? "secondary" : "outline"}>
                    {selectedInquiry.status}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Message</label>
                <p className="text-base mt-2 p-4 bg-muted rounded-md whitespace-pre-wrap">
                  {selectedInquiry.message}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
