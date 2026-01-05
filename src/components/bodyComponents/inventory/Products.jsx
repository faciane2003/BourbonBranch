import {
  Box,
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Popover,
  Select,
  TextField
} from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct
} from "../../../api/api";
export default function Products() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [dialogMode, setDialogMode] = useState("add");
  const [activeProductId, setActiveProductId] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [statusTouched, setStatusTouched] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    category: "General",
    price: "0",
    stock: "",
    needed: "",
    status: "full"
  });
  const [formErrors, setFormErrors] = useState({});
  const roundedFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "22px"
    }
  };
  const centeredInputSx = {
    "& input": {
      textAlign: "center"
    },
    "& input::placeholder": {
      textAlign: "center",
      width: "100%"
    }
  };

  const loadProducts = () => {
    let isMounted = true;
    fetchProducts()
      .then((data) => {
        if (isMounted) {
          setRows(data);
        }
      })
      .catch((error) => {
        console.error("Failed to load products:", error);
        if (isMounted) {
          setError("Unable to load inventory. Check the API service.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  };

  useEffect(() => loadProducts(), []);

  const openAddDialog = (event) => {
    setDialogMode("add");
    setActiveProductId(null);
    setFormValues({
      name: "",
      category: "General",
      price: "0",
      stock: "",
      needed: "",
      status: "full"
    });
    setStatusTouched(false);
    setFormErrors({});
    setAnchorEl(event?.currentTarget || null);
    setDialogOpen(true);
  };

  const openEditDialog = (event, product) => {
    setDialogMode("edit");
    setActiveProductId(product.id);
    setFormValues({
      name: product.name || "",
      category: product.category || "General",
      price: String(product.price ?? "0"),
      stock: String(product.stock ?? ""),
      needed: String(product.needed ?? ""),
      status: product.status === "active" ? "full" : product.status || "full"
    });
    setStatusTouched(false);
    setFormErrors({});
    setAnchorEl(event?.currentTarget || null);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setFormErrors({});
    setAnchorEl(null);
  };

  const handleFieldChange = (field) => (event) => {
    if (field === "status") {
      setStatusTouched(true);
    }
    setFormValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const validateForm = () => {
    const nextErrors = {};
    const priceValue = Number(formValues.price || 0);
    const stockValue = Number(formValues.stock);
    const neededValue =
      formValues.needed === "" ? null : Number(formValues.needed);

    if (!formValues.name.trim()) {
      nextErrors.name = "Item is required.";
    }
    if (formValues.stock === "" || Number.isNaN(stockValue)) {
      nextErrors.stock = "Enter a valid stock count.";
    }
    if (neededValue !== null && Number.isNaN(neededValue)) {
      nextErrors.needed = "Enter a valid needed count.";
    }

    setFormErrors(nextErrors);
    return {
      isValid: Object.keys(nextErrors).length === 0,
      priceValue,
      stockValue,
      neededValue
    };
  };

  const deriveStatus = (stockValue, neededValue, selectedStatus) => {
    if (neededValue && neededValue > 0) {
      return "request";
    }
    if (stockValue === 0) {
      return "out";
    }
    if (stockValue < 2) {
      return "low";
    }
    if (selectedStatus === "ordered") {
      return "ordered";
    }
    return "full";
  };

  const startCellEdit = (rowId, columnId, value) => {
    setEditingCell({ rowId, columnId });
    setEditingValue(value ?? "");
  };

  const cancelCellEdit = () => {
    setEditingCell(null);
    setEditingValue("");
  };

  const commitCellEdit = async (overrideValue) => {
    if (!editingCell) {
      return;
    }
    const { rowId, columnId } = editingCell;
    const currentRow = rows.find((row) => row.id === rowId);
    if (!currentRow) {
      cancelCellEdit();
      return;
    }

    let updated = { ...currentRow };
    if (columnId === "name") {
      updated.name = String(editingValue).trim();
    } else if (columnId === "stock") {
      updated.stock = Number(editingValue || 0);
    } else if (columnId === "needed") {
      updated.needed = Number(editingValue || 0);
    } else if (columnId === "status") {
      updated.status = (overrideValue ?? editingValue) || "full";
    }

    if (columnId !== "status") {
      updated.status = deriveStatus(
        Number(updated.stock || 0),
        Number(updated.needed || 0),
        updated.status
      );
    }

    const payload = {
      name: updated.name,
      category: updated.category || "General",
      price: Number(updated.price || 0),
      stock: Number(updated.stock || 0),
      needed: Number(updated.needed || 0),
      status: updated.status
    };

    try {
      await updateProduct(updated.id, payload);
      setRows((prev) =>
        prev.map((row) => (row.id === updated.id ? updated : row))
      );
    } catch (error) {
      console.error("Failed to update product:", error);
      window.alert("Failed to update product.");
    } finally {
      cancelCellEdit();
    }
  };

  const handleDialogSubmit = async () => {
    const { isValid, priceValue, stockValue, neededValue } = validateForm();
    if (!isValid) {
      return;
    }

    const computedStatus =
      dialogMode === "add"
        ? formValues.status || "full"
        : statusTouched
          ? formValues.status || "full"
          : deriveStatus(stockValue, neededValue, formValues.status);
    const payload = {
      name: formValues.name.trim(),
      category: formValues.category.trim() || "General",
      price: priceValue,
      stock: stockValue,
      needed: neededValue ?? 0,
      status: computedStatus
    };

    try {
      if (dialogMode === "add") {
        const created = await createProduct(payload);
        setRows((prev) => [created, ...prev]);
      } else {
        const updated = await updateProduct(activeProductId, payload);
        setRows((prev) =>
          prev.map((row) => (row.id === updated.id ? updated : row))
        );
      }
      loadProducts();
      handleDialogClose();
    } catch (error) {
      console.error(
        dialogMode === "add"
          ? "Failed to add product:"
          : "Failed to update product:",
        error
      );
      window.alert(
        dialogMode === "add"
          ? "Failed to add product."
          : "Failed to update product."
      );
    }
  };

  const handleDeleteProduct = async (product) => {
    try {
      await deleteProduct(product.id);
      await loadProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
      window.alert(
        "Failed to delete product. It may be used by existing orders."
      );
    }
  };

  const statusStyles = {
    full: { label: "Full", bg: "#2f6fa8" },
    low: { label: "Low", bg: "#c7a445" },
    out: { label: "Out", bg: "#a23b3b" },
    ordered: { label: "Ordered", bg: "#2f8a53" },
    request: { label: "Request", bg: "#7b5ba8" }
  };

  const statusMenuItemSx = (key) => ({
    bgcolor: statusStyles[key].bg,
    color: "#0f0b0a",
    "&.Mui-selected": {
      bgcolor: statusStyles[key].bg
    },
    "&:hover": {
      bgcolor: statusStyles[key].bg
    }
  });

  const renderStatusPill = (value) => {
    const status = statusStyles[value] || statusStyles.full;
    return (
      <Box
        component="span"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          px: 1.5,
          py: 0.25,
          borderRadius: 999,
          bgcolor: status.bg,
          color: "#0f0b0a",
          fontSize: 12,
          fontWeight: 600,
          textTransform: "uppercase",
          minWidth: 70
        }}
      >
        {status.label}
      </Box>
    );
  };

  const columns = useMemo(
    () => [
      {
        header: "Item",
        accessorKey: "name",
        size: 360,
        minSize: 0,
        meta: { editable: true, inputType: "text" },
        cell: (info) => info.getValue()
      },
      {
        header: "Status",
        accessorKey: "status",
        size: 160,
        minSize: 0,
        meta: { editable: true, inputType: "status" },
        cell: (info) => renderStatusPill(info.getValue() || "full")
      },
      {
        header: "Stock",
        accessorFn: (row) => Number(row.stock ?? 0),
        id: "stock",
        size: 180,
        minSize: 0,
        meta: { editable: true, inputType: "number" }
      },
      {
        header: "Needed",
        accessorFn: (row) => Number(row.needed ?? 0),
        id: "needed",
        size: 180,
        minSize: 0,
        meta: { editable: true, inputType: "number" },
        cell: (info) => info.getValue() ?? ""
      },
      {
        header: "Delete",
        id: "actions",
        size: 200,
        minSize: 0,
        cell: ({ row }) => (
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDeleteProduct(row.original)}
          >
            <DeleteOutline fontSize="small" />
          </IconButton>
        )
      }
    ],
    []
  );

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: "onChange"
  });

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
        <Button variant="contained" onClick={openAddDialog}>
          Add
        </Button>
      </Box>
      {error && (
        <Box sx={{ mb: 2, color: "var(--bb-copper)" }}>{error}</Box>
      )}
      <Box
        component="table"
        sx={{
          width: "fit-content",
          maxWidth: "100%",
          tableLayout: "auto",
          borderCollapse: "collapse",
          color: "var(--bb-sand)",
          backgroundColor: "rgba(21, 16, 14, 0.9)",
          border: "1px solid rgba(230, 209, 153, 0.2)"
        }}
      >
        <Box component="thead">
          {table.getHeaderGroups().map((headerGroup) => (
            <Box component="tr" key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Box
                  component="th"
                  key={header.id}
                  sx={{
                    textAlign: "center",
                    padding: "10px 12px",
                    color: "var(--bb-gold)",
                    borderBottom: "1px solid rgba(230, 209, 153, 0.2)",
                    position: "relative",
                    cursor: header.column.getCanSort() ? "pointer" : "default",
                    userSelect: "none",
                    whiteSpace: "nowrap"
                  }}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  <Box
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    sx={{
                      position: "absolute",
                      right: 0,
                      top: 0,
                      height: "100%",
                      width: 6,
                      bgcolor: "rgba(230, 209, 153, 0.6)",
                      cursor: "col-resize",
                      userSelect: "none",
                      touchAction: "none"
                    }}
                  />
                </Box>
              ))}
            </Box>
          ))}
        </Box>
        <Box component="tbody">
          {loading && (
            <Box component="tr">
              <Box component="td" colSpan={columns.length} sx={{ p: 2 }}>
                Loading...
              </Box>
            </Box>
          )}
          {!loading && table.getRowModel().rows.length === 0 && (
            <Box component="tr">
              <Box component="td" colSpan={columns.length} sx={{ p: 2 }}>
                No items found.
              </Box>
            </Box>
          )}
          {!loading &&
            table.getRowModel().rows.map((row) => (
              <Box component="tr" key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  const isEditing =
                    editingCell?.rowId === row.original.id &&
                    editingCell?.columnId === cell.column.id;
                  const isEditable = cell.column.columnDef.meta?.editable;
                  const inputType = cell.column.columnDef.meta?.inputType;

                  return (
                    <Box
                      component="td"
                      key={cell.id}
                      sx={{
                        padding: "8px 12px",
                        borderBottom: "1px solid rgba(230, 209, 153, 0.1)",
                        whiteSpace: "normal"
                      }}
                      onClick={() => {
                        if (!isEditable || isEditing) {
                          return;
                        }
                        startCellEdit(
                          row.original.id,
                          cell.column.id,
                          cell.getValue()
                        );
                      }}
                    >
                      {isEditable && isEditing ? (
                        inputType === "status" ? (
                          <Select
                            size="small"
                            value={editingValue || "full"}
                            onChange={(event) => {
                              const nextValue = event.target.value;
                              setEditingValue(nextValue);
                              commitCellEdit(nextValue);
                            }}
                            sx={{ minWidth: 120 }}
                            IconComponent={() => null}
                            renderValue={(value) => renderStatusPill(value)}
                          >
                            <MenuItem value="full" sx={statusMenuItemSx("full")}>
                              Full
                            </MenuItem>
                            <MenuItem value="low" sx={statusMenuItemSx("low")}>
                              Low
                            </MenuItem>
                            <MenuItem value="out" sx={statusMenuItemSx("out")}>
                              Out
                            </MenuItem>
                            <MenuItem
                              value="ordered"
                              sx={statusMenuItemSx("ordered")}
                            >
                              Ordered
                            </MenuItem>
                            <MenuItem
                              value="request"
                              sx={statusMenuItemSx("request")}
                            >
                              Request
                            </MenuItem>
                          </Select>
                        ) : (
                          <TextField
                            size="small"
                            value={editingValue}
                            onChange={(event) =>
                              setEditingValue(event.target.value)
                            }
                            onBlur={commitCellEdit}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                commitCellEdit();
                              }
                              if (event.key === "Escape") {
                                cancelCellEdit();
                              }
                            }}
                            inputProps={
                              inputType === "number"
                                ? { inputMode: "numeric", pattern: "[0-9]*" }
                                : undefined
                            }
                          />
                        )
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      )}
                    </Box>
                  );
                })}
              </Box>
            ))}
        </Box>
      </Box>
      <Popover
        open={dialogOpen}
        onClose={handleDialogClose}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          sx: {
            borderRadius: "160px / 48px",
            border: "1px solid rgba(230, 209, 153, 0.25)",
            bgcolor: "rgb(15, 11, 10)",
            boxShadow: "inset 0 0 30px rgba(0, 0, 0, 0.45)",
            minHeight: 270,
            width: 320,
            display: "flex",
            flexDirection: "column",
            p: 2,
            overflow: "hidden"
          }
        }}
      >
        <Box
          sx={{
            display: "grid",
            gap: 1,
            gridAutoRows: "min-content",
            width: "75%",
            justifyItems: "center",
            mt: 4,
            mb: 0,
            mx: "auto"
          }}
        >
          <TextField
            placeholder="Item"
            value={formValues.name}
            onChange={handleFieldChange("name")}
            error={Boolean(formErrors.name)}
            helperText={formErrors.name}
            autoFocus
            fullWidth
            sx={{ ...roundedFieldSx, ...centeredInputSx }}
            size="small"
          />
          <TextField
            placeholder="Needed"
            type="text"
            value={formValues.needed}
            onChange={handleFieldChange("needed")}
            error={Boolean(formErrors.needed)}
            helperText={formErrors.needed}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            fullWidth
            sx={{ ...roundedFieldSx, ...centeredInputSx }}
            size="small"
          />
          <TextField
            placeholder="Current"
            type="text"
            value={formValues.stock}
            onChange={handleFieldChange("stock")}
            error={Boolean(formErrors.stock)}
            helperText={formErrors.stock}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            fullWidth
            sx={{ ...roundedFieldSx, ...centeredInputSx }}
            size="small"
          />
          <FormControl fullWidth size="small" sx={roundedFieldSx}>
            <Select
              value={formValues.status}
              onChange={handleFieldChange("status")}
              displayEmpty
              inputProps={{ "aria-label": "Status" }}
              sx={{ textAlign: "center" }}
              IconComponent={() => null}
              renderValue={(value) => renderStatusPill(value || "full")}
            >
              <MenuItem value="full" sx={statusMenuItemSx("full")}>
                Full
              </MenuItem>
              <MenuItem value="low" sx={statusMenuItemSx("low")}>
                Low
              </MenuItem>
              <MenuItem value="out" sx={statusMenuItemSx("out")}>
                Out
              </MenuItem>
              <MenuItem value="ordered" sx={statusMenuItemSx("ordered")}>
                Ordered
              </MenuItem>
              <MenuItem value="request" sx={statusMenuItemSx("request")}>
                Request
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            mt: 3
          }}
        >
          <Button variant="contained" onClick={handleDialogSubmit}>
            Save
          </Button>
          <Button onClick={handleDialogClose}>Cancel</Button>
        </Box>
      </Popover>
    </Box>
  );
}
