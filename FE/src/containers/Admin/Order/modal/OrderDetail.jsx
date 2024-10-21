import React from "react";
import Collapse from "@/shared/components/Collapse";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import CustomForm from "@/shared/components/custom/form/CustomForm";
import { values } from "regenerator-runtime";

const OrderDetail = () => {
    const { t } = useTranslation(["common", "errors", "store"]);
    const enter = t("action.enter");

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
            disabled: true,
        },
        {
            label: t("store:order.phone"),
            name: "phone",
            type: "text",
            disabled: true,
        },
        {
            label: t("store:order.address"),
            name: "address",
            type: "text",
            disabled: true,
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
            label: t("store:order.status"),
            name: "status",
            type: "select",
            options: [
                { value: "CREATED", label: "Tạo đơn hàng" },
                { value: "CONFIRMED", label: "Xác nhận" },
                { value: "DELIVERING", label: "Đang giao" },
                { value: "DONE", label: "Hoàn thành" },
                { value: "CANCEL", label: "Hủy" },
            ],
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
                min={4}
                max={4}
                isButton={false}
            />
        </Collapse>
    );
};

OrderDetail.propTypes = {};

export default OrderDetail;
