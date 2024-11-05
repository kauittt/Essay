import React, { useMemo, useState } from "react";
import { Col } from "react-bootstrap";
import {
    Card,
    CardBody,
    CardTitleWrap,
    CardTitle,
} from "@/shared/components/Card";
import {
    FormContainer,
    FormGroup,
    FormGroupField,
    FormGroupIcon,
} from "@/shared/components/form/FormElements";
import { FaMagnifyingGlass } from "react-icons/fa6";
import FeedbackList from "./FeedbackList";
import ReactTablePagination from "../../../../shared/components/table/components/ReactTablePagination";
import CustomReactTableFilter from "../../../../shared/components/custom/table/CustomReactTableFilter";
import Collapse from "../../../../shared/components/Collapse";
import { Form } from "react-final-form";
import FormInput from "@/shared/components/custom/form/FormInput";
import { FaStar } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import StarRating from "../../StarRating";

const Feedback = ({ product = {} }) => {
    const { t, i18n } = useTranslation(["common", "errors", "store"]);
    let language = i18n.language;

    //* Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    //* Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRating, setSelectedRating] = useState(0);

    // Calculate filtered and paginated feedbacks
    const filteredFeedbacks = useMemo(() => {
        return product.feedBacks
            .filter((feedback) =>
                feedback.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            )
            .filter((feedback) => feedback.point >= selectedRating);
    }, [product.feedBacks, searchQuery, selectedRating]);

    const currentFeedbacks = useMemo(() => {
        const start = currentPage * pageSize;
        const end = start + pageSize;
        return filteredFeedbacks.slice(start, end);
    }, [filteredFeedbacks, currentPage, pageSize]);

    const totalPages = useMemo(() => {
        return Math.ceil(filteredFeedbacks.length / pageSize);
    }, [filteredFeedbacks.length, pageSize]);

    // Pagination navigation functions
    const canPreviousPage = currentPage > 0;
    const canNextPage = currentPage < totalPages - 1;

    const gotoPage = (page) => setCurrentPage(page);
    const previousPage = () =>
        canPreviousPage && setCurrentPage(currentPage - 1);
    const nextPage = () => canNextPage && setCurrentPage(currentPage + 1);

    const handleRatingChange = (value) => {
        setSelectedRating(value);
        setCurrentPage(0); // Reset to first page on filter change
    };

    const ratingInput = {
        label: t("store:filter.rating"),
        name: "rating",
        type: "select",
        options: Array.from({ length: 6 }, (_, i) => ({
            value: i,
            label: <StarRating rating={i} />,
        })),
        myOnChange: handleRatingChange,
    };

    //* Something else
    console.log("product in feedback", product);
    return (
        <Col md={12} lg={12}>
            <Card>
                <CardBody>
                    {/*//* Title  */}
                    <CardTitleWrap>
                        <CardTitle>{t("store:feedback.title")}</CardTitle>
                    </CardTitleWrap>

                    {/*//* Filter  */}
                    <Collapse
                        title={t("store:filter.title")}
                        className="with-shadow"
                    >
                        <div className="tw-flex tw-justify-between tw-items-center tw-gap-[50px]">
                            {/* Search by Description */}
                            <div style={{ flex: 2 }}>
                                <CustomReactTableFilter
                                    style={{ marginBottom: "5px" }}
                                    customWidth={{ maxWidth: "90%" }}
                                    rows={filteredFeedbacks}
                                    setGlobalFilter={setSearchQuery}
                                    setFilterValue={setSearchQuery}
                                    placeholder={`${t(
                                        "tables.customizer.search.search"
                                    )} ${t(
                                        "store:feedback.titles"
                                    ).toLowerCase()}...`}
                                    dataLength={product.feedBacks.length}
                                />
                            </div>

                            {/* Filter by Rating */}
                            <div style={{ flex: 1 }}>
                                <Form
                                    onSubmit={() => {}}
                                    initialValues={{ rating: selectedRating }}
                                >
                                    {({ handleSubmit, form }) => (
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
                                                            data={ratingInput}
                                                        />
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </FormContainer>
                                    )}
                                </Form>
                            </div>
                        </div>
                    </Collapse>

                    {/*//* List  */}
                    <div>
                        {currentFeedbacks.map((feedback) => (
                            <FeedbackList key={feedback.id} data={feedback} />
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {
                        <ReactTablePagination
                            dataLength={product.feedBacks.length}
                            page={currentFeedbacks}
                            gotoPage={gotoPage}
                            canPreviousPage={canPreviousPage}
                            canNextPage={canNextPage}
                            pageOptions={Array.from(
                                { length: totalPages },
                                (_, i) => i
                            )}
                            pageSize={pageSize}
                            pageIndex={currentPage}
                            previousPage={previousPage}
                            nextPage={nextPage}
                            setPageSize={setPageSize}
                            manualPageSize={[5, 10, 15, 20]} // Adjust options as needed
                        />
                    }
                </CardBody>
            </Card>
        </Col>
    );
};

export default Feedback;
