import React from "react";
import Tooltip from "rc-tooltip";
import RCSlider from "rc-slider";
import PropTypes from "prop-types";
import {
    SliderMax,
    SliderMin,
    SliderWrap,
} from "@/shared/components/range_slider/SliderElements";

import "rc-slider/assets/index.css";

const HandleTooltip = ({
    value,
    children,
    visible,
    tipFormatter = (value) => value,
    ...restProps
}) => (
    <Tooltip
        prefixCls="rc-slider-tooltip"
        placement="top"
        overlay={tipFormatter(value)}
        overlayInnerStyle={{ minHeight: "auto" }}
        visible={visible}
        {...restProps}
    >
        {children}
    </Tooltip>
);

HandleTooltip.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.arrayOf(PropTypes.number),
    ]).isRequired,
    visible: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    tipFormatter: PropTypes.func,
};

const handleRender =
    ({ tipFormatter }) =>
    (node, { value, dragging }) =>
        (
            <HandleTooltip
                value={value}
                visible={dragging}
                tipFormatter={tipFormatter}
            >
                {node}
            </HandleTooltip>
        );

const Slider = ({
    marks = {},
    value = 0,
    min,
    max,
    tipFormatter = (value) => value,
    range = false,
}) => (
    <SliderWrap>
        <SliderMin>
            <p>{tipFormatter ? tipFormatter(min) : min}</p>
        </SliderMin>
        <SliderMax>
            <p>{tipFormatter ? tipFormatter(max) : max}</p>
        </SliderMax>
        <RCSlider
            range={range}
            min={min}
            max={max}
            defaultValue={value}
            handleRender={handleRender({ tipFormatter })}
            marks={marks}
            tipFormatter={tipFormatter}
            style={{ marginTop: "0px" }}
        />
    </SliderWrap>
);

Slider.propTypes = {
    range: PropTypes.bool,
    marks: PropTypes.shape(),
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.arrayOf(PropTypes.number),
    ]),
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    tipFormatter: PropTypes.func,
};

export default Slider;
