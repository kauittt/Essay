const validate = (values, t) => {
    const errors = {};
    if (!values.username) {
        errors.username = t("errors:validation.emptyUsername");
    }
    if (!values.email) {
        errors.email = t("errors:validation.emptyEmail");
    } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
        errors.email = t("errors:validation.invalidEmail");
    }
    if (!values.url) {
        errors.url = t("errors:validation.emptyUrl");
    } else if (
        !/^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i.test(
            values.url
        )
    ) {
        errors.url = t("errors:validation.invalidUrl");
    }
    if (!values.password) {
        errors.password = t("errors:validation.emptyPassword");
    } else if (values.password !== "dragon") {
        errors.password = t("errors:validation.incorrectPassword");
    }
    if (!values.select) {
        errors.select = t("errors:validation.emptySelect");
    }

    return errors;
};

export default validate;
