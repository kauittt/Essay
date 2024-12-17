import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import "@brainhubeu/react-carousel/lib/style.css";
import {
    colorAccent,
    colorAdditional,
    colorAdditionalHover,
    colorBackground,
} from "@/utils/palette";
import { marginRight, left } from "@/utils/directions";
import ProductItems from "./ProductItems";
import { BorderedBottomTabs } from "../../../shared/components/Tabs";
import { PanelTabs } from "./styled";
import { Nav, Tab } from "react-bootstrap";
import { NavItem, NavLink, TabsWrap } from "@/shared/components/Tabs";
import ReactTablePagination from "../../../shared/components/table/components/ReactTablePagination";
import { useTranslation } from "react-i18next";
import CustomReactTableFilter from "../../../shared/components/custom/table/CustomReactTableFilter";
import Collapse from "../../../shared/components/Collapse";
import Slider from "../../../shared/components/range_slider/Slider";
import { FaStar } from "react-icons/fa";
import FormInput from "@/shared/components/custom/form/FormInput";
import {
    FormContainer,
    FormButtonToolbar,
} from "@/shared/components/form/FormElements";
import { Col, Container, Row } from "react-bootstrap";
import { Button } from "@/shared/components/Button";
import { Form } from "react-final-form";
import { Card, CardBody } from "@/shared/components/Card";
import { colorGray } from "../../../utils/palette";
import { useSelector } from "react-redux";
import { selectProducts } from "@/redux/reducers/productSlice";
import { selectCategories } from "@/redux/reducers/categorySlice";
import { borderRadius, shadow } from "@/utils/styles";
import StarRating from "../StarRating";
import BasicCarousel from "./BasicCarousel";
import { selectBanners } from "../../../redux/reducers/bannerSlice";
import {
    useHistory,
    useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import OrderService from "../../../services/OrderService";
import InvoiceService from "../../../services/InvoiceService";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateVoucher } from "../../../redux/actions/voucherAction";
import { fetchProducts } from "../../../redux/actions/productAction";

const HomePage = () => {
    const location = useLocation();
    const history = useHistory();
    const dispatch = useDispatch();
    const products = useSelector(selectProducts) || [];
    const categories = useSelector(selectCategories) || [];

    const { t, i18n } = useTranslation(["common", "errors", "store"]);
    let language = i18n.language;
    const [pageSize, setPageSize] = useState(8); //! Size
    const [currentPage, setCurrentPage] = useState(0);

    ///! Handle thanh toán re-direct
    useEffect(() => {
        // console.log("Thanh toán re-direct");
        const queryParams = new URLSearchParams(location.search);

        // Kiểm tra nếu VNPay trả về kết quả
        if (queryParams.has("vnp_ResponseCode")) {
            const responseCode = queryParams.get("vnp_ResponseCode");

            if (responseCode === "00") {
                // Thanh toán thành công
                handleVNPaySuccess();
            } else {
                // Thanh toán thất bại
                toast.error("Thanh toán không thành công!");
                // history.push("/pages/client/invoice");
            }
        }
    }, [location, history]);

    const handleVNPaySuccess = async () => {
        const orderRequest = JSON.parse(localStorage.getItem("orderRequest"));
        let invoiceRequest = JSON.parse(localStorage.getItem("invoiceRequest"));
        let selectedVoucher = JSON.parse(
            localStorage.getItem("selectedVoucher")
        );

        try {
            let response = null;
            // Gọi API tạo đơn hàng
            const order = await OrderService.postOrder(orderRequest);

            // Gọi API tạo hóa đơn
            invoiceRequest = { ...invoiceRequest, order: order.data.id };

            response = await InvoiceService.postInvoice(invoiceRequest);

            // Xóa dữ liệu tạm thời
            localStorage.removeItem("orderRequest");
            localStorage.removeItem("invoiceRequest");
            localStorage.removeItem("selectedVoucher");
            if (response) {
                toast.info(
                    t("common:action.success", {
                        type: t("action.purchase"),
                    }),
                    {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    }
                );

                dispatch(fetchProducts());
                if (selectedVoucher) {
                    const requestVoucher = {
                        quantity: selectedVoucher.quantity - 1,
                    };

                    dispatch(updateVoucher(selectedVoucher.id, requestVoucher));
                }
                history.push("/pages/client/home");
            }
            // history.push("/pages/client/orders");
        } catch (e) {
            console.error(e);
            toast.error(
                t("common:action.fail", {
                    type: t("action.purchase"),
                }),
                {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                }
            );
        }
    };

    //! -------

    const tags = categories?.map((category) => {
        return {
            tag: category.name,
            title: language == "en" ? category.enName : category.name,
        };
    });
    // console.log("products", products);

    //* Tag
    const [currentTag, setCurrentTag] = useState("all");

    //* Search
    const [searchQuery, setSearchQuery] = useState("");

    //* Min price
    const arrayPrice = [
        [null, null],
        [0, 200000],
        [200000, 300000],
        [300000, 500000],
        [500000, null],
    ];

    const [selectedPrice, setSelectedPrice] = useState(0);
    const handleSelectedPrice = (value) => {
        // console.log("selectedPrice selected:", value);
        setSelectedPrice(value);
    };
    // console.log("selected price", selectedPrice);
    const selectedPriceInput = {
        label: t("store:filter.priceRange"),
        name: "price",
        type: "select",
        options: [
            {
                value: 0,
                label: t("store:filter.all"),
            },
            {
                value: 1,
                label: t("store:filter.priceToPrice", {
                    a: 0,
                    b: (200000).toLocaleString() + " VNĐ",
                }),
            },
            {
                value: 2,
                label: t("store:filter.priceToPrice", {
                    a: (200000).toLocaleString() + " VNĐ",
                    b: (300000).toLocaleString() + " VNĐ",
                }),
            },
            {
                value: 3,
                label: t("store:filter.priceToPrice", {
                    a: (300000).toLocaleString() + " VNĐ",
                    b: (500000).toLocaleString() + " VNĐ",
                }),
            },
            {
                value: 4,
                label: t("store:filter.moreThan", {
                    a: (500000).toLocaleString() + " VNĐ",
                }),
            },
        ],
        myOnChange: handleSelectedPrice,
    };

    //* Star
    const [selectedStar, setSelectedStar] = useState(0);
    const handleStarSelect = (value) => {
        // console.log("Star selected:", value);
        setSelectedStar(value);
    };
    const starInput = {
        label: t("store:filter.rating"),
        name: "star",
        type: "select",
        options: Array.from({ length: 6 }, (_, i) => ({
            value: i,
            label: <StarRating rating={i} />,
        })),
        myOnChange: handleStarSelect,
    };

    // Lọc sản phẩm dựa trên tag hiện tại
    const filteredByTag = useMemo(() => {
        if (currentTag === "all") return products;
        return products.filter((p) =>
            p.categories.some((category) => category === currentTag)
        );
    }, [currentTag, products]);

    // console.log("filteredByTag", filteredByTag);

    // Lọc sản phẩm dựa trên search query
    const filteredBySearch = useMemo(() => {
        if (!searchQuery) return filteredByTag;
        const query = searchQuery.toLowerCase();
        return filteredByTag.filter(
            (p) =>
                p.name?.toLowerCase().includes(query) ||
                p.enName?.toLowerCase().includes(query) ||
                p.description?.toLowerCase().includes(query) ||
                p.enDescription?.toLowerCase().includes(query)
        );
    }, [searchQuery, filteredByTag]);

    // console.log("filteredBySearch", filteredBySearch);

    const filteredByStar = useMemo(() => {
        return filteredBySearch.filter((p) => p.star >= selectedStar);
    }, [filteredBySearch, selectedStar]);

    // console.log("filteredByStar", filteredByStar);

    const filteredByPrice = useMemo(() => {
        const price = arrayPrice[selectedPrice];

        let finalProducts = filteredByStar;
        // console.log("Start", finalProducts);
        if (price[0]) {
            finalProducts = filteredByStar.filter((p) => p.price >= price[0]);
        }
        if (price[1]) {
            finalProducts = finalProducts.filter((p) => p.price <= price[1]);
        }

        // console.log("Filtered", finalProducts);
        return finalProducts;
    }, [filteredByStar, selectedPrice]);

    // console.log("filteredByPrice", filteredByPrice);
    // console.log("---------------------");

    //* use
    const currentProducts = useMemo(() => {
        return filteredByPrice.slice(
            currentPage * pageSize,
            (currentPage + 1) * pageSize
        );
    }, [filteredByPrice, currentPage, pageSize]);

    const totalPages = useMemo(() => {
        return Math.ceil(filteredByPrice.length / pageSize);
    }, [filteredByPrice.length, pageSize]);

    // Reset trang khi thay đổi search query
    useEffect(() => {
        setCurrentPage(0);
    }, [searchQuery]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const onFilter = (tag) => {
        setCurrentTag(tag);
        setCurrentPage(0); // Reset về trang đầu khi thay đổi tag
    };

    // Xác định các hàm điều hướng trang
    const canPreviousPage = currentPage > 0;
    const canNextPage = currentPage < totalPages - 1;

    const gotoPage = (page) => {
        setCurrentPage(page);
    };

    const previousPage = () => {
        if (canPreviousPage) {
            setCurrentPage(currentPage - 1);
        }
    };

    const nextPage = () => {
        if (canNextPage) {
            setCurrentPage(currentPage + 1);
        }
    };

    const pageOptions = useMemo(() => {
        return Array.from({ length: totalPages }, (_, i) => i);
    }, [totalPages]);

    // console.log("rating", selectedStar);

    //* Bổ sung thêm banners khi thiếu
    const [minBanners, setMinBanners] = useState(3);

    let banners = useSelector(selectBanners);
    banners = banners?.map((banner) => ({
        ...banner,
        src: banner.path,
    }));

    const updateMinBanners = () => {
        const width = window.innerWidth;
        if (width < 768) {
            setMinBanners(1);
        } else if (width < 992) {
            setMinBanners(2);
        } else if (width < 1200) {
            setMinBanners(3);
        } else {
            setMinBanners(4);
        }
    };

    useEffect(() => {
        updateMinBanners(); // Cập nhật minBanners khi trang được tải lần đầu

        // Lắng nghe sự thay đổi kích thước cửa sổ
        window.addEventListener("resize", updateMinBanners);

        // Cleanup khi component bị tháo rời
        return () => window.removeEventListener("resize", updateMinBanners);
    }, []);

    if (banners?.length < minBanners) {
        const additionalBanners = Array.from(
            { length: minBanners - banners.length },
            (_, index) => ({
                id: `default-${index + banners.length}`,
                src: "/img/logo/Logo.jpg", // Đường dẫn mặc định nếu thiếu banner
            })
        );
        banners = [...banners, ...additionalBanners];
    }
    //* ----------------------------------
    return (
        <Col md={12} lg={12}>
            {/*//* Banners  */}
            <Card>
                <MyCardBody>
                    <Row>
                        <BasicCarousel data={banners}></BasicCarousel>
                    </Row>
                </MyCardBody>
            </Card>

            {/*//* Category + List products  */}
            <Card>
                <MyCardBody>
                    <ClientProductPageWrap>
                        <ClientProductPageButtons>
                            {/*//* Category  */}
                            <BorderedBottomTabs>
                                <PanelTabs>
                                    <Tab.Container activeKey={currentTag}>
                                        <TabsWrap>
                                            <Nav className="nav-tabs">
                                                <NavItem key="0">
                                                    <NavLink
                                                        eventKey="all"
                                                        type="button"
                                                        active={
                                                            currentTag === "all"
                                                        }
                                                        onClick={() =>
                                                            onFilter("all")
                                                        }
                                                        className="tw-text-2xl"
                                                    >
                                                        {t("store:filter.all")}
                                                    </NavLink>
                                                </NavItem>
                                                {tags?.map((btn, index) => (
                                                    <NavItem key={index + 1}>
                                                        <NavLink
                                                            eventKey={btn.tag}
                                                            className="tw-text-2xl"
                                                            key={`index_${btn.tag}`}
                                                            type="button"
                                                            active={
                                                                btn.tag ===
                                                                currentTag
                                                            }
                                                            onClick={() =>
                                                                onFilter(
                                                                    btn.tag
                                                                )
                                                            }
                                                        >
                                                            {btn.title}
                                                        </NavLink>
                                                    </NavItem>
                                                ))}
                                            </Nav>
                                        </TabsWrap>
                                    </Tab.Container>
                                </PanelTabs>
                            </BorderedBottomTabs>

                            {/*//* Filter  */}
                            <Collapse
                                title={t("store:filter.title")}
                                className="with-shadow"
                            >
                                <div className="tw-flex tw-justify-between tw-items-center tw-gap-[50px]">
                                    {/*//* Search  */}
                                    <div style={{ flex: 2 }}>
                                        <CustomReactTableFilter
                                            style={{
                                                marginBottom: "5px",
                                            }}
                                            customWidth={{
                                                maxWidth: "90%",
                                            }}
                                            rows={filteredByPrice}
                                            setGlobalFilter={setSearchQuery}
                                            setFilterValue={setSearchQuery}
                                            placeholder={`${t(
                                                "tables.customizer.search.search"
                                            )} ${t(
                                                "store:product.titles"
                                            ).toLowerCase()} ...`}
                                            dataLength={filteredByTag.length}
                                        />
                                    </div>

                                    {/*//* Rating  */}
                                    <div style={{ flex: 1 }}>
                                        <Form
                                            onSubmit={() => {
                                                // console.log("Submit");
                                            }}
                                            initialValues={{
                                                star: selectedStar,
                                            }}
                                        >
                                            {({ handleSubmit, form }) => {
                                                //* Handle việc select No/Name
                                                return (
                                                    <FormContainer
                                                        onSubmit={handleSubmit}
                                                    >
                                                        <Col md={12} lg={12}>
                                                            <Card
                                                                style={{
                                                                    marginBottom:
                                                                        "0px",
                                                                    paddingBottom:
                                                                        "0px",
                                                                }}
                                                            >
                                                                <CardBody>
                                                                    <FormInput
                                                                        data={
                                                                            starInput
                                                                        }
                                                                    ></FormInput>
                                                                </CardBody>
                                                            </Card>
                                                        </Col>
                                                    </FormContainer>
                                                );
                                            }}
                                        </Form>
                                    </div>

                                    {/*//* Price  */}
                                    <div style={{ flex: 1 }}>
                                        <Form
                                            onSubmit={() => {
                                                // console.log("Submit");
                                            }}
                                            initialValues={{
                                                price: selectedPrice,
                                            }}
                                        >
                                            {({ handleSubmit, form }) => {
                                                //* Handle việc select No/Name
                                                return (
                                                    <FormContainer
                                                        onSubmit={handleSubmit}
                                                    >
                                                        <Col md={12} lg={12}>
                                                            <Card
                                                                style={{
                                                                    marginBottom:
                                                                        "0px",
                                                                    paddingBottom:
                                                                        "0px",
                                                                }}
                                                            >
                                                                <CardBody>
                                                                    <FormInput
                                                                        data={
                                                                            selectedPriceInput
                                                                        }
                                                                    ></FormInput>
                                                                </CardBody>
                                                            </Card>
                                                        </Col>
                                                    </FormContainer>
                                                );
                                            }}
                                        </Form>
                                    </div>
                                </div>
                            </Collapse>
                        </ClientProductPageButtons>

                        {/*//* List products  */}
                        <ProductItems items={currentProducts} />

                        {filteredByPrice.length > 0 && (
                            <PaginationWrap>
                                <ReactTablePagination
                                    dataLength={filteredByPrice.length} // Total products after all filters
                                    page={currentProducts}
                                    gotoPage={gotoPage}
                                    canPreviousPage={canPreviousPage}
                                    canNextPage={canNextPage}
                                    pageOptions={pageOptions}
                                    pageSize={pageSize}
                                    pageIndex={currentPage}
                                    previousPage={previousPage}
                                    nextPage={nextPage}
                                    setPageSize={setPageSize}
                                    manualPageSize={[8, 16, 24, 32]}
                                />
                            </PaginationWrap>
                        )}
                    </ClientProductPageWrap>
                </MyCardBody>
            </Card>
        </Col>
    );
};

HomePage.propTypes = {};

export default HomePage;

// Styled Components

const MyCardBody = styled(Card.Body)`
    height: 100%;
    /* background-color: ${colorBackground}; */
    /* border-radius: ${borderRadius}; */ //!
    border-radius: 5px;
    box-shadow: ${shadow};
    padding: 0 12px;
    padding-left: 15px;
`;

const ClientProductPageWrap = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;

    img {
        width: 100%;
    }
`;

const ClientProductPageButtons = styled.div`
    width: 100%;
    margin-bottom: 20px;
    text-align: ${left};

    padding: 10px 10px;
    border-radius: 5px;
    background-color: ${colorBackground};
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const PaginationWrap = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    padding: 10px 10px;
    border-radius: 5px;
    background-color: ${colorBackground};
`;
