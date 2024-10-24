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
