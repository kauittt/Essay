import React from "react";
import Collapse from "@/shared/components/Collapse";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import CustomForm from "@/shared/components/custom/form/CustomForm";
import { values } from "regenerator-runtime";

const InvoiceDetail = () => {
    const { t } = useTranslation(["common", "errors", "store"]);
    const enter = t("action.enter");

    const leftFields = [
        {
            label: t("store:invoice.id"),
            name: "invoiceId",
            type: "text",
            disabled: true,
        },
        {
            label: t("store:invoice.createDate"),
            name: "invoiceCreateDate",
            type: "datepicker",
            disabled: true,
        },
        {
            label: t("store:invoice.paymentMethod"),
            name: "invoicePaymentMethod",
            // type: "select",
            type: "text",
            // options: [{ value: "COD", label: "COD" }],
            disabled: true,
        },
    ];

    const rightFields = [
        {
            label: t("store:invoice.totalAmount"),
            name: "invoiceTotalAmount",
            type: "text",
            disabled: true,
        },
        {
            label: t("store:invoice.discountAmount"),
            name: "invoiceDiscountAmount",
            type: "text",
            disabled: true,
        },
        {
            label: t("store:invoice.totalDue"),
            name: "invoiceTotalDue",
            type: "text",
            disabled: true,
        },
    ];

    return (
        <Collapse title={t("store:invoice.title")} className="with-shadow">
            <CustomForm
                leftFields={leftFields}
                rightFields={rightFields}
                min={3}
                max={3}
                isButton={false}
            />
        </Collapse>
    );
};

InvoiceDetail.propTypes = {};

export default InvoiceDetail;
