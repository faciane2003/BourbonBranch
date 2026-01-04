import Product from "./Product";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { fetchProducts } from "../../../api/api";
export default function Products() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchProducts()
      .then((data) => {
        if (isMounted) {
          setRows(data);
        }
      })
      .catch((error) => {
        console.error("Failed to load products:", error);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

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
  ];

  return (
    <div>
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
    </div>
  );
}
