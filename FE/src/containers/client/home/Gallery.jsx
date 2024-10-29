import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
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
import ReactTablePagination from "./../../../shared/components/table/components/ReactTablePagination";
import { useTranslation } from "react-i18next";
import CustomReactTableFilter from "./../../../shared/components/custom/table/CustomReactTableFilter";
import Collapse from "./../../../shared/components/Collapse";
import Slider from "./../../../shared/components/range_slider/Slider";
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
import { colorGray } from "./../../../utils/palette";

const StarRating = ({ rating }) => {
    const MAX_STARS = 5;

    // Function to get the fill style for each star
    const getStarFill = (index) => {
        if (rating >= index + 1) {
            // Fully yellow star
            return "#f6da6e";
        } else if (index < rating && rating < index + 1) {
            // Half yellow star using gradient
            const percentage = (rating - index) * 100;
            return (
                <svg width="1em" height="1em">
                    <linearGradient
                        id={`yellow-gray-gradient-${index}`}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                    >
                        <stop stopColor="#f6da6e" offset={`${percentage}%`} />
                        <stop
                            stopColor="rgb(216, 223, 233)"
                            offset={`${percentage}%`}
                        />
                        <stop stopColor="rgb(216, 223, 233)" offset="100%" />
                    </linearGradient>
                    <FaStar
                        style={{ fill: `url(#yellow-gray-gradient-${index})` }}
                    />
                </svg>
            );
        } else {
            // Gray star
            return "rgb(216, 223, 233)";
        }
    };

    return (
        <div className="tw-flex tw-gap-[5px]">
            {Array.from({ length: MAX_STARS }).map((_, index) => (
                <div
                    key={index}
                    className="tw-flex tw-justify-center tw-items-center"
                >
                    {typeof getStarFill(index) === "string" ? (
                        <FaStar style={{ fill: getStarFill(index) }} />
                    ) : (
                        getStarFill(index)
                    )}
                </div>
            ))}
            ({rating?.toFixed(2)})
        </div>
    );
};

const Gallery = ({ products = [], tags = [] }) => {
    const { t } = useTranslation(["common", "errors", "store"]);
    const [pageSize, setPageSize] = useState(12); //! Size
    const [currentPage, setCurrentPage] = useState(0);
    console.log("products", products);

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
        console.log("selectedPrice selected:", value);
        setSelectedPrice(value);
    };
    console.log("selected price", selectedPrice);
    const selectedPriceInput = {
        label: "Price",
        name: "price",
        type: "select",
        options: [
            {
                value: 0,
                label: "All",
            },
            {
                value: 1,
                label: "0 to 200.000",
            },
            {
                value: 2,
                label: "200.000 to 300.000",
            },
            {
                value: 3,
                label: "300.000 to 500.000",
            },
            {
                value: 4,
                label: "More than 500.000",
            },
        ],
        myOnChange: handleSelectedPrice,
    };

    //* Star
    const [selectedStar, setSelectedStar] = useState(0);
    const handleStarSelect = (value) => {
        console.log("Star selected:", value);
        setSelectedStar(value);
    };
    const starInput = {
        label: "Star",
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

    // Lọc sản phẩm dựa trên search query
    const filteredBySearch = useMemo(() => {
        if (!searchQuery) return filteredByTag;
        const query = searchQuery.toLowerCase();
        return filteredByTag.filter(
            (p) =>
                p.name?.toLowerCase().includes(query) ||
                p.description?.toLowerCase().includes(query)
        );
    }, [searchQuery, filteredByTag]);

    const filteredByStar = useMemo(() => {
        return filteredBySearch.filter((p) => p.star >= selectedStar);
    }, [filteredBySearch, selectedStar]);

    const filteredByPrice = useMemo(() => {
        const price = arrayPrice[selectedPrice];

        let finalProducts = filteredByStar;
        console.log("Start", finalProducts);
        if (price[0]) {
            finalProducts = filteredByStar.filter((p) => p.price >= price[0]);
        }
        if (price[1]) {
            finalProducts = finalProducts.filter((p) => p.price <= price[1]);
        }

        console.log("Filtered", finalProducts);
        return finalProducts;
    }, [filteredByStar, selectedPrice]);

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

    console.log("rating", selectedStar);

    return (
        <GalleryWrap>
            <GalleryButtons>
                <BorderedBottomTabs>
                    <PanelTabs>
                        <Tab.Container activeKey={currentTag}>
                            <TabsWrap>
                                <Nav className="nav-tabs">
                                    <NavItem key="0">
                                        <NavLink
                                            eventKey="all"
                                            type="button"
                                            active={currentTag === "all"}
                                            onClick={() => onFilter("all")}
                                            className="tw-text-2xl"
                                        >
                                            {t("tables.customizer.page.show")}
                                        </NavLink>
                                    </NavItem>
                                    {tags?.map((btn, index) => (
                                        <NavItem key={index + 1}>
                                            <NavLink
                                                eventKey={btn.tag}
                                                className="tw-text-2xl"
                                                key={`index_${btn.tag}`}
                                                type="button"
                                                active={btn.tag === currentTag}
                                                onClick={() =>
                                                    onFilter(btn.tag)
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

                <Collapse title={"Lọc"} className="with-shadow">
                    <div className="tw-flex tw-justify-between tw-items-center tw-gap-[50px]">
                        {/*//* Search  */}
                        <div className="" style={{ flex: 2 }}>
                            <CustomReactTableFilter
                                style={{
                                    marginBottom: "5px",
                                }}
                                customWidth={{ maxWidth: "90%" }}
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
                        <div className="" style={{ flex: 1 }}>
                            <Form
                                onSubmit={() => {
                                    console.log("Submit");
                                }}
                                initialValues={{
                                    star: selectedStar,
                                }}
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
                                                        <FormInput
                                                            data={starInput}
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
                        <div className="" style={{ flex: 1 }}>
                            <Form
                                onSubmit={() => {
                                    console.log("Submit");
                                }}
                                initialValues={{
                                    price: selectedPrice,
                                }}
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
            </GalleryButtons>

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
                        manualPageSize={[10, 20, 30, 40]}
                    />
                </PaginationWrap>
            )}
        </GalleryWrap>
    );
};

Gallery.propTypes = {
    products: PropTypes.array.isRequired,
    tags: PropTypes.arrayOf(
        PropTypes.shape({
            tag: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default Gallery;

// Styled Components

const GalleryWrap = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;

    img {
        width: 100%;
    }
`;

const GalleryButtons = styled.div`
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
    justify-content: center;
    align-items: center;

    padding: 10px 10px;
    border-radius: 5px;
    background-color: ${colorBackground};
`;
