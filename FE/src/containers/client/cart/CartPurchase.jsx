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
import { colorAdditional, colorText } from "@/utils/palette";
import { marginRight, paddingLeft } from "@/utils/directions";
import { Button } from "@/shared/components/Button";

{
    /* <CartDelivery>
                                <Field
                                    name="delivery"
                                    render={renderRadioButtonField}
                                    label="Ninja Van"
                                    radioValue="russian_post"
                                />
                                <CartDeliveryTime>
                                    5-7 working days
                                </CartDeliveryTime>
                                <CartDeliveryPrice>
                                    {(25000).toLocaleString()} VNĐ
                                </CartDeliveryPrice>
                            </CartDelivery> */
}

const CartPurchase = ({ subTotal = 0, shippingFee = 0 }) => {
    // console.log("Selected Products Length:", selectedProducts.length);
    return (
        <div>
            <FormGroup>
                <FormGroupLabel>Delivery method:</FormGroupLabel>
                <CartDeliveryField>
                    {/*//* Option 1  */}
                    <CartDelivery>
                        <Field
                            name="delivery"
                            render={renderRadioButtonField}
                            label="GHN"
                            radioValue="ghn"
                        />
                        <CartDeliveryTime>3-5 working days</CartDeliveryTime>
                        <CartDeliveryPrice>
                            {shippingFee.toLocaleString()} VNĐ
                        </CartDeliveryPrice>
                    </CartDelivery>
                </CartDeliveryField>
            </FormGroup>
            <CartTotal>
                Total Price: {(subTotal + shippingFee).toLocaleString()} VNĐ
            </CartTotal>
        </div>
    );
};

export default CartPurchase;

// region STYLES

const CartDeliveriesForm = styled(FormContainer)`
    margin-top: 20px;
`;

const CartDelivery = styled.div`
    ${marginRight}: 50px;
    margin-bottom: 10px;

    &:last-child {
        ${marginRight}: 0;
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
