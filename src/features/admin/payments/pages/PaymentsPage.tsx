import PageLoadingState from "@/ui/PageLoadingState";
import { useInvoices } from "../../lessons/hooks/useInvoices";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import InvoicesTable from "../components/InvoicesTable";
import CustomSelect from "@/ui/CustomSelect";
import { invoiceStatus, PAGE_SIZE } from "@/utils/constants";
import StatCard from "@/ui/StatCard";
import EmptyState from "@/ui/EmptyState";
import {
  HiOutlineClock,
  HiOutlineCurrencyDollar,
  HiOutlineDocumentText,
} from "react-icons/hi2";
import { useAuth } from "@/contexts/AuthContext";
import InvoiceChart from "../components/InvoiceChart";
import UnInvoicedLessonsPanel from "../components/UnInvoicedLessonsPanel";
import { groupInvoicesByMonth } from "@/utils/helper";

const statusOptions = [
  { value: "all", label: "All statuses" },
  ...invoiceStatus.map((s) => ({ value: s, label: s })),
];

export default function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [pastPage, setPastPage] = useState(1);

  const { user: authUser } = useAuth();
  const canAccessPayments =
    authUser?.role === "admin" && authUser?.has_pro_access;

  const { invoices = [], isLoading } = useInvoices(undefined, {
    enabled: canAccessPayments,
  });

  // Filter rows based on selection
  const filtered = invoices.filter((i) => {
    // Status filter
    const statusMatches =
      selectedStatus === "all" ||
      selectedStatus.toLowerCase() === i.status.toLowerCase();

    // Search filter
    const searchMatches =
      !search ||
      i.student.first_name.toLowerCase().includes(search.toLowerCase()) ||
      i.student.last_name.toLowerCase().includes(search.toLowerCase()) ||
      i.lesson.topic.toLowerCase().includes(search.toLowerCase());

    return statusMatches && searchMatches;
  });
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);

  const displayInvoices = useMemo(() => {
    const start = (pastPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, pastPage]);

  const uniqueStudentCount = new Set(invoices.map((i) => i.student.id)).size;

  const monthlyData = useMemo(() => groupInvoicesByMonth(invoices), [invoices]);

  if (!canAccessPayments) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <EmptyState
          message={
            <div className="flex flex-col items-center gap-6">
              <p>
                Payments are available on the Pro plan. Upgrade to track
                invoices.
              </p>
              <Link to="/profile" className="btn-primary">
                Go to profile
              </Link>
            </div>
          }
        />
      </div>
    );
  }

  if (isLoading) {
    return <PageLoadingState message="Loading invoices..." />;
  }

  //Stats
  const totalEarn = invoices.reduce((acc, invoice) => {
    return invoice.status === "paid" ? acc + Number(invoice.amount) : acc;
  }, 0);

  const outstanding = invoices.reduce((acc, invoice) => {
    return invoice.status === "unpaid" ? acc + Number(invoice.amount) : acc;
  }, 0);

  const unpaidCount = invoices.filter((i) => i.status === "unpaid").length;

  return (
    <div className="page-container">
      {/* Top bar */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Payments</h1>
          <p className="mt-0.5 text-sm text-gray-400">
            Total: {uniqueStudentCount} student
            {uniqueStudentCount === 1 ? "" : "s"} · {invoices.length} invoice
            {invoices.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-2 md:gap-4 md:pt-4">
        <StatCard
          icon={HiOutlineCurrencyDollar}
          label="Total Earned"
          value={`${totalEarn} ${authUser?.currency}`}
        />
        <StatCard
          icon={HiOutlineClock}
          label="Outstanding"
          value={`${outstanding} ${authUser?.currency}`}
        />
        <StatCard
          icon={HiOutlineDocumentText}
          label="Unpaid invoices"
          value={unpaidCount}
        />
      </section>

      <UnInvoicedLessonsPanel />

      {/* Revenue chart */}
      {monthlyData.length > 0 && (
        <InvoiceChart monthlyData={monthlyData} currency={authUser?.currency} />
      )}

      <div className="flex items-center gap-2">
        <input
          className="form-input mb-0 h-10.5 w-80 px-3 max-sm:text-[11px] md:w-100"
          type="text"
          placeholder="Search by student or lesson..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <CustomSelect
          className="mb-0 w-40 capitalize"
          classNames={{
            control: (state: any) =>
              `!rounded-xl !border !bg-white !text-sm !shadow-none ${
                state.isFocused ? "!border-theme-purple-50" : "!border-gray-200"
              }`,
          }}
          menuPlacement="auto"
          value={statusOptions.find((o) => o.value === selectedStatus)}
          options={statusOptions}
          onChange={(selected: any) =>
            setSelectedStatus(selected ? selected.value : "all")
          }
        />
      </div>

      <InvoicesTable invoices={displayInvoices} />

      {pageCount > 1 && (
        <ReactPaginate
          breakLabel="..."
          nextLabel=">"
          previousLabel="<"
          onPageChange={(e) => setPastPage(e.selected + 1)}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          renderOnZeroPageCount={null}
          containerClassName="mt-4 flex items-center justify-center gap-2"
          pageClassName="pagination"
          activeClassName="bg-gray-200 font-semibold"
          previousClassName="pagination"
          nextClassName="pagination"
          disabledClassName="opacity-50 cursor-not-allowed"
        />
      )}
    </div>
  );
}
