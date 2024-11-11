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
import { colorAdditional } from "@/utils/palette";
import { marginRight, paddingLeft } from "@/utils/directions";
import { Button } from "@/shared/components/Button";

const CartPurchase = ({ subTotal = 0 }) => (
    <Form onSubmit={() => {}} initialValues={{ delivery: "russian_post" }}>
        {({ handleSubmit }) => (
            <CartDeliveriesForm onSubmit={handleSubmit}>
                <FormGroup>
                    <FormGroupLabel>Delivery method:</FormGroupLabel>
                    <CartDeliveryField>
                        {/*//* Option 1  */}
                        <CartDelivery>
                            <Field
                                name="delivery"
                                render={renderRadioButtonField}
                                label="GHN"
                                radioValue="dhl"
                            />
                            <CartDeliveryTime>
                                3-5 working days
                            </CartDeliveryTime>
                            <CartDeliveryPrice>
                                {(30000).toLocaleString()} VNĐ
                            </CartDeliveryPrice>
                        </CartDelivery>

                        {/*//* Option 2  */}
                        {/* <CartDelivery>
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
                        </CartDelivery> */}
                    </CartDeliveryField>
                </FormGroup>
                <CartTotal>
                    Total Price: {(subTotal + 30000).toLocaleString()} VNĐ
                </CartTotal>
                <FormButtonToolbar>
                    <Button
                        as={Link}
                        variant="primary"
                        to="/e-commerce/payment"
                    >
                        Purchase
                    </Button>
                </FormButtonToolbar>
            </CartDeliveriesForm>
        )}
    </Form>
);

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
