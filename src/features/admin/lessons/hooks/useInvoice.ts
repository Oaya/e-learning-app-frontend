import { useQuery } from "@tanstack/react-query";

import type { Invoice } from "@/type/invoice";
import { unwrapResponse } from "@/api/helper";
import { getInvoiceById } from "@/api/invoices";

export function useInvoice(invoiceId: string) {
  const invoiceQuery = useQuery<Invoice, Error>({
    queryKey: ["invoice", invoiceId],
    queryFn: async () =>
      unwrapResponse<Invoice>(await getInvoiceById(invoiceId)),
    staleTime: 60_000,
    enabled: !!invoiceId,
  });

  return {
    ...invoiceQuery,
    invoice: invoiceQuery.data,
  };
}
