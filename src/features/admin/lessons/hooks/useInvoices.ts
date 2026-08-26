import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { CreateInvoiceData, Invoice } from "@/type/invoice";
import { unwrapResponse } from "@/api/helper";
import {
  createInvoice as createInvoiceApi,
  deleteInvoice as deleteInvoiceApi,
  getInvoices,
  updateInvoice as updateInvoiceApi,
} from "@/api/invoices";
import { useAlert } from "@/contexts/AlertContext";

export function useInvoices(studentId?: string) {
  const queryClient = useQueryClient();
  const alert = useAlert();

  const invoicesQuery = useQuery<Invoice[], Error>({
    queryKey: ["invoices", studentId ?? null],
    queryFn: async () =>
      unwrapResponse<Invoice[]>(await getInvoices(studentId)),
    staleTime: 60_000,
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateInvoiceData) =>
      unwrapResponse<Invoice>(await createInvoiceApi(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice"] });
      alert.success("Invoice created.");
    },
    onError: (error) => {
      alert.error(
        error instanceof Error ? error.message : "Failed to create invoice",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateInvoiceData> & { paid_at?: string };
    }) => unwrapResponse<Invoice>(await updateInvoiceApi(id, data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice"] });
      alert.success("Invoice updated.");
    },
    onError: (error) => {
      alert.error(
        error instanceof Error ? error.message : "Failed to update invoice",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) =>
      unwrapResponse<void>(await deleteInvoiceApi(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice"] });
      alert.success("Invoice deleted.");
    },
    onError: (error) => {
      alert.error(
        error instanceof Error ? error.message : "Failed to delete invoice",
      );
    },
  });

  return {
    ...invoicesQuery,
    invoices: invoicesQuery.data,
    createInvoice: createMutation.mutateAsync,
    updateInvoice: updateMutation.mutateAsync,
    deleteInvoice: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
