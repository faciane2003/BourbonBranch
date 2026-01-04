import { Component } from "react";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  createCustomer,
  deleteCustomer,
  fetchCustomers,
  updateCustomer
} from "../../../api/api";
export default class CustomerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      loading: true
    };
  }

  componentDidMount() {
    this.loadCustomers();
  }

  loadCustomers = () => {
    this.setState({ loading: true });
    fetchCustomers()
      .then((rows) => {
        this.setState({ rows });
      })
      .catch((error) => {
        console.error("Failed to load customers:", error);
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  handleAddCustomer = async () => {
    const firstName = window.prompt("First name:");
    if (!firstName) {
      return;
    }
    const lastName = window.prompt("Last name:") || "";
    const position = window.prompt("Position:", "Customer") || "Customer";
    const mobile = window.prompt("Mobile:", "") || "";
    try {
      await createCustomer({ firstName, lastName, position, mobile });
      this.loadCustomers();
    } catch (error) {
      console.error("Failed to add customer:", error);
      window.alert("Failed to add customer.");
    }
  };

  handleEditCustomer = async (customer) => {
    const firstName =
      window.prompt("First name:", customer.firstName) || customer.firstName;
    const lastName =
      window.prompt("Last name:", customer.lastName) || customer.lastName;
    const position =
      window.prompt("Position:", customer.position) || customer.position;
    const mobile = window.prompt("Mobile:", customer.mobile) || customer.mobile;
    try {
      await updateCustomer(customer.id, {
        firstName,
        lastName,
        position,
        mobile
      });
      this.loadCustomers();
    } catch (error) {
      console.error("Failed to update customer:", error);
      window.alert("Failed to update customer.");
    }
  };

  handleDeleteCustomer = async (customer) => {
    if (!window.confirm(`Delete ${customer.firstName} ${customer.lastName}?`)) {
      return;
    }
    try {
      await deleteCustomer(customer.id);
      this.loadCustomers();
    } catch (error) {
      console.error("Failed to delete customer:", error);
      window.alert(
        "Failed to delete customer. They may have existing orders."
      );
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
        width: 200,
        description: "customer full name",
        renderCell: (params) => {
          return (
            <>
              <Avatar
                alt="name"
                variant="square"
                sx={{ borderRadius: 1, width: 30, height: 30 }}
              >
                Z
              </Avatar>
              <Typography variant="subtitle2" sx={{ mx: 3 }}>
                {`${params.row.firstName || ""} ${params.row.lastName || ""} `}
              </Typography>
            </>
          );
        },
      },
      {
        field: "orderNumber",
        headerName: "Number Of Order",
        width: 200,
        description: "number of order that the customer made",
        valueGetter: (params) => params.row.orderCount ?? 0,
      },
      {
        field: "total",
        headerName: "Total Amount",
        width: 300,
        description: "total amount of the order",
        valueGetter: () => {
          const total = 300;
          return total;
        },
      },
      {
        field: "orderHistory",
        headerName: "Order Details",
        width: 300,
        description: "the details of the order",
        valueGetter: () => {
          const history = "03/01/2027";
          return history;
        },
      },
      {
        field: "mobile",
        headerName: "Mobile",
        width: 300,
        description: "total amount of the order",
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
              onClick={() => this.handleEditCustomer(params.row)}
            >
              Edit
            </Button>
            <Button
              size="small"
              color="error"
              variant="outlined"
              onClick={() => this.handleDeleteCustomer(params.row)}
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
          bgcolor: "white",
          borderRadius: 2,
          padding: 3,
          height: "100%",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button variant="contained" onClick={this.handleAddCustomer}>
            Add Customer
          </Button>
        </Box>
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
        <Box></Box>
      </Box>
    );
  }
}
