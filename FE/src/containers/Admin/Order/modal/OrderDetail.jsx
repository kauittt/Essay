import React, { useEffect, useState } from "react";
import Collapse from "@/shared/components/Collapse";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import CustomForm from "@/shared/components/custom/form/CustomForm";
import { values } from "regenerator-runtime";
import { CANCEL, CREATED, DONE } from "../../../ConstKey";
import axios from "@/utils/axiosConfig";

const OrderDetail = ({ order = {} }) => {
    const { t } = useTranslation(["common", "errors", "store"]);
    const enter = t("action.enter");
    const userLocal = JSON.parse(localStorage.getItem("user")); //* Local

    const isStaff = userLocal.roles[0] !== "ROLE_USER";
    const isAdmin = userLocal.roles[0] == "ROLE_ADMIN";
    const isEditAble = order.status == CREATED;
    const isCompleted = order.status == DONE || order.status == CANCEL;

    //! Location
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    useEffect(() => {
        if (!order) return;

        const fetchProvinces = async () => {
            try {
                const response = await axios.get(
                    "https://provinces.open-api.vn/api/p/"
                );
                setProvinces(response.data);
            } catch (error) {
                console.error("Error fetching provinces:", error);
            }
        };
        const fetchDistricts = async () => {
            try {
                const response = await axios.get(
                    `https://provinces.open-api.vn/api/p/${order.province}?depth=2`
                );
                setDistricts(response.data.districts);
            } catch (error) {
                console.error("Error fetching provinces:", error);
            }
        };
        const fetchWards = async () => {
            try {
                const response = await axios.get(
                    `https://provinces.open-api.vn/api/d/${order.district}?depth=2`
                );
                setWards(response.data.wards); // Lưu wards từ API
            } catch (error) {
                console.error("Error fetching provinces:", error);
            }
        };

        fetchProvinces();
        order.district && fetchDistricts();
        order.ward && fetchWards();
    }, [order]);
    //! ---------------------

    const leftFields = [
        {
            label: t("store:order.id"),
            name: "id",
            type: "text",
            disabled: true,
        },
        {
            label: t("store:order.name"),
            name: "name",
            type: "text",
            disabled: isStaff || !isEditAble,
        },
        {
            label: t("store:order.phone"),
            name: "phone",
            type: "text",
            disabled: isStaff || !isEditAble,
        },
        {
            label: t("store:voucher.title"),
            name: "voucherName",
            type: "text",
            disabled: true,
        },
        {
            label: t("store:order.status.title"),
            name: "status",
            type: "select",
            options: [
                { value: "CREATED", label: t("store:order.status.created") },
                {
                    value: "CONFIRMED",
                    label: t("store:order.status.confirmed"),
                },
                {
                    value: "DELIVERING",
                    label: t("store:order.status.delivering"),
                },
                { value: "DONE", label: t("store:order.status.done") },
                { value: "CANCEL", label: t("store:order.status.cancel") },
            ],
            disabled: !isStaff || isCompleted,
            //* Disable khi: không phải staff, CANCEL/DONE && !Admin
        },
    ];

    const rightFields = [
        {
            label: t("store:order.createDate"),
            name: "createDate",
            type: "datepicker",
            disabled: true,
        },
        {
            label: t("store:order.updateDate"),
            name: "updateDate",
            type: "datepicker",
            disabled: true,
        },
        {
            label: t("store:location.province"),
            name: "province",
            type: "select",
            options: provinces.map((province) => {
                return { value: province.code + "", label: province.name };
            }),
            disabled: true,
        },
        {
            label: t("store:location.district"),
            name: "district",
            type: "select",
            options: districts.map((district) => {
                return { value: district.code + "", label: district.name };
            }),
            disabled: true,
        },
        {
            label: t("store:location.ward"),
            name: "ward",
            type: "select",
            options: wards.map((ward) => {
                return { value: ward.code + "", label: ward.name };
            }),
            disabled: true,
        },
        {
            label: t("store:order.address"),
            name: "address",
            type: "text",
            disabled: true,
        },
    ];

    return (
        <Collapse
            title={t("store:order.detail")}
            className="with-shadow"
            open={true}
        >
            <CustomForm
                leftFields={leftFields}
                rightFields={rightFields}
                min={99}
                max={99}
                isButton={false}
            />
        </Collapse>
    );
};

OrderDetail.propTypes = {};

export default OrderDetail;
