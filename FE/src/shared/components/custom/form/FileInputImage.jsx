import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { renderComponentField } from "@/shared/components/form/FormField";
import { colorFieldsBorder, colorText } from "@/utils/palette";
import { paddingLeft } from "@/utils/directions";
import axios from "axios";
import { useField } from "react-final-form";
import { useTranslation } from "react-i18next";

export const FileInputImageField = React.forwardRef(({ name }, ref) => {
    const { t } = useTranslation(["common", "errors", "store"]);

    const {
        input: { value, onChange },
        meta: { touched, error },
    } = useField(name, {
        subscription: { value: true, touched: true, error: true },
    });

    const [image, setImage] = useState(value || null);
    const [loading, setLoading] = useState(false);

    const handleChange = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "umbkkwi4");

        setLoading(true);
        try {
            const response = await axios.post(
                "https://api.cloudinary.com/v1_1/da0ikowpn/image/upload",
                formData
            );
            setImage(response.data.secure_url);
            onChange(response.data.secure_url);
        } catch (error) {
            console.error("Error uploading file: ", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormGroupFile>
            <div
                className="tw-flex tw-justify-center tw-items-center tw-gap-[30px]
                tw-h-20"
            >
                <label htmlFor={name}>{t("store:product.selectImage")}</label>
                {loading ? (
                    <div className="spinner-border" role="status"></div>
                ) : (
                    <img
                        id="preview-img"
                        className="tw-h-20 tw-w-20 tw-object-cover tw-rounded-[5px]"
                        src={
                            image ||
                            `https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg`
                        }
                        alt="Current profile photo"
                    />
                )}
                <input
                    type="file"
                    name={name}
                    id={name}
                    onChange={handleChange}
                    ref={ref}
                />
                {touched && error && <p className="error">{error}</p>}
            </div>
        </FormGroupFile>
    );
});
FileInputImageField.propTypes = {
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.shape({
            name: PropTypes.string,
        }),
        PropTypes.string,
    ]),
};

export default renderComponentField(FileInputImageField);

// region STYLES

const FormGroupFile = styled.div`
    label {
        border-radius: 2px;
        line-height: 18px;
        font-size: 12px;
        padding: 4px 20px;
        cursor: pointer;
        transition: all 0.3s;
        text-align: center;
        border: 1px solid ${colorFieldsBorder};
        color: ${colorText};

        &:hover {
            background: ${colorFieldsBorder};
        }
    }

    .error {
        color: red;
    }

    span {
        ${paddingLeft}: 10px;
    }

    input {
        display: none;
    }
`;

// endregion
