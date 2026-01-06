import {
  Alert,
  Box,
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Popover,
  Select,
  Snackbar,
  Skeleton,
  TextField
} from "@mui/material";
import { DeleteOutline, Edit } from "@mui/icons-material";
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
export default function Products({ scope = "items", fields = [] }) {
  const isItemsScope = scope === "items";
  const todayValue = () => new Date().toISOString().slice(0, 10);
  const timeValue = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  };
  const formatDateLabel = (value) => {
    if (!value) {
      return "";
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }
    const monthNames = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC"
    ];
    const month = monthNames[parsed.getMonth()];
    const day = String(parsed.getDate()).padStart(2, "0");
    const year = parsed.getFullYear();
    return `${month} ${day} ${year}`;
  };
  const formatTimeLabel = (value) => {
    if (!value) {
      return "";
    }
    const [rawHours, rawMinutes] = String(value).split(":");
    const hours = Number(rawHours);
    const minutes = rawMinutes ?? "00";
    if (Number.isNaN(hours)) {
      return value;
    }
    const suffix = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${String(minutes).padStart(2, "0")} ${suffix}`;
  };
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
  const [pendingDelete, setPendingDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const buildFormValues = (product) => {
    if (isItemsScope) {
      return {
        name: product?.name || "",
        category: product?.category || "General",
        price: String(product?.price ?? "0"),
        stock: String(product?.stock ?? ""),
        needed: String(product?.needed ?? ""),
        status: product?.status === "active" ? "full" : product?.status || "full"
      };
    }

    const next = {};
    fields.forEach((field) => {
      if (product) {
        if (field.type === "date") {
          next[field.key] = product.data?.[field.key] || todayValue();
          return;
        }
        next[field.key] = product.data?.[field.key] ?? "";
        return;
      }
      if (field.type === "date") {
        next[field.key] = todayValue();
        return;
      }
      if (field.type === "time") {
        next[field.key] = timeValue();
        return;
      }
      next[field.key] = "";
    });
    return next;
  };

  const [formValues, setFormValues] = useState(buildFormValues());
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

  const fetchWithRetry = async (attempt = 0) => {
    try {
      return await fetchProducts(scope);
    } catch (error) {
      if (attempt >= 2) {
        throw error;
      }
      const delayMs = 800 * (attempt + 1);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return fetchWithRetry(attempt + 1);
    }
  };

  const loadProducts = () => {
    let isMounted = true;
    setLoading(true);
    fetchWithRetry()
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

  useEffect(() => loadProducts(), [scope]);

  const openAddDialog = (event) => {
    setDialogMode("add");
    setActiveProductId(null);
    setFormValues(buildFormValues());
    setFormErrors({});
    setAnchorEl(event?.currentTarget || null);
    setDialogOpen(true);
  };

  const openEditDialog = (event, product) => {
    setDialogMode("edit");
    setActiveProductId(product.id);
    setFormValues(buildFormValues(product));
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
    setFormValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const validateForm = () => {
    if (!isItemsScope) {
      setFormErrors({});
      return { isValid: true };
    }

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
    const resolvedValue =
      overrideValue && typeof overrideValue === "object" && "target" in overrideValue
        ? overrideValue.target.value
        : overrideValue;

    if (isItemsScope) {
      if (columnId === "name") {
        updated.name = String(editingValue).trim();
      } else if (columnId === "stock") {
        updated.stock = Number(editingValue || 0);
      } else if (columnId === "needed") {
        updated.needed = Number(editingValue || 0);
      } else if (columnId === "status") {
        updated.status = (resolvedValue ?? editingValue) || "full";
      }
    } else {
      updated.data = { ...(updated.data || {}) };
      updated.data[columnId] = resolvedValue ?? editingValue;
    }

    const payload = isItemsScope
      ? {
          name: updated.name,
          category: updated.category || "General",
          price: Number(updated.price || 0),
          stock: Number(updated.stock || 0),
          needed: Number(updated.needed || 0),
          status: updated.status,
          scope
        }
      : {
          data: updated.data || {},
          scope
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

    const payload = (() => {
      if (isItemsScope) {
        return {
          name: formValues.name.trim(),
          category: formValues.category.trim() || "General",
          price: priceValue,
          stock: stockValue,
          needed: neededValue ?? 0,
          status: formValues.status || "full",
          scope
        };
      }

      const data = {};
      fields.forEach((field) => {
        data[field.key] = formValues[field.key] ?? "";
      });
      const primaryKey = fields[0]?.key;
      const fallbackName = primaryKey ? String(data[primaryKey] || "").trim() : "";
      return {
        name: fallbackName || "Untitled",
        category: "General",
        price: 0,
        stock: 0,
        needed: 0,
        status: "full",
        scope,
        data
      };
    })();

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

  const finalizeDelete = async (product) => {
    try {
      await deleteProduct(product.id);
    } catch (error) {
      console.error("Failed to delete product:", error);
      setRows((prev) =>
        prev.some((row) => row.id === product.id)
          ? prev
          : [product, ...prev]
      );
      window.alert(
        "Failed to delete product. It may be used by existing orders."
      );
    }
  };

  const handleDeleteProduct = (product) => {
    setRows((prev) => prev.filter((row) => row.id !== product.id));
    setSnackbarOpen(true);

    setPendingDelete((prev) => {
      if (prev?.timeoutId) {
        clearTimeout(prev.timeoutId);
        finalizeDelete(prev.item);
      }

      const timeoutId = setTimeout(() => {
        finalizeDelete(product).finally(() => {
          setPendingDelete((current) =>
            current?.item?.id === product.id ? null : current
          );
        });
      }, 10000);

      return { item: product, timeoutId };
    });
  };

  const handleUndoDelete = () => {
    if (!pendingDelete) {
      return;
    }
    clearTimeout(pendingDelete.timeoutId);
    setRows((prev) =>
      prev.some((row) => row.id === pendingDelete.item.id)
        ? prev
        : [pendingDelete.item, ...prev]
    );
    setPendingDelete(null);
    setSnackbarOpen(false);
  };

  const statusStyles = {
    out: { label: "Out", bg: "#a23b3b" },
    low: { label: "Low", bg: "#c7a445" },
    ordered: { label: "Ordered", bg: "#2f8a53" },
    full: { label: "Full", bg: "#2f6fa8" }
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
          color: { xs: "#f7f1e5", sm: "#0f0b0a" },
          fontSize: { xs: 10, sm: 12 },
          fontWeight: 600,
          textTransform: "uppercase",
          minWidth: { xs: 0, sm: 70 },
          width: { xs: "100%", sm: "auto" },
          maxWidth: "100%",
          px: { xs: 0.75, sm: 1.5 }
        }}
      >
        {status.label}
      </Box>
    );
  };

  const columns = useMemo(
    () => {
      if (isItemsScope) {
        return [
          {
            header: "",
            id: "edit",
            size: 100,
            minSize: 0,
            meta: { align: "center" },
            cell: ({ row }) => (
              <IconButton
                size="small"
                onClick={(event) => openEditDialog(event, row.original)}
              >
                <Edit fontSize="small" />
              </IconButton>
            )
          },
          {
            header: "Item",
            accessorKey: "name",
            size: 400,
            minSize: 0,
            meta: {
              editable: true,
              inputType: "text",
              align: "center",
              allowWrap: true
            },
            cell: (info) => info.getValue()
          },
          {
            header: "",
            accessorKey: "status",
            size: 140,
            minSize: 0,
            meta: { editable: true, inputType: "status", align: "center" },
            cell: (info) => renderStatusPill(info.getValue() || "full")
          },
          {
            header: "Stock",
            accessorFn: (row) => Number(row.stock ?? 0),
            id: "stock",
            size: 110,
            minSize: 0,
            meta: { editable: true, inputType: "number", align: "center" }
          },
          {
            header: "Need",
            accessorFn: (row) => Number(row.needed ?? 0),
            id: "needed",
            size: 110,
            minSize: 0,
            meta: { editable: true, inputType: "number", align: "center" },
            cell: (info) => info.getValue() ?? ""
          },
          {
            header: "",
            id: "actions",
            size: 100,
            minSize: 0,
            meta: { align: "center" },
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
        ];
      }

      const dynamicColumns = fields.map((field) => ({
        header: field.label,
        accessorFn: (row) => row.data?.[field.key] ?? "",
        id: field.key,
        size: 140,
        minSize: 0,
        meta: {
          editable: true,
          inputType: field.type,
          align: "center",
          options: field.options || []
        },
        cell: (info) =>
          field.type === "date"
            ? formatDateLabel(info.getValue())
            : field.type === "time"
              ? formatTimeLabel(info.getValue())
              : info.getValue() ?? ""
      }));

      dynamicColumns.unshift({
        header: "",
        id: "edit",
        size: 100,
        minSize: 0,
        meta: { align: "center" },
        cell: ({ row }) => (
          <IconButton
            size="small"
            onClick={(event) => openEditDialog(event, row.original)}
          >
            <Edit fontSize="small" />
          </IconButton>
        )
      });

      dynamicColumns.push({
        header: "",
        id: "actions",
        size: 100,
        minSize: 0,
        meta: { align: "center" },
        cell: ({ row }) => (
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDeleteProduct(row.original)}
          >
            <DeleteOutline fontSize="small" />
          </IconButton>
        )
      });

      return dynamicColumns;
    },
    [fields, isItemsScope]
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
      {loading && (
        <Box sx={{ mb: 1, color: "var(--bb-sand)", fontSize: "0.8rem" }}>
          Loading
        </Box>
      )}
      <Box sx={{ width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
        <Box
          component="table"
          sx={{
            width: "100%",
            minWidth: "100%",
            tableLayout: "fixed",
            borderCollapse: "collapse",
            color: "var(--bb-sand)",
            backgroundColor: "rgba(21, 16, 14, 0.9)",
            border: "1px solid rgba(230, 209, 153, 0.2)",
            fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" }
          }}
        >
          <Box component="colgroup">
            {(() => {
              const totalSize = table.getTotalSize();
              return table.getVisibleLeafColumns().map((column) => {
                const width = totalSize
                  ? `${(column.getSize() / totalSize) * 100}%`
                  : `${100 / columns.length}%`;
                return (
                  <Box component="col" key={column.id} sx={{ width }} />
                );
              });
            })()}
          </Box>
          <Box component="thead">
            {table.getHeaderGroups().map((headerGroup) => (
              <Box component="tr" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Box
                    component="th"
                    key={header.id}
                    sx={{
                      textAlign: "center",
                      padding: { xs: "6px 6px", sm: "8px 8px", md: "10px 12px" },
                      color: "var(--bb-gold)",
                      borderBottom: "1px solid rgba(230, 209, 153, 0.2)",
                      position: "relative",
                      cursor: header.column.getCanSort() ? "pointer" : "default",
                      userSelect: "none",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "clip"
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
                        bgcolor: "transparent",
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
          {loading &&
            Array.from({ length: 3 }).map((_, rowIndex) => (
              <Box component="tr" key={`skeleton-${rowIndex}`}>
                {table.getVisibleLeafColumns().map((column) => (
                  <Box
                    component="td"
                    key={`${column.id}-${rowIndex}`}
                    sx={{
                      padding: { xs: "6px 6px", sm: "7px 8px", md: "8px 12px" },
                      borderBottom: "1px solid rgba(230, 209, 153, 0.1)"
                    }}
                  >
                    <Skeleton
                      variant="text"
                      height={18}
                      sx={{ bgcolor: "rgba(230, 209, 153, 0.15)" }}
                    />
                  </Box>
                ))}
              </Box>
            ))}
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
                  const selectOptions =
                    cell.column.columnDef.meta?.options || [];
                  const align = cell.column.columnDef.meta?.align || "left";
                  const allowWrap = cell.column.columnDef.meta?.allowWrap;

                    return (
                      <Box
                        component="td"
                        key={cell.id}
                        sx={{
                          padding: { xs: "6px 6px", sm: "7px 8px", md: "8px 12px" },
                          borderBottom: "1px solid rgba(230, 209, 153, 0.1)",
                          whiteSpace: allowWrap ? "normal" : "nowrap",
                          overflow: allowWrap ? "visible" : "hidden",
                          textOverflow: "clip",
                          textAlign: align
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
                              sx={{ minWidth: { xs: 80, sm: 120 } }}
                              IconComponent={() => null}
                              renderValue={(value) => renderStatusPill(value)}
                            >
                              <MenuItem value="out" sx={statusMenuItemSx("out")}>
                                Out
                              </MenuItem>
                              <MenuItem value="low" sx={statusMenuItemSx("low")}>
                                Low
                              </MenuItem>
                              <MenuItem
                                value="ordered"
                                sx={statusMenuItemSx("ordered")}
                              >
                                Ordered
                              </MenuItem>
                              <MenuItem value="full" sx={statusMenuItemSx("full")}>
                                Full
                              </MenuItem>
                            </Select>
                        ) : inputType === "select" ? (
                          <Select
                            size="small"
                            value={editingValue || ""}
                            onChange={(event) => {
                              const nextValue = event.target.value;
                              setEditingValue(nextValue);
                              commitCellEdit(nextValue);
                            }}
                            sx={{ minWidth: { xs: 80, sm: 120 } }}
                            IconComponent={() => null}
                          >
                            {selectOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                        ) : (
                          <TextField
                            size="small"
                            value={editingValue}
                            onChange={(event) =>
                              setEditingValue(event.target.value)
                            }
                            onBlur={() => commitCellEdit()}
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
          {isItemsScope ? (
            <>
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
                  sx={{
                    textAlign: "center",
                    "& .MuiSelect-select": {
                      overflow: "visible",
                      textOverflow: "unset",
                      display: "flex",
                      justifyContent: "center"
                    }
                  }}
                  IconComponent={() => null}
                  renderValue={(value) => renderStatusPill(value || "full")}
                >
                  <MenuItem value="out" sx={statusMenuItemSx("out")}>
                    Out
                  </MenuItem>
                  <MenuItem value="low" sx={statusMenuItemSx("low")}>
                    Low
                  </MenuItem>
                  <MenuItem value="ordered" sx={statusMenuItemSx("ordered")}>
                    Ordered
                  </MenuItem>
                  <MenuItem value="full" sx={statusMenuItemSx("full")}>
                    Full
                  </MenuItem>
                </Select>
              </FormControl>
            </>
          ) : (
            fields.map((field, index) =>
              field.type === "select" ? (
                <FormControl
                  key={field.key}
                  fullWidth
                  size="small"
                  sx={roundedFieldSx}
                >
                  <Select
                    value={formValues[field.key] ?? ""}
                    onChange={handleFieldChange(field.key)}
                    displayEmpty
                    inputProps={{ "aria-label": field.label }}
                    sx={{ textAlign: "center" }}
                    IconComponent={() => null}
                    autoFocus={index === 0 && field.type === "text"}
                    renderValue={(value) =>
                      value ? value : field.label
                    }
                  >
                    <MenuItem value="" disabled>
                      {field.label}
                    </MenuItem>
                    {(field.options || []).map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  key={field.key}
                  placeholder={field.label}
                  type={field.type || "text"}
                  value={formValues[field.key] ?? ""}
                  onChange={handleFieldChange(field.key)}
                  autoFocus={index === 0 && field.type === "text"}
                  fullWidth
                  sx={{ ...roundedFieldSx, ...centeredInputSx }}
                  size="small"
                />
              )
            )
          )}
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={10000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="info"
          sx={{ width: "100%" }}
          action={
            <Button color="inherit" size="small" onClick={handleUndoDelete}>
              Undo
            </Button>
          }
        >
          Item deleted.
        </Alert>
      </Snackbar>
    </Box>
  );
}
