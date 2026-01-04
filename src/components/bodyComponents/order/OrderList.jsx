import { Avatar, Box, Button, Modal, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Component } from "react";
import OrderModal from "./OrderModal";
import { createOrder, deleteOrder, fetchOrders, updateOrder } from "../../../api/api";
export default class OrderList extends Component {
  handlOrderDetail = (order) => {
    this.setState({ order: order, open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  constructor(props) {
    super(props);
    this.state = {
      order: {},
      open: false,
      rows: [],
      loading: true,
      error: ""
    };
  }

  componentDidMount() {
    this.loadOrders();
  }

  loadOrders = () => {
    this.setState({ loading: true });
    fetchOrders()
      .then((rows) => {
        this.setState({ rows });
      })
      .catch((error) => {
        console.error("Failed to load orders:", error);
        this.setState({
          error: "Unable to load orders. Check the API service."
        });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  parseItemsInput = (itemsInput) => {
    const items = itemsInput
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => {
        const [productIdRaw, quantityRaw] = entry.split(":");
        const productId = Number(productIdRaw);
        const quantity = Number(quantityRaw);
        return { productId, quantity };
      })
      .filter((item) => !Number.isNaN(item.productId) && !Number.isNaN(item.quantity));
    return items;
  };

  handleAddOrder = async () => {
    const customerIdInput = window.prompt("Customer ID:");
    const itemsInput = window.prompt(
      "Items (productId:quantity, comma separated):",
      "1:1,2:3"
    );
    const customerId = Number(customerIdInput);
    const items = this.parseItemsInput(itemsInput || "");
    if (Number.isNaN(customerId) || items.length === 0) {
      window.alert("Invalid customer ID or items.");
      return;
    }
    try {
      await createOrder({ customerId, items });
      this.loadOrders();
    } catch (error) {
      console.error("Failed to add order:", error);
      window.alert("Failed to add order.");
    }
  };

  handleEditOrder = async (order) => {
    const customerIdInput = window.prompt(
      "Customer ID:",
      String(order.customer?.id || "")
    );
    const existingItems = (order.products || [])
      .map((item) => `${item.product.id}:${item.quantity}`)
      .join(",");
    const itemsInput = window.prompt(
      "Items (productId:quantity, comma separated):",
      existingItems
    );
    const customerId = Number(customerIdInput);
    const items = this.parseItemsInput(itemsInput || "");
    if (Number.isNaN(customerId) || items.length === 0) {
      window.alert("Invalid customer ID or items.");
      return;
    }
    try {
      await updateOrder(order.id, { customerId, items });
      this.loadOrders();
    } catch (error) {
      console.error("Failed to update order:", error);
      window.alert("Failed to update order.");
    }
  };

  handleDeleteOrder = async (order) => {
    if (!window.confirm(`Delete order #${order.id}?`)) {
      return;
    }
    try {
      await deleteOrder(order.id);
      this.loadOrders();
    } catch (error) {
      console.error("Failed to delete order:", error);
      window.alert("Failed to delete order.");
    }
  };
  render() {
    const columns = [
      {
        field: "id",
        headerName: "ID",
        width: 90,
        description: "id of the product",
      },
      {
        field: "fullname",
        headerName: "Full Name",
        width: 400,
        description: "customer full name",
        renderCell: (params) => {
          return (
            <>
              <Avatar alt="name" sx={{ width: 30, height: 30 }}>
                Z
              </Avatar>
              <Typography variant="subtitle2" sx={{ mx: 3 }}>
                {`${params.row.customer.firstName || ""} ${
                  params.row.customer.lastName || ""
                } `}
              </Typography>
            </>
          );
        },
      },
      {
        field: "mobile",
        headerName: "Mobile",
        width: 400,
        description: "customer phone number ",
        valueGetter: (params) => params.row.customer.mobile,
      },
      {
        field: "total",
        headerName: "Total Amount",
        width: 300,
        description: "total amount of the order",
        valueGetter: (params) => {
          const products = params.row.products || [];
          const total = products.reduce(
            (sum, item) =>
              sum +
              item.quantity *
                Number(item.product?.price ?? 0),
            0
          );
          return `$${total}`;
        }
      },
      {
        field: "details",
        headerName: "Order Details",
        width: 300,
        description: "the details of the order",

        renderCell: (params) => {
          const order = params.row;
          return (
            <Button
              variant="contained"
              sx={{ bgcolor: "#504099" }}
              onClick={() => this.handlOrderDetail(order)}
            >
              Order Details
            </Button>
          );
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 240,
        sortable: false,
        renderCell: (params) => (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => this.handleEditOrder(params.row)}
            >
              Edit
            </Button>
            <Button
              size="small"
              color="error"
              variant="outlined"
              onClick={() => this.handleDeleteOrder(params.row)}
            >
              Delete
            </Button>
          </Box>
        )
      }
    ];

    return (
      <Box
        sx={{
          margin: 3,
          bgcolor: "background.paper",
          borderRadius: 2,
          padding: 3,
          height: "100%",
          color: "var(--bb-sand)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button variant="contained" onClick={this.handleAddOrder}>
            Add Order
          </Button>
        </Box>
        {this.state.error && (
          <Box sx={{ mb: 2, color: "var(--bb-copper)" }}>
            {this.state.error}
          </Box>
        )}
        <DataGrid
          sx={{
            borderLeft: 0,
            borderRight: 0,
            borderRadius: 0,
          }}
          rows={this.state.rows}
          columns={columns}
          loading={this.state.loading}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[15, 20, 30]}
          rowSelection={false}
        />
        <Modal open={this.state.open} onClose={this.handleClose}>
          {/*  */}
          <Box>
            <OrderModal order={this.state.order} />
          </Box>
        </Modal>
      </Box>
    );
  }
}
