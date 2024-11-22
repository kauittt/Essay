import React from "react";
import PropTypes from "prop-types";
import {
    FormGroup,
    FormGroupField,
    FormGroupIcon,
    FormGroupLabel,
} from "@/shared/components/form/FormElements";
import { Field } from "react-final-form";
import renderSelectField from "@/shared/components/custom/form/Select";
import renderCheckBoxField from "@/shared/components/custom/form/CustomCheckBox";
import CalendarBlankIcon from "mdi-react/CalendarBlankIcon";
import renderDatePickerField from "@/shared/components/form/date-pickers/DatePicker";
import FormField from "@/shared/components/custom/form/FormField";
import { useForm, Controller } from "react-hook-form";
import { FileInputImageField } from "./FileInputImage";
import { FileInputField } from "../../form/FileInput";
import renderExpandSelectField from "./ExpandSelect";
import renderRadioButtonField from "@/shared/components/form/RadioButton";
import renderVoucherRadioButtonField from "@/shared/components/custom/form/VoucherRadioButton";

const FormInput = ({ data, style = {} }) => {
    const { handleSubmit, register, reset, control } = useForm();
    const styleType = "colored";
    // console.log("FormInput", data);
    return (
        <FormGroup key={data.name} style={{ minHeight: "65px", ...style }}>
            {/* Label */}
            {data.type != "checkbox" &&
                data.type != "voucherRadio" &&
                data.type != "radio" && (
                    <FormGroupLabel>{data.label}</FormGroupLabel>
                )}

            {/* Field */}
            <FormGroupField>
                {data.type === "text" && (
                    <Field
                        component={FormField}
                        name={data.name}
                        type="text"
                        placeholder={data.placeholder}
                        style={{ height: "32px" }}
                        disabled={data.disabled}
                        value={data.value}
                        myOnBlur={data.myOnBlur}
                    />
                )}

                {data.type === "importFile" && (
                    <Controller
                        name={data.name}
                        control={control}
                        render={({ field }) => (
                            <FileInputImageField
                                {...field}
                                value={data}
                                name={data.name}
                            />
                        )}
                    />
                )}

                {data.type === "textarea" && (
                    <Field
                        name={data.name}
                        component="textarea" //* Có thể cần đổi ở đây
                        type="text"
                        placeholder={data.placeholder}
                        style={{ height: "32px" }}
                    />
                )}
                {data.type === "email" && (
                    <Field
                        name={data.name}
                        component="input" //* Có thể cần đổi ở đây
                        type="email"
                        placeholder={data.placeholder}
                        style={{ height: "32px" }}
                    />
                )}
                {data.type === "expandSelect" && (
                    <Field
                        name={data.name}
                        component={renderExpandSelectField}
                        options={data.options}
                        style={{ height: "32px" }}
                        value={data.value}
                        onChange={data.onChange}
                        // myValue={data.value}
                        myOnChange={data.myOnChange}
                        menuList={data.menuList}
                        myOnBlur={data.myOnBlur}
                    />
                )}
                {data.type === "select" && (
                    <Field
                        name={data.name}
                        component={renderSelectField}
                        options={data.options}
                        style={{ height: "32px" }}
                        value={data.value}
                        onChange={data.onChange}
                        myOnChange={data.myOnChange}
                    />
                )}
                {data.type === "multiSelect" && (
                    <Field
                        name={data.name}
                        component={renderSelectField}
                        options={data.options}
                        style={{ height: "32px" }}
                        isMulti={true}
                        closeOnSelect={false}
                        removeSelected={false}
                        value={data.value}
                        onChange={data.onChange}
                    />
                )}
                {data.type === "datepicker" && (
                    <>
                        <Field
                            name={data.name}
                            component={renderDatePickerField}
                            style={{ height: "32px" }}
                            disabled={data.disabled}
                        />
                        <FormGroupIcon>
                            <CalendarBlankIcon />
                        </FormGroupIcon>
                    </>
                )}
                {data.type === "checkbox" && (
                    <Field
                        name={data.name}
                        type="checkbox"
                        component={renderCheckBoxField}
                        label={data.label}
                        styleType={styleType}
                    />
                )}

                {data.type === "radio" && (
                    <Field
                        name={data.name}
                        render={renderRadioButtonField}
                        label={data.label}
                        radioValue={data.radioValue}
                    />
                )}

                {data.type === "voucherRadio" && (
                    <Field
                        name={data.name}
                        render={renderVoucherRadioButtonField}
                        label={data.label}
                        radioValue={data.radioValue}
                        voucher={data.voucher}
                    />
                )}
            </FormGroupField>
        </FormGroup>
    );
};

FormInput.propTypes = {
    data: PropTypes.object.isRequired,
};

export default FormInput;
