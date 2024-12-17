import React from "react";
import { Field, Form } from "react-final-form";
import { Link } from "react-router-dom";
import styled from "styled-components";
import renderRadioButtonField from "@/shared/components/form/RadioButton";
import {
    FormButtonToolbar,
    FormContainer,
    FormGroup,
    FormGroupField,
    FormGroupLabel,
} from "@/shared/components/form/FormElements";
import { colorAdditional, colorText, colorBlue } from "@/utils/palette";
import { marginRight, paddingLeft } from "@/utils/directions";
import { Button } from "@/shared/components/Button";
import { useTranslation } from "react-i18next";
import { CardTitleWrap, CardTitle } from "@/shared/components/Card";

const PaymentMethod = () => {
    const { t, i18n } = useTranslation(["common", "errors", "store"]);
    let language = i18n.language;
    // console.log("Selected Products Length:", selectedProducts.length);
    return (
        <div>
            <FormGroup>
                {/* <FormGroupLabel>
                    {t("store:invoice.paymentMethod")}
                </FormGroupLabel> */}
                <div className="tw-flex tw-justify-start tw-mb-[10px]">
                    <CardTitle>
                        {t("store:invoice.paymentMethod").toUpperCase()}
                    </CardTitle>
                </div>

                <CartDeliveryField className="tw-flex-col tw-items-start">
                    {/*//* Option 1  */}
                    <CartDelivery className="tw-flex tw-justify-start ">
                        <Field
                            name="paymentMethod"
                            render={renderRadioButtonField}
                            label={
                                <LabelContainer>
                                    <span>COD</span>
                                </LabelContainer>
                            }
                            radioValue="COD"
                        />
                    </CartDelivery>

                    <CartDelivery className="tw-flex tw-justify-start">
                        <Field
                            name="paymentMethod"
                            render={renderRadioButtonField}
                            // label="VNPay"
                            label={
                                <LabelContainer>
                                    <img
                                        src="/img/logo/vnpay.jpg"
                                        alt="VNPay Logo"
                                        className="logo"
                                    />
                                    <span>VNPay</span>
                                </LabelContainer>
                            }
                            radioValue="VNPay"
                        />
                    </CartDelivery>
                </CartDeliveryField>
            </FormGroup>
        </div>
    );
};

export default PaymentMethod;

// region STYLES

const LabelContainer = styled.div`
    display: flex;
    align-items: center;

    .logo {
        width: 30px;
        height: 30px;
        margin-right: 8px;
    }

    span {
        line-height: 1.5; /* Căn chỉnh text giữa */
    }
`;

const CartDeliveriesForm = styled(FormContainer)`
    margin-top: 20px;
`;

const CartDelivery = styled.div`
    ${marginRight}: 50px;
    margin-bottom: 10px;

    &:last-child {
        /* ${marginRight}: 0; */
    }

    & > label {
        margin-bottom: 0;
    }
`;

const CartDeliveryField = styled(FormGroupField)`
    flex-wrap: wrap;
`;

const CartTotal = styled.h4`
    width: 100%;
    font-weight: 700;
    margin-bottom: 5px;
`;

const CartDeliveryPrice = styled.p`
    font-size: 10px;
    line-height: 13px;
    margin: 0;
    ${paddingLeft}: 27px;
`;

const CartDeliveryTime = styled(CartDeliveryPrice)`
    color: ${colorAdditional};
    margin-bottom: 8px;
`;

// endregion
