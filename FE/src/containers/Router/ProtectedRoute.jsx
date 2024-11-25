import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoute = ({
    component: Component,
    isAllowed,
    redirectTo,
    ...rest
}) => (
    <Route
        {...rest}
        render={(props) =>
            isAllowed ? <Component {...props} /> : <Redirect to={redirectTo} />
        }
    />
);

ProtectedRoute.propTypes = {
    component: PropTypes.elementType.isRequired,
    isAllowed: PropTypes.bool.isRequired,
    redirectTo: PropTypes.string.isRequired,
};

export default ProtectedRoute;
