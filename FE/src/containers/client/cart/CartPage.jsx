import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styled from "styled-components";
import DeleteForeverIcon from "mdi-react/DeleteForeverIcon";
import {
    Card,
    CardBody,
    CardTitleWrap,
    CardTitle,
} from "@/shared/components/Card";
import { colorAdditional, colorRedHover } from "@/utils/palette";
import { left } from "@/utils/directions";
import CartPurchase from "./CartPurchase";
import { useSelector } from "react-redux";
import { selectUser, selectTotalUsers } from "@/redux/reducers/userSlice";
import {
    Table,
    TableRow,
    TableWrap,
    TableCell,
    TableCheckbox,
} from "@/shared/components/MaterialTableElements";
import TableBody from "@mui/material/TableBody";
import MatTableHead from "./MaterialTable/MatTableHead";
import MatTableToolbar from "./MaterialTable/MatTableToolbar";
import { Button } from "./../../../shared/components/Button";
import { selectProducts } from "@/redux/reducers/productSlice";

const CartPage = () => {
    const user = useSelector(selectUser);
    const totalUsers = useSelector(selectTotalUsers);
    const products = useSelector(selectProducts);

    const [currentUser, setCurrentUser] = useState({});
    const [cartItems, setCartItems] = useState([]);
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("name");
    const [selected, setSelected] = useState(new Map([]));
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        if (user && totalUsers?.length > 0) {
            const foundUser = totalUsers.find(
                (u) => u.username === user.username
            );
            setCurrentUser(foundUser || {});
            setCartItems(foundUser?.cart || []);
        }
    }, [user, totalUsers]);

    const handleRemoveItem = (id) => {
        setCartItems(cartItems.filter((item) => item.product.id !== id));
    };

    const handleDeleteSelected = () => {
        const selectedIds = [...selected]
            .filter(([, value]) => value)
            .map(([key]) => key);
        setCartItems(
            cartItems.filter((item) => !selectedIds.includes(item.product.id))
        );
        setSelected(new Map([]));
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleSelectAllClick = (event, checked) => {
        if (checked) {
            const newSelected = new Map();
            cartItems.forEach((item) => newSelected.set(item.product.id, true));
            setSelected(newSelected);
            return;
        }
        setSelected(new Map([]));
    };

    const handleClick = (id) => {
        const newSelected = new Map(selected);
        const isSelected = newSelected.get(id);
        newSelected.set(id, !isSelected);
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (id) => !!selected.get(id);
    const emptyRows =
        rowsPerPage -
        Math.min(rowsPerPage, cartItems.length - page * rowsPerPage);

    const sortedCartItems = cartItems.slice().sort((a, b) => {
        if (orderBy === "name") {
            return order === "asc"
                ? a.product.name.localeCompare(b.product.name)
                : b.product.name.localeCompare(a.product.name);
        } else if (orderBy === "quantity") {
            return order === "asc"
                ? a.quantity - b.quantity
                : b.quantity - a.quantity;
        } else if (orderBy === "price") {
            return order === "asc"
                ? a.product.price - b.product.price
                : b.product.price - a.product.price;
        } else if (orderBy === "total") {
            const totalA = a.product.price * a.quantity;
            const totalB = b.product.price * b.quantity;
            return order === "asc" ? totalA - totalB : totalB - totalA;
        }
        return 0;
    });

    const incrementQuantity = (id) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.product.id === id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    const decrementQuantity = (id) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.product.id === id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };

    //* Process Selected Cart Item
    const selectedProducts = cartItems?.filter((item) => {
        return selected.get(item.product.id) === true;
    });

    // console.log("selectedProducts", selectedProducts);

    let subTotal = 0;
    subTotal = selectedProducts?.reduce((sum, item) => {
        return sum + item.product.price * item.quantity;
    }, 0);

    return (
        <Container>
            <Row>
                {" "}
                <Col md={12} lg={12}>
                    <Card>
                        <CardBody>
                            <CardTitleWrap>
                                <CardTitle>Cart</CardTitle>
                            </CardTitleWrap>

                            <MatTableToolbar
                                numSelected={
                                    [...selected].filter((el) => el[1]).length
                                }
                                handleDeleteSelected={handleDeleteSelected}
                                onRequestSort={handleRequestSort}
                            />

                            <TableWrap>
                                <Table>
                                    <MatTableHead
                                        numSelected={
                                            [...selected].filter((el) => el[1])
                                                .length
                                        }
                                        order={order}
                                        orderBy={orderBy}
                                        onSelectAllClick={(event) =>
                                            handleSelectAllClick(
                                                event,
                                                event.target.checked
                                            )
                                        }
                                        onRequestSort={handleRequestSort}
                                        rowCount={cartItems.length}
                                    />
                                    <TableBody>
                                        {sortedCartItems
                                            .slice(
                                                page * rowsPerPage,
                                                page * rowsPerPage + rowsPerPage
                                            )
                                            .map((item, index) => {
                                                const isItemSelected =
                                                    isSelected(item.product.id);
                                                const calc =
                                                    item.product.price *
                                                    item.quantity;
                                                const totalPrice =
                                                    calc % 10 == 0
                                                        ? calc
                                                        : calc.toFixed(2);
                                                return (
                                                    <TableRow
                                                        key={item.product.id}
                                                        selected={
                                                            isItemSelected
                                                        }
                                                        onClick={() =>
                                                            handleClick(
                                                                item.product.id
                                                            )
                                                        }
                                                        style={{
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        <TableCell padding="checkbox">
                                                            <TableCheckbox
                                                                checked={
                                                                    isItemSelected
                                                                }
                                                                onChange={(
                                                                    event
                                                                ) => {
                                                                    event.stopPropagation();
                                                                    handleClick(
                                                                        item
                                                                            .product
                                                                            .id
                                                                    );
                                                                }}
                                                            />
                                                        </TableCell>

                                                        {/*//* No  */}
                                                        <TableCell>
                                                            {index +
                                                                1 +
                                                                page *
                                                                    rowsPerPage}
                                                        </TableCell>

                                                        {/*//* Image-Name  */}
                                                        <TableCell>
                                                            <div className="tw-flex tw-justify-start tw-items-center">
                                                                <CartPreviewImageWrap>
                                                                    <img
                                                                        src={
                                                                            item
                                                                                .product
                                                                                .image
                                                                        }
                                                                        alt={
                                                                            item
                                                                                .product
                                                                                .name
                                                                        }
                                                                    />
                                                                </CartPreviewImageWrap>
                                                                <span>
                                                                    {
                                                                        item
                                                                            .product
                                                                            .name
                                                                    }
                                                                </span>
                                                            </div>
                                                        </TableCell>

                                                        {/*//* Size  */}
                                                        <TableCell>
                                                            {item.size}
                                                        </TableCell>

                                                        {/*//* Price  */}
                                                        <TableCell>
                                                            {item.product.price.toLocaleString()}{" "}
                                                            VNĐ
                                                        </TableCell>

                                                        {/*//* Quantity  */}
                                                        <TableCell>
                                                            <QuantityControl>
                                                                <Button
                                                                    variant="primary"
                                                                    size="customQuantityLeft"
                                                                    style={{
                                                                        margin: "0px",
                                                                    }}
                                                                    onClick={(
                                                                        event
                                                                    ) => {
                                                                        event.stopPropagation();
                                                                        decrementQuantity(
                                                                            item
                                                                                .product
                                                                                .id
                                                                        );
                                                                    }}
                                                                >
                                                                    -
                                                                </Button>
                                                                <span>
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                </span>
                                                                <Button
                                                                    variant="primary"
                                                                    size="customQuantityRight"
                                                                    style={{
                                                                        margin: "0px",
                                                                    }}
                                                                    onClick={(
                                                                        event
                                                                    ) => {
                                                                        event.stopPropagation();
                                                                        incrementQuantity(
                                                                            item
                                                                                .product
                                                                                .id
                                                                        );
                                                                    }}
                                                                >
                                                                    +
                                                                </Button>
                                                            </QuantityControl>
                                                        </TableCell>

                                                        {/*//* Total  */}
                                                        <TableCell>
                                                            {totalPrice.toLocaleString()}{" "}
                                                            VNĐ
                                                        </TableCell>

                                                        {/*//* Button Remove  */}
                                                        <TableCell>
                                                            <Button
                                                                variant="danger"
                                                                size="sm"
                                                                style={{
                                                                    margin: "0px",
                                                                }}
                                                                onClick={(
                                                                    event
                                                                ) => {
                                                                    event.stopPropagation();
                                                                    handleRemoveItem(
                                                                        item
                                                                            .product
                                                                            .id
                                                                    );
                                                                }}
                                                            >
                                                                Remove
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                    </TableBody>
                                </Table>
                            </TableWrap>

                            <CartSubTotal>
                                Sub-total:{" "}
                                {subTotal
                                    ? `${subTotal.toLocaleString()} VNĐ`
                                    : `0 VNĐ`}
                            </CartSubTotal>
                            <CartPurchase
                                subTotal={subTotal}
                                selectedProducts={selectedProducts}
                                onSubmit
                            />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CartPage;

// region STYLES

const CartPreviewImageWrap = styled.span`
    width: 50px;
    height: 45px;
    border: 1px solid #f0f0f0;
    display: inline-block;
    overflow: hidden;
    text-align: center;
    padding: 5px;
    margin-right: 10px;

    img {
        height: 100%;
        width: 100%;
        object-fit: cover;
        max-width: 100%;
    }
`;

const QuantityControl = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
`;

const CartSubTotal = styled.h5`
    text-align: ${left};
    margin-top: 20px;
    font-weight: 700;
`;

// endregion
