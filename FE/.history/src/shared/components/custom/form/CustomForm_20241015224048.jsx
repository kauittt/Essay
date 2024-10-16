import React, { useState } from "react";
import PropTypes from "prop-types";
import { Row, Col } from "react-bootstrap";
import { FormButtonToolbar } from "@/shared/components/form/FormElements";
import FormInput from "./FormInput";
import { Button } from "@/shared/components/Button";
import { useTranslation } from "react-i18next";

const CustomForm = ({ isButton = true, btnContent = "", ...props }) => {
    const { t } = useTranslation(["common", "errors"]);

    const [visibleItems, setVisibleItems] = useState(props.min);

    const toggleVisibility = () => {
        setVisibleItems(visibleItems === props.min ? props.max : props.min);
    };

    return (
        <div>
            <Row style={{ width: "100%", flex: 1 }}>
                {/* //* Left Column */}
                <Col md={6}>
                    {props.leftFields
                        .slice(0, visibleItems)
                        .map((data, index) => (
                            <FormInput key={index} data={data}></FormInput>
                        ))}
                </Col>

                {/* //* Right Column */}
                <Col md={6}>
                    {props.rightFields
                        .slice(0, visibleItems)
                        .map((data, index) => (
                            <FormInput key={index} data={data}></FormInput>
                        ))}
                </Col>
            </Row>
            {props.isButton && (
                <FormButtonToolbar
                    style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "flex-end",
                    }}
                >
                    {props.btnContent == "" ? (
                        <Button variant="secondary" onClick={toggleVisibility}>
                            {visibleItems === props.min
                                ? t("action.showMore")
                                : t("action.showLess")}
                        </Button>
                    ) : (
                        <Button variant="secondary" onClick={props.func}>
                            {props.btnContent}
                        </Button>
                    )}
                </FormButtonToolbar>
            )}
        </div>
    );
};

CustomForm.propTypes = {
    leftFields: PropTypes.array.isRequired,
    rightFields: PropTypes.array.isRequired,
    isButton: PropTypes.bool,
    min: PropTypes.number,
    max: PropTypes.number,
    btnContent: PropTypes.string,
    func: PropTypes.func,
};

export default CustomForm;
