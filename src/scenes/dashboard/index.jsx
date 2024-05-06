import { Box } from '@mui/material';
import Header from '../../components/Headers';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Dashboard = () =>{
    const [sessionId, setSessionId] = useState(""); // State to store session ID
    const navigate = useNavigate();

    useEffect(() => {
        const newSessionId = "random_session_id"; // Generate or retrieve session ID from server
        setSessionId(newSessionId);

        const handleLogout = () => {
            setSessionId(""); // Clear session ID
            Swal.fire({
                icon: "info",
                title: "Logged Out",
                text: "You have been logged out.",
            });
            navigate("/");
        };

        const logoutTimer = setTimeout(() => {
            handleLogout(); // Logout after the timeout
        }, 10 * 1000); // 10 seconds in milliseconds
    
        return () => clearTimeout(logoutTimer); // Cleanup timer on component unmount
    }, [navigate]);
    
    return (
        <Box>
            <Box>
                <Header title="DASHBOARD" subtitle="Herzlich willkommen bei FiBuTronic. Guten Tag!" />
            </Box>
            {/* Add your dashboard content here */}
        </Box>
    )
}

export default Dashboard;
