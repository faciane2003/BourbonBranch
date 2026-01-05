import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
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
  const [dialogMode, setDialogMode] = useState("add");
  const [activeProductId, setActiveProductId] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "",
    category: "General",
    price: "0",
    stock: "",
    needed: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const roundedFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "22px"
    }
  };

  const loadProducts = () => {
    let isMounted = true;
    fetchProducts()
      .then((data) => {
        if (isMounted) {
          setRows(data.slice(-2));
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

  const openAddDialog = () => {
    setDialogMode("add");
    setActiveProductId(null);
    setFormValues({
      name: "",
      category: "General",
      price: "0",
      stock: "",
      needed: ""
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  const openEditDialog = (product) => {
    setDialogMode("edit");
    setActiveProductId(product.id);
    setFormValues({
      name: product.name || "",
      category: product.category || "General",
      price: String(product.price ?? "0"),
      stock: String(product.stock ?? ""),
      needed: String(product.needed ?? "")
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setFormErrors({});
  };

  const handleFieldChange = (field) => (event) => {
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

  const handleDialogSubmit = async () => {
    const { isValid, priceValue, stockValue, neededValue } = validateForm();
    if (!isValid) {
      return;
    }

    const payload = {
      name: formValues.name.trim(),
      category: formValues.category.trim() || "General",
      price: priceValue,
      stock: stockValue,
      needed: neededValue ?? 0
    };

    try {
      if (dialogMode === "add") {
        await createProduct(payload);
      } else {
        await updateProduct(activeProductId, payload);
      }
      await loadProducts();
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

  const columns = useMemo(
    () => [
      {
        header: "Item",
        accessorKey: "name",
        size: 360,
        minSize: 0,
        cell: (info) => info.getValue()
      },
      {
        header: "Stock",
        accessorKey: "stock",
        size: 180,
        minSize: 0
      },
      {
        header: "Needed",
        accessorKey: "needed",
        size: 180,
        minSize: 0,
        cell: (info) => info.getValue() ?? ""
      },
      {
        header: "Actions",
        id: "actions",
        size: 200,
        minSize: 0,
        cell: ({ row }) => (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => openEditDialog(row.original)}
            >
              Edit
            </Button>
            <Button
              size="small"
              color="error"
              variant="outlined"
              onClick={() => handleDeleteProduct(row.original)}
            >
              Delete
            </Button>
          </Box>
        )
      }
    ],
    []
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange"
  });

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
        <Button variant="contained" onClick={openAddDialog}>
          +
        </Button>
      </Box>
      {error && (
        <Box sx={{ mb: 2, color: "var(--bb-copper)" }}>{error}</Box>
      )}
      <Box
        component="table"
        sx={{
          width: "60%",
          tableLayout: "fixed",
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
                    textAlign: "left",
                    padding: "10px 12px",
                    color: "var(--bb-gold)",
                    borderBottom: "1px solid rgba(230, 209, 153, 0.2)",
                    position: "relative",
                    width: header.getSize()
                  }}
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
                {row.getVisibleCells().map((cell) => (
                  <Box
                    component="td"
                    key={cell.id}
                    sx={{
                      padding: "8px 12px",
                      borderBottom: "1px solid rgba(230, 209, 153, 0.1)",
                      width: cell.column.getSize(),
                      whiteSpace: "normal",
                      wordBreak: "break-word"
                    }}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </Box>
                ))}
              </Box>
            ))}
        </Box>
      </Box>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: "160px / 48px",
            border: "1px solid rgba(230, 209, 153, 0.25)",
            bgcolor: "rgba(15, 11, 10, 0.9)",
            boxShadow: "inset 0 0 30px rgba(0, 0, 0, 0.45)",
            minHeight: 270,
            display: "flex",
            flexDirection: "column"
          }
        }}
      >
        <DialogContent
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            pt: 9
          }}
        >
          <Box
            sx={{
              display: "grid",
              gap: 1,
              gridAutoRows: "min-content",
              width: "80%",
              justifyItems: "center"
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
              sx={roundedFieldSx}
              size="small"
              InputProps={{ sx: { textAlign: "center" } }}
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
              sx={roundedFieldSx}
              size="small"
              InputProps={{ sx: { textAlign: "center" } }}
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
              sx={roundedFieldSx}
              size="small"
              InputProps={{ sx: { textAlign: "center" } }}
            />
          </Box>
        </DialogContent>
        <Box sx={{ flex: 1 }} />
        <DialogActions
          sx={{
            px: 3,
            py: 0,
            justifyContent: "center",
            gap: 2,
            mt: -12.5
          }}
        >
          <Button variant="contained" onClick={handleDialogSubmit}>
            {dialogMode === "add" ? "Add" : "Save"}
          </Button>
          <Button onClick={handleDialogClose}>Cancel</Button>
        </DialogActions>
        <Box sx={{ flex: 1 }} />
      </Dialog>
    </Box>
  );
}
