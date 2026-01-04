import Product from "./Product";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
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

  const handleAddProduct = async () => {
    const name = window.prompt("Product name:");
    if (!name) {
      return;
    }
    const category = window.prompt("Category:", "General") || "General";
    const priceInput = window.prompt("Price:", "0");
    const stockInput = window.prompt("Stock:", "0");
    const price = Number(priceInput);
    const stock = Number(stockInput);
    if (Number.isNaN(price) || Number.isNaN(stock)) {
      window.alert("Price and stock must be numbers.");
      return;
    }
    try {
      await createProduct({ name, category, price, stock });
      await loadProducts();
    } catch (error) {
      console.error("Failed to add product:", error);
      window.alert("Failed to add product.");
    }
  };

  const handleEditProduct = async (product) => {
    const name = window.prompt("Product name:", product.name) || product.name;
    const category =
      window.prompt("Category:", product.category) || product.category;
    const priceInput = window.prompt("Price:", String(product.price));
    const stockInput = window.prompt("Stock:", String(product.stock));
    const price = Number(priceInput);
    const stock = Number(stockInput);
    if (Number.isNaN(price) || Number.isNaN(stock)) {
      window.alert("Price and stock must be numbers.");
      return;
    }
    try {
      await updateProduct(product.id, { name, category, price, stock });
      await loadProducts();
    } catch (error) {
      console.error("Failed to update product:", error);
      window.alert("Failed to update product.");
    }
  };

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Delete product "${product.name}"?`)) {
      return;
    }
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

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
      description: "id of the product",
    },
    {
      field: "product",
      headerName: "Product",
      width: 400,
      description: "",
      //same here we have the cell data which i will get the value of the cells in the tables cellData.row.fieldName

      renderCell: (cellData) => {
        return <Product productName={cellData.row.name} />;
      },
    },
    {
      field: "category",
      headerName: "Category",
      width: 200,
      description: "category of the product",
    },
    {
      field: "price",
      headerName: "Price",
      width: 150,
      description: "price of the product",
      valueGetter: (params) => "$" + params.row.stock,
    },
    {
      field: "stock",
      headerName: "Stock",
      width: 200,
      description: "how many items in the stock",
      valueGetter: (params) => params.row.stock + " pcs",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 220,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => handleEditProduct(params.row)}
          >
            Edit
          </Button>
          <Button
            size="small"
            color="error"
            variant="outlined"
            onClick={() => handleDeleteProduct(params.row)}
          >
            Delete
          </Button>
        </Box>
      )
    }
  ];

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" onClick={handleAddProduct}>
          Add Product
        </Button>
      </Box>
      {error && (
        <Box sx={{ mb: 2, color: "var(--bb-copper)" }}>{error}</Box>
      )}
      <DataGrid
        sx={{ borderLeft: 0, borderRight: 0, borderRadius: 0 }}
        rows={rows}
        columns={columns}
        loading={loading}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
      />
    </Box>
  );
}
