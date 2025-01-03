import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Col, Container, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import ReactTableBase from "@/shared/components/table/ReactTableBase";
import ReactTableCustomizer from "@/shared/components/table/components/ReactTableCustomizer";
import {
    Card,
    CardBody,
    CardTitleWrap,
    CardTitle,
} from "@/shared/components/Card";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import CustomModal from "@/shared/components/custom/modal/CustomModal";
import CustomReactTableBase from "@/shared/components/custom/table/CustomReactTableBase";
import CreateUserHeader from "./CreateUserHeader";
import { selectTotalUsers } from "./../../../redux/reducers/userSlice";
import { removeUser } from "../../../redux/actions/userAction";

const UserPage = () => {
    const { t } = useTranslation(["common", "errors", "store"]);
    const roleLabels = {
        ADMIN: t("store:user.admin"),
        STAFF: t("store:user.staff"),
        USER: t("store:user.user"),
    };
    const reactTableData = CreateUserHeader(t);

    const [withPagination, setWithPaginationTable] = useState(true);
    const [isSortable, setIsSortable] = useState(false);
    const [withSearchEngine, setWithSearchEngine] = useState(false);

    const dispatch = useDispatch();

    const handleClickIsSortable = () => {
        setIsSortable(!isSortable);
    };

    const handleClickWithPagination = () => {
        setWithPaginationTable(!withPagination);
    };

    const handleClickWithSearchEngine = () => {
        setWithSearchEngine(!withSearchEngine);
    };

    const mapPlaceholder =
        t("tables.customizer.search.search") + " " + t("store:user.titles");

    const tableConfig = {
        isSortable,
        isResizable: false,
        withPagination,
        withSearchEngine,
        manualPageSize: [10, 20, 30, 40],
        placeholder: mapPlaceholder,
    };

    let users = useSelector(selectTotalUsers);
    // console.log("user before", users);

    // users = users?.filter(
    //     (user) =>
    //         !user.authorities.some(
    //             (authority) => authority.authority == "ROLE_USER"
    //         )
    // );

    users = users?.map((user) => ({
        ...user,
        authorities: user.authorities.map((auth) => auth.authority), // For display in Modal
        convertedAuthorities: user.authorities
            .map((auth) => auth.authority)
            .map((role) => role.replace("ROLE_", "")) // For display in the table
            .map((role) => roleLabels[role])
            .join(", "),
    }));

    // console.log("users", users);

    //* Sort theo role
    const rolePriority = {
        ADMIN: 1,
        STAFF: 2,
        // CUSTOMER: 3,
        USER: 3,
    };

    users = users.sort((a, b) => {
        // const roleA = a.convertedAuthorities.split(",")[0];
        // const roleB = b.convertedAuthorities.split(",")[0];

        const roleA = a.authorities[0].replace("ROLE_", "");
        const roleB = b.authorities[0].replace("ROLE_", "");

        return rolePriority[roleA] - rolePriority[roleB];
    });

    // console.log("users", users);

    //* Add edit/delete Button
    const data = useMemo(() => {
        return users?.map((item, index) => ({
            ...item,
            no: index + 1,
            action: (
                <Col
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                    }}
                >
                    <CustomModal
                        color="warning"
                        title={t("action.edit") + " " + t("store:user.title")}
                        btn={t("action.edit")}
                        action="edit"
                        component="user"
                        data={item}
                    />

                    <Button
                        variant="danger"
                        onClick={() => handleDelete(item.id)}
                        style={{ margin: "0" }}
                    >
                        <span>{t("action.delete")}</span>
                    </Button>
                </Col>
            ),
        }));
    }, [users, t]);

    const handleDelete = async (id) => {
        try {
            const response = await dispatch(removeUser(id));
            const action = t("common:action.delete");

            if (response) {
                toast.info(t("common:action.success", { type: action }), {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            // console.log(error);
            const action = t("common:action.delete");
            toast.error(t("common:action.fail", { type: action }), {
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

    return (
        <Container>
            <Row>
                {" "}
                <Col md={12} lg={12}>
                    <Card>
                        <CardBody>
                            {/*//* Title  */}
                            <CardTitleWrap>
                                <CardTitle>{t("store:user.titles")}</CardTitle>
                            </CardTitleWrap>

                            {/*//*Customizer   */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <ReactTableCustomizer
                                    handleClickIsSortable={
                                        handleClickIsSortable
                                    }
                                    handleClickWithPagination={
                                        handleClickWithPagination
                                    }
                                    handleClickWithSearchEngine={
                                        handleClickWithSearchEngine
                                    }
                                    isSortable={isSortable}
                                    withPagination={withPagination}
                                    withSearchEngine={withSearchEngine}
                                />

                                {/*//* Button: New  */}
                                <CustomModal
                                    color="primary"
                                    title={
                                        t("action.add") +
                                        " " +
                                        t("store:user.title")
                                    }
                                    btn={t("action.add")}
                                    action="new"
                                    component="user"
                                />
                            </div>

                            {/*//* Table  */}
                            <CustomReactTableBase
                                key={withSearchEngine ? "searchable" : "common"}
                                columns={reactTableData.tableHeaderData}
                                data={data}
                                tableConfig={tableConfig}
                                component="user"
                            />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

UserPage.propTypes = {};

export default UserPage;
