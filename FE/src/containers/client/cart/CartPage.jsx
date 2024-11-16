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
import { toast } from "react-toastify";
import CartService from "../../../services/CartService";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { fetchUsers } from "../../../redux/actions/userAction";
import {
    colorAccent,
    colorBlue,
    colorAdditional,
    colorBackground,
    colorRedHover,
} from "@/utils/palette";
import {
    FormButtonToolbar,
    FormContainer,
    FormGroup,
    FormGroupField,
    FormGroupLabel,
} from "@/shared/components/form/FormElements";
import { Form } from "react-final-form";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import FormInput from "./../../../shared/components/custom/form/FormInput";

const CartPage = () => {
    const { t } = useTranslation(["common", "errors", "store"]);
    const dispatch = useDispatch();
    const history = useHistory();

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

    const handleRemoveItem = async (id, size) => {
        // setCartItems(cartItems.filter((item) => item.product.id !== id));

        const item = cartItems.find(
            (item) => item.product.id == id && item.size == size
        );
        console.log("item", item);
        const cartRequest = {
            products: [item.product.id],
            sizes: [item.size],
            quantities: [-999999],
        };

        try {
            let response = await CartService.putCart(
                currentUser.id,
                cartRequest
            );

            if (response) {
                dispatch(fetchUsers());
                toast.info(t("common:action.success", { type: "Delete" }), {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (e) {
            console.log(e);
            toast.error(t("common:action.fail", { type: "Delete" }), {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    // console.log("Selected", selected);
    const handleDeleteSelected = async () => {
        console.log("click delete selected");
        const selectedIds = [...selected]
            .filter(([, value]) => value)
            .map(([key]) => key);

        console.log("selectedIds", selectedIds);

        //* Của tôi
        const selectedCartItems = sortedCartItems.filter((cartItem) =>
            selectedIds.some((selectedId) => {
                const [id, size] = selectedId.split("-");
                return cartItem.product.id == id && cartItem.size == size;
            })
        );

        console.log("selectedIds", selectedIds);
        console.log("selectedCartItems", selectedCartItems);

        try {
            let response;

            //* Clean Cart
            if (selectedIds.length == sortedCartItems.length) {
                response = await CartService.cleanCart(currentUser.id);
            }
            //* Remove selected
            else {
                console.log("Remove selected");
                const promises = selectedCartItems.map((cartItem) => {
                    const cartRequest = {
                        products: [cartItem.product.id],
                        sizes: [cartItem.size],
                        quantities: [-999999],
                    };
                    console.log("cartRequest", cartRequest);
                    return CartService.putCart(currentUser.id, cartRequest);
                });

                response = await Promise.all(promises);
            }

            if (response) {
                dispatch(fetchUsers());
                toast.info(t("common:action.success", { type: "Delete" }), {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (e) {
            console.log(e);
            toast.error(t("common:action.fail", { type: "Delete" }), {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleSelectAllClick = (event, checked) => {
        if (checked) {
            const newSelected = new Map();
            cartItems.forEach((item) =>
                newSelected.set(`${item.product.id}-${item.size}`, true)
            );
            setSelected(newSelected);
            return;
        }
        setSelected(new Map([]));
    };

    const handleClick = (id, size) => {
        const key = `${id}-${size}`; // Tạo một khóa duy nhất từ id và size
        const newSelected = new Map(selected);
        const isSelected = newSelected.get(key);
        newSelected.set(key, !isSelected); // Cập nhật trạng thái chọn/bỏ chọn
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Doi ne
    const isSelected = (id, size) => !!selected.get(`${id}-${size}`);

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

    // console.log("CurrentUser", currentUser.cart);
    // console.log("sortedCartItems", sortedCartItems);
    // console.log("-----------");

    const incrementQuantity = async (id, size) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.product.id == id && item.size == size
                    ? { ...item, quantity: parseInt(item.quantity) + 1 }
                    : item
            )
        );

        const item = cartItems.find(
            (item) => item.product.id == id && item.size == size
        );
        // console.log("item", item);
        const cartRequest = {
            products: [item.product.id],
            sizes: [item.size],
            quantities: [1],
        };

        console.log("cartRequest", cartRequest);

        // console.log("cartRequest", cartRequest);
        try {
            let response = await CartService.putCart(
                currentUser.id,
                cartRequest
            );

            // console.log("response", response);

            if (response) {
                // dispatch(fetchOrders());
                // toast.info(t("common:action.success", { type: "Add" }), {
                //     position: "top-right",
                //     autoClose: 5000,
                //     hideProgressBar: false,
                //     closeOnClick: true,
                //     pauseOnHover: true,
                //     draggable: true,
                //     progress: undefined,
                // });
            }
        } catch (e) {
            console.log(e);
            toast.error(t("common:action.fail", { type: "Update" }), {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    const decrementQuantity = async (id, size) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.product.id == id && item.size == size && item.quantity > 1
                    ? { ...item, quantity: parseInt(item.quantity) - 1 }
                    : item
            )
        );

        const item = cartItems.find(
            (item) => item.product.id == id && item.size == size
        );
        // console.log("item", item);
        const cartRequest = {
            products: [item.product.id],
            sizes: [item.size],
            quantities: [-1],
        };
        console.log("cartRequest", cartRequest);

        try {
            let response = await CartService.putCart(
                currentUser.id,
                cartRequest
            );

            if (response) {
                // dispatch(fetchOrders());
                // toast.info(t("common:action.success", { type: "Add" }), {
                //     position: "top-right",
                //     autoClose: 5000,
                //     hideProgressBar: false,
                //     closeOnClick: true,
                //     pauseOnHover: true,
                //     draggable: true,
                //     progress: undefined,
                // });
            }
        } catch (e) {
            console.log(e);
            toast.error(t("common:action.fail", { type: "Update" }), {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    //* Process Selected Cart Item
    const selectedProducts = cartItems?.filter((item) => {
        return selected.get(`${item.product.id}-${item.size}`) === true;
    });

    // console.log("selectedProducts", selectedProducts);

    let subTotal = 0;
    subTotal = selectedProducts?.reduce((sum, item) => {
        return sum + item.product.price * item.quantity;
    }, 0);

    //* Update totalUser ở redux khi unmount. Để cập nhật quantity,
    //* vì đang render dựa theo useState, db đã thay đổi nhưng redux thì chưa đc update
    useEffect(() => {
        return () => {
            dispatch(fetchUsers());
        };
    }, []);

    //* Form
    // Submit
    const submitForm = (values) => {
        console.log("Submit form");
    };

    // Init
    const prepareInit = sortedCartItems.reduce((acc, item) => {
        const size = `${item.product.id}-size-${item.size}`;
        const quantity = `${item.product.id}-quantity-${item.size}`;
        acc[size] = item.size;
        acc[quantity] = item.quantity;
        return acc;
    }, {});
    const initForm = { ...prepareInit };

    // Validate
    const validate = (values, t) => {
        console.log("Validate values", values);
        const errors = {};

        //* Quantity
        sortedCartItems.map((item) => {
            const quantity = `${item.product.id}-quantity-${item.size}`;
            //* Empty
            if (!values[quantity]) {
                errors[quantity] = "Required";
            }

            //* Lớn hơn stock
            if (
                values[quantity] >
                item.product.sizeProducts.find(
                    (sizeProduct) => sizeProduct.size.name == item.size
                ).stock
            ) {
                errors[quantity] = "Exceeded";
            }

            //* Nhỏ hơn 1
            if (values[quantity] < 1) {
                errors[quantity] = "Không nhỏ hơn 1";
            }
        });

        console.log("Errors", errors);
        return errors;
    };

    const handleBlurQuantity = async (e, form) => {
        const { errors } = form.getState();
        const name = e.target.name;
        const [id, type, size] = name.split("-");
        const value = e.target.value;
        const item = sortedCartItems.find(
            (item) => item.product.id == id && item.size == size
        );

        if (!errors[name] && value != item.quantity) {
            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.product.id == id && item.size == size
                        ? { ...item, quantity: value }
                        : item
                )
            );

            const cartRequest = {
                products: [item.product.id],
                sizes: [item.size],
                quantities: [value - item.quantity],
            };

            console.log("cartRequest", cartRequest);

            // console.log("cartRequest", cartRequest);
            try {
                let response = await CartService.putCart(
                    currentUser.id,
                    cartRequest
                );

                if (response) {
                    // dispatch(fetchOrders());
                    // toast.info(t("common:action.success", { type: "Add" }), {
                    //     position: "top-right",
                    //     autoClose: 5000,
                    //     hideProgressBar: false,
                    //     closeOnClick: true,
                    //     pauseOnHover: true,
                    //     draggable: true,
                    //     progress: undefined,
                    // });
                }
            } catch (e) {
                console.log(e);
                toast.error(t("common:action.fail", { type: "Update" }), {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }
    };

    const handleBlurSize = (name, value) => {
        console.log("Mouse out or input lost focus:", name, value);
        // You can call validate here or perform other actions
    };

    console.log("---------------");

    return (
        <Container>
            <Row>
                <Form
                    onSubmit={submitForm}
                    validate={(values) => validate(values, t)}
                    initialValues={initForm}
                >
                    {({ handleSubmit, form }) => {
                        //* Handle việc select No/Name
                        return (
                            <FormContainer onSubmit={handleSubmit}>
                                <Col md={12} lg={12}>
                                    <Card
                                        style={{
                                            marginBottom: "0px",
                                            paddingBottom: "0px",
                                        }}
                                    >
                                        <CardBody>
                                            <CardTitleWrap>
                                                <CardTitle>Cart</CardTitle>
                                            </CardTitleWrap>

                                            <MatTableToolbar
                                                numSelected={
                                                    [...selected].filter(
                                                        (el) => el[1]
                                                    ).length
                                                }
                                                handleDeleteSelected={
                                                    handleDeleteSelected
                                                }
                                                onRequestSort={
                                                    handleRequestSort
                                                }
                                            />

                                            <TableWrap>
                                                <Table>
                                                    <MatTableHead
                                                        numSelected={
                                                            [
                                                                ...selected,
                                                            ].filter(
                                                                (el) => el[1]
                                                            ).length
                                                        }
                                                        order={order}
                                                        orderBy={orderBy}
                                                        onSelectAllClick={(
                                                            event
                                                        ) =>
                                                            handleSelectAllClick(
                                                                event,
                                                                event.target
                                                                    .checked
                                                            )
                                                        }
                                                        onRequestSort={
                                                            handleRequestSort
                                                        }
                                                        rowCount={
                                                            cartItems.length
                                                        }
                                                    />
                                                    <TableBody>
                                                        {sortedCartItems.map(
                                                            (item, index) => {
                                                                const isItemSelected =
                                                                    isSelected(
                                                                        item
                                                                            .product
                                                                            .id,
                                                                        item.size
                                                                    );

                                                                const size =
                                                                    item.size;
                                                                const calc =
                                                                    item.product
                                                                        .price *
                                                                    item.quantity;
                                                                const totalPrice =
                                                                    calc % 10 ==
                                                                    0
                                                                        ? calc
                                                                        : calc.toFixed(
                                                                              2
                                                                          );
                                                                return (
                                                                    <TableRow
                                                                        key={`${item.product.id}-${item.size}`}
                                                                        selected={
                                                                            isItemSelected
                                                                        }
                                                                        onClick={() =>
                                                                            handleClick(
                                                                                item
                                                                                    .product
                                                                                    .id,
                                                                                item.size
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
                                                                                            .id,
                                                                                        item.size
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
                                                                        <TableCell
                                                                            onClick={(
                                                                                e
                                                                            ) => {
                                                                                e.stopPropagation();

                                                                                window.open(
                                                                                    `/pages/client/product-detail/${item.product.id}`,
                                                                                    "_blank"
                                                                                );
                                                                            }}
                                                                        >
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
                                                                                <span className="name">
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
                                                                            <FormInput
                                                                                style={{
                                                                                    marginBottom:
                                                                                        "13px",
                                                                                    width: "40px",
                                                                                }}
                                                                                data={{
                                                                                    name: `${item.product.id}-size-${item.size}`,
                                                                                    type: "expandSelect",
                                                                                    myOnBlur:
                                                                                        handleBlurSize,
                                                                                    options:
                                                                                        item.product.sizeProducts.map(
                                                                                            (
                                                                                                item
                                                                                            ) => ({
                                                                                                value: item
                                                                                                    .size
                                                                                                    .name,
                                                                                                label: item
                                                                                                    .size
                                                                                                    .name,
                                                                                                render: [
                                                                                                    item
                                                                                                        .size
                                                                                                        .name,
                                                                                                    item.stock,
                                                                                                ],
                                                                                                isDisabled:
                                                                                                    item.stock ===
                                                                                                    0,
                                                                                            })
                                                                                        ),
                                                                                    menuList:
                                                                                        [
                                                                                            t(
                                                                                                "store:size.title"
                                                                                            ),
                                                                                            t(
                                                                                                "store:product.stock"
                                                                                            ),
                                                                                        ],
                                                                                }}
                                                                            ></FormInput>
                                                                        </TableCell>

                                                                        {/*//* Price  */}
                                                                        <TableCell>
                                                                            {item.product.price.toLocaleString()}{" "}
                                                                            VNĐ
                                                                        </TableCell>

                                                                        {/*//* Quantity  */}
                                                                        <TableCell
                                                                            onClick={(
                                                                                e
                                                                            ) => {
                                                                                e.stopPropagation();
                                                                            }}
                                                                        >
                                                                            <QuantityControl>
                                                                                {/*//* Desc btn  */}
                                                                                <Button
                                                                                    variant={
                                                                                        item.quantity <=
                                                                                        1
                                                                                            ? "secondary"
                                                                                            : "primary"
                                                                                    }
                                                                                    size="customQuantityLeft"
                                                                                    style={{
                                                                                        margin: "0px",
                                                                                    }}
                                                                                    onClick={(
                                                                                        event
                                                                                    ) => {
                                                                                        event.stopPropagation();

                                                                                        if (
                                                                                            item.quantity <=
                                                                                            1
                                                                                        )
                                                                                            return;

                                                                                        console.log(
                                                                                            "Add quantity Item",
                                                                                            item
                                                                                        );
                                                                                        decrementQuantity(
                                                                                            item
                                                                                                .product
                                                                                                .id,
                                                                                            size
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    -
                                                                                </Button>

                                                                                {/*//*  Input */}
                                                                                <FormInput
                                                                                    data={{
                                                                                        name: `${item.product.id}-quantity-${item.size}`,
                                                                                        type: "text",
                                                                                        myOnBlur:
                                                                                            (
                                                                                                e
                                                                                            ) =>
                                                                                                handleBlurQuantity(
                                                                                                    e,
                                                                                                    form
                                                                                                ),
                                                                                    }}
                                                                                    style={{
                                                                                        //6px
                                                                                        marginBottom:
                                                                                            "6px",
                                                                                        width: "60px",
                                                                                    }}
                                                                                ></FormInput>

                                                                                {/*//* Incr btn  */}
                                                                                <Button
                                                                                    variant={
                                                                                        item.quantity >=
                                                                                        item.product.sizeProducts.find(
                                                                                            (
                                                                                                sizeProduct
                                                                                            ) =>
                                                                                                sizeProduct
                                                                                                    .size
                                                                                                    .name ==
                                                                                                item.size
                                                                                        )
                                                                                            .stock
                                                                                            ? "secondary"
                                                                                            : "primary"
                                                                                    }
                                                                                    size="customQuantityRight"
                                                                                    style={{
                                                                                        margin: "0px",
                                                                                    }}
                                                                                    onClick={(
                                                                                        event
                                                                                    ) => {
                                                                                        event.stopPropagation();

                                                                                        if (
                                                                                            item.quantity >=
                                                                                            item.product.sizeProducts.find(
                                                                                                (
                                                                                                    sizeProduct
                                                                                                ) =>
                                                                                                    sizeProduct
                                                                                                        .size
                                                                                                        .name ==
                                                                                                    size
                                                                                            )
                                                                                                .stock
                                                                                        )
                                                                                            return;
                                                                                        console.log(
                                                                                            "Add quantity Item",
                                                                                            item
                                                                                        );
                                                                                        incrementQuantity(
                                                                                            item
                                                                                                .product
                                                                                                .id,
                                                                                            size
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
                                                                                            .id,
                                                                                        item.size
                                                                                    );
                                                                                }}
                                                                            >
                                                                                Remove
                                                                            </Button>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                );
                                                            }
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </TableWrap>

                                            <CartSubTotal>
                                                Sub-total:{" "}
                                                {subTotal
                                                    ? `${subTotal.toLocaleString()} VNĐ`
                                                    : `0 VNĐ`}
                                            </CartSubTotal>
                                            {/* <CartPurchase
                                                subTotal={subTotal}
                                                selectedProducts={
                                                    selectedProducts
                                                }
                                                onSubmit
                                            /> */}
                                        </CardBody>

                                        <FormButtonToolbar>
                                            <Button
                                                type="submit"
                                                variant="primary"
                                            >
                                                {t("action.addToCart")}
                                            </Button>
                                        </FormButtonToolbar>
                                    </Card>
                                </Col>
                            </FormContainer>
                        );
                    }}
                </Form>
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
