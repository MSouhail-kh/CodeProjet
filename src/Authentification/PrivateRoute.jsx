import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const PrivateRoute = ({ element }) => {
    const { authState } = useContext(AuthContext);

    return authState.token ? element : <Navigate to="/" />;
};

export default PrivateRoute;
