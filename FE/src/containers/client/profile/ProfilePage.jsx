import React, { useEffect, useState } from "react";
import {
    FormContainer,
    FormButtonToolbar,
} from "@/shared/components/form/FormElements";
import { Col, Container, Row } from "react-bootstrap";
import { Button } from "@/shared/components/Button";
import { Form } from "react-final-form";
import {
    Card,
    CardBody,
    CardTitleWrap,
    CardTitle,
} from "@/shared/components/Card";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import CustomForm from "@/shared/components/custom/form/CustomForm";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/reducers/userSlice";
import { updateCurrentUser } from "../../../redux/actions/userAction";
import Loading from "./../../../shared/components/Loading";
import axios from "@/utils/axiosConfig";

const ProfilePage = () => {
    const { t } = useTranslation(["common", "errors", "store"]);
    const enter = t("action.enter");
    const update = t("action.update");
    const action = "update";
    const dispatch = useDispatch();

    let user = useSelector(selectUser);

    //! User data
    useEffect(() => {
        const authorities = user?.authorities[0]?.authority;
        setFormData({ ...user, authorities });
    }, [user]);
    //! -----------------------

    const [formData, setFormData] = useState(null);

    //! Location
    const [provinces, setProvinces] = useState(null);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const handleProvinceChange = async (e) => {
        const provinceCode = e;

        try {
            const response = await axios.get(
                `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
            );
            // console.log("response", response);
            setDistricts(response.data.districts);
            setWards([]);
        } catch (error) {
            console.error("Error fetching districts:", error);
        }
    };

    const handleDistrictChange = async (e) => {
        const districtCode = e;

        // Fetch wards based on selected district
        try {
            const response = await axios.get(
                `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
            );
            setWards(response.data.wards); // Lưu wards từ API
        } catch (error) {
            console.error("Error fetching wards:", error);
        }
    };

    useEffect(() => {
        if (!user) return;

        const fetchProvinces = async () => {
            try {
                const response = await axios.get(
                    "https://provinces.open-api.vn/api/p/"
                );
                setProvinces(response.data);
            } catch (error) {
                console.error("Error fetching provinces:", error);
            }
        };
        const fetchDistricts = async () => {
            try {
                const response = await axios.get(
                    `https://provinces.open-api.vn/api/p/${user.province}?depth=2`
                );
                setDistricts(response.data.districts);
            } catch (error) {
                console.error("Error fetching provinces:", error);
            }
        };
        const fetchWards = async () => {
            try {
                const response = await axios.get(
                    `https://provinces.open-api.vn/api/d/${user.district}?depth=2`
                );
                setWards(response.data.wards); // Lưu wards từ API
            } catch (error) {
                console.error("Error fetching provinces:", error);
            }
        };

        fetchProvinces();
        user.district && fetchDistricts();
        user.ward && fetchWards();
    }, [user]);
    //! ---------------------

    if (!user || !provinces) {
        return <Loading></Loading>;
    }

    // console.log("Form data", formData);

    const submitForm = async (values) => {
        // console.log("Root -----------");
        // console.log(values);

        //* Process values before dispatching
        let processedValues = Object.keys(values).reduce((acc, key) => {
            if (
                typeof values[key] === "object" &&
                values[key] !== null &&
                "value" in values[key]
            ) {
                acc[key] = values[key].value;
            } else {
                if (typeof values[key] === "boolean") {
                    acc[key] = values[key] ? 1 : 0;
                } else {
                    acc[key] = values[key];
                }
            }
            return acc;
        }, {});

        // console.log("processedValues 1", processedValues);

        processedValues = {
            id: processedValues.id,

            username: processedValues.username,
            password: processedValues.password,
            // <authority></authority>
            email: processedValues.email,

            name: processedValues.name,
            phone: processedValues.phone,

            address: processedValues.address,
            province: processedValues.province,
            district: processedValues.district,
            ward: processedValues.ward,

            image: processedValues.image,
        };

        // console.log("process -----------");
        // console.log("processedValues 2", processedValues);

        const actionText =
            action === "new" ? t("common:action.add") : t("common:action.edit");

        try {
            let response;

            response = await dispatch(updateCurrentUser(processedValues));

            if (response) {
                // dispatch(fetchUsers());
                // dispatch(fetchCurrentUser());
                toast.info(t("common:action.success", { type: actionText }), {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                // toggle();
            }
        } catch (e) {
            // console.log(e);
            const message = e.response.data.message;
            // console.log("message", message);

            const field = message.includes("Email")
                ? t("store:user.email")
                : message.includes("Username")
                ? t("store:user.username")
                : message.includes("Phone")
                ? t("store:user.phone")
                : null;

            const action = t("common:action.edit");

            const myError = field
                ? t("errors:validation.fieldExisted", { field: field })
                : t("common:action.fail", { type: action });

            toast.error(myError),
                {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                };
        }
    };

    const validate = (values, t) => {
        // console.log("Validate values", values);
        const errors = {};

        const requiredFields = [
            "username",
            "email",
            "name",
            "phone",
            "address",
            "image",
            "province",
            "district",
            "ward",
        ];
        //* Empty
        requiredFields.forEach((field) => {
            if (!values[field]) {
                errors[field] = t("errors:validation.required");
            }
        });

        //* Validate
        if (!/^0\d{9}$/.test(values.phone)) {
            errors.phone = t("errors:validation.invalidPhone");
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
            errors.email = t("errors:validation.invalidEmail");
        }

        const passwordPattern =
            /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}$/;
        if (values.password && !passwordPattern.test(values.password)) {
            errors.password = t("errors:validation.invalidFormatPassword");
        }

        // console.log("Erros", errors);
        return errors;
    };

    const leftFields = [
        {
            label: t("store:user.username"),
            name: "username",
            type: "text",
            placeholder: `${enter} ${t("store:user.username")}`,
        },
        {
            label: t("store:user.password"),
            name: "password",
            type: "text",
            placeholder: `${update} ${t("store:user.password")}`,
        },
        {
            label: t("store:user.role"),
            name: "authorities",
            type: "select",
            options: [
                { value: "ROLE_STAFF", label: t("store:user.staff") },
                { value: "ROLE_ADMIN", label: t("store:user.admin") },
                { value: "ROLE_USER", label: t("store:user.user") },
            ],
            disabled: true,
        },
        {
            label: t("store:user.email"),
            name: "email",
            type: "text",
            placeholder: `${enter} ${t("store:user.email")}`,
        },
        {
            label: t("store:user.name"),
            name: "name",
            type: "text",
            placeholder: `${enter} ${t("store:user.name")}`,
        },
        {
            label: t("store:user.phone"),
            name: "phone",
            type: "text",
            placeholder: `${enter} ${t("store:user.phone")}`,
        },
    ];

    const rightFields = [
        {
            label: t("store:location.province"),
            name: "province",
            type: "select",
            options: provinces.map((province) => {
                return { value: province.code + "", label: province.name };
            }),
            myOnChange: handleProvinceChange,
        },
        {
            label: t("store:location.district"),
            name: "district",
            type: "select",
            options: districts.map((district) => {
                return { value: district.code + "", label: district.name };
            }),
            myOnChange: handleDistrictChange,
        },
        {
            label: t("store:location.ward"),
            name: "ward",
            type: "select",
            options: wards.map((ward) => {
                return { value: ward.code + "", label: ward.name };
            }),
        },
        {
            label: t("store:user.address"),
            name: "address",
            type: "text",
            placeholder: `${enter} ${t("store:user.address")}`,
        },
        {
            label: t("store:product.image"),
            name: "image",
            type: "importFile",
            placeholder: `${enter} ${t("store:product.image")}`,
        },
    ];

    // console.log("provinces", provinces);
    // console.log("districts", districts);
    // console.log("wards", wards);
    // console.log("-----");
    return (
        <Container>
            <Form
                onSubmit={submitForm}
                initialValues={formData}
                validate={(values) => validate(values, t)}
            >
                {({ handleSubmit, form }) => {
                    return (
                        <FormContainer onSubmit={handleSubmit}>
                            <Col md={12} lg={12}>
                                <Card style={{ marginBottom: "0px" }}>
                                    <CardBody>
                                        <CardTitleWrap>
                                            <CardTitle>
                                                {t("store:user.information")}
                                            </CardTitle>
                                        </CardTitleWrap>
                                        <CustomForm
                                            leftFields={leftFields}
                                            rightFields={rightFields}
                                            min={99}
                                            max={99}
                                            isButton={false}
                                        ></CustomForm>

                                        {/*//* Button  */}
                                        <FormButtonToolbar
                                            style={{
                                                width: "100%",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                gap: "20px",
                                            }}
                                        >
                                            {/*//* Submit */}
                                            <Button
                                                variant="success"
                                                type="submit"
                                                // onClick={() =>
                                                //     console.log("submit")
                                                // }
                                                style={{ margin: "0px" }}
                                            >
                                                {t("action.save")}
                                            </Button>
                                        </FormButtonToolbar>
                                    </CardBody>
                                </Card>
                            </Col>
                        </FormContainer>
                    );
                }}
            </Form>
        </Container>
    );
};

ProfilePage.propTypes = {
    toggle: PropTypes.func,
    action: PropTypes.string,
    data: PropTypes.object,
};

export default ProfilePage;
