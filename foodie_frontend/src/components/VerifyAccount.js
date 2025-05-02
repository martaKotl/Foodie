import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import UserService from "../services/UserService";

const VerifyAccount = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [message, setMessage] = useState("Verifing...");

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await UserService.activateAccount({ params: { token } });
                const result = response.data;

                if (result.success) {
                    setMessage("Account is active!");
                } else {
                    setMessage(`Error while activation: ${result.message}`);
                }
            } catch (error) {
                if (error.response && error.response.data?.message) {
                    setMessage(`Error while activation: ${error.response.data.message}`);
                } else {
                    setMessage("No server connection.");
                }
            }
        };

        if (token) verifyToken();
        else setMessage("No token in URL address.");
    }, [token]);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>{message}</h2>
        </div>
    );
};

export default VerifyAccount;
