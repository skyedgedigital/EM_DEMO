"use client";
import { useRouter } from "next/router";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import chalanAction from "@/lib/actions/chalan/chalanAction";
import { getObjectURL } from "@/utils/aws";
export type Invoice = {
  invoiceNumber: string;
  SesNo: Number;
  DoNo: Number;
  createdAt: Date;
  chalans: String[];
  pdfLink?: String; 
  summaryLink?: String;
};


export const invoiceColumns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "invoiceNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },

  {
    accessorKey: "SesNo",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          //   onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          SES
          {/* <ArrowUpDown className='ml-2 h-4 w-4' /> */}
        </Button>
      );
    },
  },
  {
    accessorKey: "DoNo",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          //   onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          DO
          {/* <ArrowUpDown className='ml-2 h-4 w-4' /> */}
        </Button>
      );
    },
  },
  {
    accessorKey: "chalans",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          //   onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Issued for Chalan(s)
          {/* <ArrowUpDown className='ml-2 h-4 w-4' /> */}
        </Button>
      );
    },
    cell: ({ row }) => {
      const invoice = row.original;
      console.log("aagya og pog", invoice);
      const chalans = Array.isArray(invoice.chalans)
        ? invoice.chalans.join(", ")
        : "";

      return <span>{chalans}</span>;
    },
  },
  {
    accessorKey: "chalans",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          //   onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Issued on
          {/* <ArrowUpDown className='ml-2 h-4 w-4' /> */}
        </Button>
      );
    },
    cell: ({ row }) => {
      const invoice = row.original;
      console.log("aagya og pog", invoice);

      const formatDate = (datee: Date) => {
        const date = new Date(datee);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };

      return <span>{formatDate(row.original.createdAt)}</span>;
    },
  },
  {
    id: "actions",

    cell: ({ row }) => {
      const invoice = row.original;

      const viewInvoice = async (pdfLink: any) => {
        if (!pdfLink) {
          toast.error("Pdf not available for this invoice");
          return;
        }
        try {
          // const res = await getObjectURL(pdfLink);
          const res = pdfLink;
          window.open(res, "_blank");
        } catch (error) {
          console.error(`Error deleting employee: ${error}`);
        }
      };

      const redirectChalansPage = (
        invoiceNumber: string,
        invoiceCreatedAt: any
      ) => {
        window.open(
          `/fleetmanager/chalanList?invoiceNumber=${invoiceNumber}&invoiceCreatedAt=${invoiceCreatedAt}`
        );
      };
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => viewInvoice(invoice.pdfLink)}>
              View Invoice
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => viewInvoice(invoice.summaryLink)}>
              View Invoice Summary
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                redirectChalansPage(invoice.invoiceNumber, invoice.createdAt)
              }
            >
              View Chalans Involved
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];