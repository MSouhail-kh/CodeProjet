import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Refresh = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Récupérer la dernière page visitée avant refresh
        const lastPage = sessionStorage.getItem("lastPage");
        
        // Rediriger vers la dernière page après un court délai
        setTimeout(() => {
            navigate(lastPage || "/");
        }, 100);
    }, [navigate]);

    return <div>Rechargement...</div>;
};

export default Refresh;
