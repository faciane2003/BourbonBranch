import { DeleteOutline } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

export default function OrderModal({ order }) {
  const handleDeleteProductFromOrder = (orderId, productId) => {
    console.log(
      "delete the product : ",
      productId,
      " from the order ",
      orderId
    );
  };
  const products = order?.products ?? [];
  const customer = order?.customer;
  const tableRows = products.map((orderProduct, index) => {
    return (
      <TableRow key={orderProduct.product?.id ?? index}>
        <TableCell>{orderProduct.product?.name}</TableCell>
        <TableCell>{orderProduct.quantity}</TableCell>
        <TableCell>{orderProduct.product?.stock}</TableCell>
        <TableCell>
          <IconButton
            onClick={() =>
              handleDeleteProductFromOrder(
                order.id,
                orderProduct.product?.id
              )
            }
          >
            <DeleteOutline color="error" />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  });
  return (
    <Box
      sx={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: "50%",
        bgcolor: "background.paper",

        borderRadius: 2,
        boxShadow: 24,
        p: 4,
        color: "var(--bb-sand)",
      }}
    >
      <Box sx={{ color: "black", display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" sx={{ m: 3 }}>
          OrderList
        </Typography>
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "30%",
            m: 3,
          }}
        >
          <Typography variant="subtitle1">Name </Typography>
          <Typography variant="subtitle1" color={"grey"}>
            {customer ? `${customer.firstName} ${customer.lastName}` : "-"}
          </Typography>
        </Paper>
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "30%",
            m: 3,
          }}
        >
          <Typography variant="subtitle1">Position </Typography>
          <Typography variant="subtitle1" color={"grey"}>
            {customer?.position || "-"}
          </Typography>
        </Paper>
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "30%",
            m: 3,
          }}
        >
          <Typography variant="subtitle1">Mobile </Typography>
          <Typography variant="subtitle1" color={"grey"}>
            {customer?.mobile || "-"}
          </Typography>
        </Paper>
        <Box>
          <TableContainer sx={{ marginBottom: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Stcok Availability</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* loop through the product list */}
                {tableRows}
              </TableBody>
            </Table>
          </TableContainer>
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              m: 0,
            }}
          >
            <Button
              variant="contained"
              sx={{ bgcolor: "error.main", m: 3, px: 12 }}
            >
              Reject
            </Button>
            <Button
              variant="contained"
              sx={{ bgcolor: "#504099", m: 3, px: 12 }}
            >
              Approve
            </Button>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
