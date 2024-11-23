import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styled from "styled-components";
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
import { Link } from "react-router-dom";
import {
    FormButtonToolbar,
    FormContainer,
} from "@/shared/components/form/FormElements";
import { Form } from "react-final-form";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import FormInput from "./../../../shared/components/custom/form/FormInput";
import { TableContainer, Paper } from "@mui/material";
import { colorBackground, colorBorder } from "@/utils/palette";

const CartPage = () => {
    const { t, i18n } = useTranslation(["common", "errors", "store"]);
    let language = i18n.language;
    const dispatch = useDispatch();
    const history = useHistory();
    const shippingFee = 30000;

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

    const sizeOrder = { S: 1, L: 2, XL: 3 };
    // const handleRequestSort = (event, property) => {
    //     const isAsc = orderBy === property && order === "asc";
    //     setOrder(isAsc ? "desc" : "asc");
    //     setOrderBy(property);
    // };
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";

        const sortedItems = cartItems.slice().sort((a, b) => {
            if (property === "size") {
                // So sánh dựa trên mapping thứ tự size
                return isAsc
                    ? sizeOrder[a.size] - sizeOrder[b.size]
                    : sizeOrder[b.size] - sizeOrder[a.size];
            }

            // Các trường khác (name, quantity, price...)
            return isAsc
                ? a[property] > b[property]
                    ? 1
                    : -1
                : a[property] < b[property]
                ? 1
                : -1;
        });

        setCartItems(sortedItems); // Cập nhật dữ liệu
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

    // Doi ne
    const isSelected = (id, size) => !!selected.get(`${id}-${size}`);

    const emptyRows =
        rowsPerPage -
        Math.min(rowsPerPage, cartItems.length - page * rowsPerPage);

    const sortedCartItems = cartItems.slice().sort((a, b) => {
        // Sắp xếp theo Name
        if (orderBy === "name") {
            const nameComparison = a.product.name.localeCompare(b.product.name);
            if (nameComparison !== 0) {
                return order === "asc" ? nameComparison : -nameComparison;
            }
        }

        // Sắp xếp theo Quantity
        if (orderBy === "quantity") {
            const quantityComparison = a.quantity - b.quantity;
            if (quantityComparison !== 0) {
                return order === "asc"
                    ? quantityComparison
                    : -quantityComparison;
            }
        }

        // Sắp xếp theo Price
        if (orderBy === "price") {
            const priceComparison = a.product.price - b.product.price;
            if (priceComparison !== 0) {
                return order === "asc" ? priceComparison : -priceComparison;
            }
        }

        // Sắp xếp theo Total
        if (orderBy === "total") {
            const totalA = a.product.price * a.quantity;
            const totalB = b.product.price * b.quantity;
            const totalComparison = totalA - totalB;
            if (totalComparison !== 0) {
                return order === "asc" ? totalComparison : -totalComparison;
            }
        }

        if (orderBy === "size") {
            const sizeComparison = sizeOrder[a.size] - sizeOrder[b.size];
            return order === "asc" ? sizeComparison : -sizeComparison;
        }

        // Nếu tất cả các giá trị trên giống nhau, sắp xếp theo Size
        const sizeComparison = sizeOrder[a.size] - sizeOrder[b.size];
        return sizeComparison;
    });

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

    //! Form ----------------------------------------------------------------
    //* Submit
    const submitForm = (values) => {
        console.log("Submit form");

        history.push({
            pathname: "/pages/client/invoice",
            state: {
                selectedProducts: selectedProducts,
                subTotal: subTotal,
                shippingFee: shippingFee,
            },
        });
    };

    //* Init
    const prepareInit = sortedCartItems.reduce((acc, item) => {
        const size = `${item.product.id}-size-${item.size}`;
        const quantity = `${item.product.id}-quantity-${item.size}`;
        acc[size] = item.size;
        acc[quantity] = item.quantity;
        return acc;
    }, {});
    const initForm = { ...prepareInit, delivery: "ghn" };

    //* Validate
    const validate = (values, t) => {
        // console.log("Validate values", values);
        // console.log("Validate");
        const errors = {};

        //* Quantity
        sortedCartItems.map((item) => {
            const quantity = `${item.product.id}-quantity-${item.size}`;
            //* Empty
            if (!values[quantity]) {
                errors[quantity] = t("errors:validation.required");
            }

            //* Lớn hơn stock
            if (
                values[quantity] >
                item.product.sizeProducts.find(
                    (sizeProduct) => sizeProduct.size.name == item.size
                ).stock
            ) {
                errors[quantity] = t("errors:validation.exceeded");
            }

            //* Nhỏ hơn 1
            if (values[quantity] < 1) {
                errors[quantity] = t("errors:validation.greaterThan", {
                    quantity: 1,
                });
            }
        });

        // console.log("Errors", errors);
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

    const handleBlurSize = async (name, newSize) => {
        const [id, type, size] = name.split("-");

        console.log("Blur size", name);
        // console.log("Old size", size);
        // console.log("New size", newSize);

        if (size == newSize) return;

        const isContain = sortedCartItems.some(
            (item) => item.size == newSize && item.product.id == id
        );
        console.log("isContain", isContain);

        try {
            const item = sortedCartItems.find(
                (item) => item.product.id == id && item.size == size
            );
            let response = null;

            //* Remove first
            const cartRequest = {
                products: [item.product.id],
                sizes: [item.size],
                quantities: [-99999],
            };

            response = await CartService.putCart(currentUser.id, cartRequest);
            console.log("Response", response);

            if (!isContain) {
                const cartRequest = {
                    products: [item.product.id],
                    sizes: [newSize],
                    quantities: [item.quantity],
                };

                await CartService.putCart(currentUser.id, cartRequest);
            }

            if (response) {
                dispatch(fetchUsers());
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

    // console.log("sortedCartItems");
    // console.log(sortedCartItems);
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
                                <Col lg={10} md={12} sm={12}>
                                    <Card
                                        style={{
                                            marginBottom: "0px",
                                            paddingBottom: "0px",
                                        }}
                                    >
                                        <CardBody>
                                            <CardTitleWrap>
                                                <CardTitle>
                                                    {t("store:cart.title")}
                                                </CardTitle>
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

                                            <CustomTableContainer
                                                component={CustomPaper}
                                                style={{ maxHeight: 525 }}
                                            >
                                                <Table stickyHeader>
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
                                                    <StyledTableBody className="tw-background-red">
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
                                                                    <StyledTableRow
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
                                                                        <StyledTableCell padding="checkbox">
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
                                                                        </StyledTableCell>

                                                                        {/*//* No  */}
                                                                        <StyledTableCell>
                                                                            {index +
                                                                                1 +
                                                                                page *
                                                                                    rowsPerPage}
                                                                        </StyledTableCell>

                                                                        {/*//* Image-Name  */}
                                                                        <StyledTableCell>
                                                                            <div
                                                                                className="tw-flex tw-justify-start tw-items-center"
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
                                                                                    {language ==
                                                                                    "en"
                                                                                        ? item
                                                                                              .product
                                                                                              .enName
                                                                                        : item
                                                                                              .product
                                                                                              .name}
                                                                                </span>
                                                                            </div>
                                                                        </StyledTableCell>

                                                                        {/*//* Size  */}
                                                                        <StyledTableCell>
                                                                            <FormInput
                                                                                style={{
                                                                                    marginBottom:
                                                                                        "13px",
                                                                                    width: "37px",
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
                                                                        </StyledTableCell>

                                                                        {/*//* Price  */}
                                                                        <StyledTableCell>
                                                                            {item.product.price.toLocaleString()}{" "}
                                                                            VNĐ
                                                                        </StyledTableCell>

                                                                        {/*//* Quantity  */}
                                                                        <StyledTableCell
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
                                                                                        width: "90px",
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
                                                                        </StyledTableCell>

                                                                        {/*//* Total  */}
                                                                        <StyledTableCell>
                                                                            {totalPrice.toLocaleString()}{" "}
                                                                            VNĐ
                                                                        </StyledTableCell>

                                                                        {/*//* Button Remove  */}
                                                                        <StyledTableCell>
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
                                                                                {t(
                                                                                    "action.delete"
                                                                                )}
                                                                            </Button>
                                                                        </StyledTableCell>
                                                                    </StyledTableRow>
                                                                );
                                                            }
                                                        )}
                                                    </StyledTableBody>
                                                </Table>
                                            </CustomTableContainer>
                                        </CardBody>
                                    </Card>
                                </Col>

                                <Col lg={2} md={12} sm={12}>
                                    <Card
                                        style={{
                                            marginBottom: "0px",
                                            paddingBottom: "0px",
                                        }}
                                    >
                                        <CardBody>
                                            <CartSubTotal>
                                                {t("store:cart.subTotal")}:{" "}
                                                {subTotal
                                                    ? `${subTotal.toLocaleString()} VNĐ`
                                                    : `0 VNĐ`}
                                            </CartSubTotal>
                                            <CartPurchase
                                                subTotal={subTotal}
                                                shippingFee={shippingFee}
                                            />
                                            <FormButtonToolbar>
                                                <Button
                                                    type="submit"
                                                    variant="primary"
                                                    disabled={
                                                        selectedProducts.length ===
                                                        0
                                                    }
                                                    onClick={() => {
                                                        console.log(
                                                            "Form is being submitted"
                                                        );
                                                        // Lấy state của form để xem errors
                                                        const errors =
                                                            form.getState()
                                                                .errors;
                                                        console.log(
                                                            "Current form errors:",
                                                            errors
                                                        );

                                                        const isExceeded =
                                                            Object.values(
                                                                errors
                                                            ).some(
                                                                (error) =>
                                                                    error ===
                                                                    "Exceeded"
                                                            );

                                                        console.log(
                                                            "isExceeded",
                                                            isExceeded
                                                        );
                                                        if (isExceeded) {
                                                            toast.warn(
                                                                t(
                                                                    "errors:validation.exceeded"
                                                                ),
                                                                {
                                                                    position:
                                                                        "top-right",
                                                                    autoClose: 5000,
                                                                    hideProgressBar: false,
                                                                    closeOnClick: true,
                                                                    pauseOnHover: true,
                                                                    draggable: true,
                                                                    progress:
                                                                        undefined,
                                                                }
                                                            );
                                                        }
                                                    }}
                                                >
                                                    {t("action.purchase")}
                                                </Button>
                                            </FormButtonToolbar>
                                        </CardBody>
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

export const CustomTableContainer = styled(TableContainer)`
    && {
        /* box-shadow: none;  */
    }
`;

export const CustomPaper = styled(Paper)`
    && {
        /* box-shadow: none; */
        box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;
        /* box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
            rgba(27, 31, 35, 0.15) 0px 0px 0px 1px; */
    }
`;

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

const StyledTableBody = styled(TableBody)`
    background-color: ${colorBackground};
`;

const StyledTableRow = styled(TableRow)`
    && {
        border-bottom: 1px solid
            ${({ theme }) => (theme.mode === "light" ? "#e0e0e0" : "#424242")};

        &:last-child {
            border-bottom: none; /* Xóa đường kẻ của dòng cuối nếu không cần */
        }

        .MuiTableCell-root {
            padding: 12px;
        }
    }
`;

const StyledTableCell = styled(TableCell)`
    && {
        border-bottom: 1px solid
            ${({ theme }) => (theme.mode === "light" ? "#d6d6d6" : "#333")};
    }
`;

// endregion
