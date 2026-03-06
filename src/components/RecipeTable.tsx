import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { Pencil, Trash2, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { C, font, surface, text, border } from "../data/brand";
import { Btn } from "./ui/Btn";
import type { Recipe } from "../types";

interface RecipeTableProps {
  recipes: Recipe[];
  onView: (r: Recipe) => void;
  onEdit: (r: Recipe) => void;
  onDelete: (r: Recipe) => void;
}

export const RecipeTable = ({ recipes, onView, onEdit, onDelete }: RecipeTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const columns = useMemo<ColumnDef<Recipe>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Recipe Name",
        cell: (info) => (
          <span className="font-semibold" style={{ color: text.primary }}>
            {info.getValue() as string}
          </span>
        ),
        enableColumnFilter: true,
      },
      {
        accessorKey: "category",
        header: "Category",
        enableColumnFilter: true,
      },
      {
        accessorKey: "yield",
        header: "Yield",
        enableColumnFilter: false,
      },
      {
        accessorKey: "servingSize",
        header: "Serving Size",
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        id: "calories",
        accessorFn: (r) => r.nutrition.calories,
        header: "Calories",
        enableColumnFilter: false,
      },
      {
        id: "sodium",
        accessorFn: (r) => r.nutrition.sodium,
        header: "Sodium (mg)",
        enableColumnFilter: false,
      },
      {
        id: "saturatedFat",
        accessorFn: (r) => r.nutrition.saturatedFat,
        header: "Sat. Fat (g)",
        enableColumnFilter: false,
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        enableColumnFilter: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-1 justify-end">
            <button
              className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
              onClick={(e) => { e.stopPropagation(); onEdit(row.original); }}
              title="Edit recipe"
            >
              <Pencil size={14} color={C.blue} />
            </button>
            <button
              className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
              onClick={(e) => { e.stopPropagation(); onDelete(row.original); }}
              title="Delete recipe"
            >
              <Trash2 size={14} color="#dc2626" />
            </button>
          </div>
        ),
      },
    ],
    [onEdit, onDelete]
  );

  const table = useReactTable({
    data: recipes,
    columns,
    state: { sorting, columnFilters, pagination },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const SortIcon = ({ columnId }: { columnId: string }) => {
    const col = table.getColumn(columnId);
    if (!col?.getCanSort()) return null;
    const dir = col.getIsSorted();
    if (dir === "asc") return <ChevronUp size={14} />;
    if (dir === "desc") return <ChevronDown size={14} />;
    return <ChevronsUpDown size={14} className="opacity-40" />;
  };

  return (
    <div>
      {/* Table */}
      <div className="border rounded-xl overflow-hidden" style={{ borderColor: border.default }}>
        <table className="w-full text-sm" style={{ fontFamily: font.body }}>
          <thead>
            {/* Header row */}
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} style={{ backgroundColor: "var(--bg-table-header)" }}>
                {hg.headers.map((header) => (
                  <th key={header.id} className="text-left text-xs font-semibold" style={{ color: C.blue }}>
                    {header.isPlaceholder ? null : (
                      <div>
                        {header.column.getCanSort() ? (
                          <button
                            className="flex items-center gap-1 px-3 pt-3 pb-1 w-full hover:opacity-80 transition-opacity cursor-pointer select-none"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            <SortIcon columnId={header.column.id} />
                          </button>
                        ) : (
                          <div className="px-3 pt-3 pb-1">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </div>
                        )}

                        {/* Column filter input */}
                        {header.column.getCanFilter() ? (
                          <div className="px-3 pb-2 pt-1">
                            <input
                              className="w-full h-7 rounded border px-2 text-xs font-normal focus:outline-none focus:ring-1"
                              style={{
                                fontFamily: font.body,
                                borderColor: border.medium,
                                color: text.primary,
                                backgroundColor: surface.input,
                              }}
                              placeholder={`Filter...`}
                              value={(header.column.getFilterValue() as string) ?? ""}
                              onChange={(e) => header.column.setFilterValue(e.target.value)}
                            />
                          </div>
                        ) : (
                          <div className="pb-2" />
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, i) => (
              <tr
                key={row.id}
                className="border-t cursor-pointer transition-colors"
                style={{
                  borderColor: border.default,
                  backgroundColor: i % 2 === 1 ? surface.hover : "transparent",
                }}
                onClick={() => onView(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-2.5" style={{ color: text.primary }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-sm" style={{ color: text.muted }}>
                  No recipes match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-xs" style={{ fontFamily: font.body, color: text.secondary }}>
          {table.getFilteredRowModel().rows.length} recipe{table.getFilteredRowModel().rows.length !== 1 ? "s" : ""}{" "}
          &middot; Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
        </p>
        <div className="flex items-center gap-2">
          <Btn
            variant="outline"
            className="text-xs px-3 py-1.5"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Btn>
          <Btn
            variant="outline"
            className="text-xs px-3 py-1.5"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Btn>
        </div>
      </div>
    </div>
  );
};
