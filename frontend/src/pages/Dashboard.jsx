import { useEffect, useState } from "react";
import Appbar from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import axios from 'axios';

function Dashboard() {
    const [initial, setInitial] = useState();
    const [balance, setBalance] = useState();

    const token = localStorage.getItem("token");
    const authString = "Bearer ".concat(token);

    useEffect(() => {
        axios.get('http://localhost:3000/api/v1/account/balance', { headers: { Authorization: authString}})
            .then((response) => {
                const newBalance = Math.round(response.data.balance*100)/100;
                const newInitial = response.data.firstName[0];
                setBalance(newBalance);
                setInitial(newInitial.toUpperCase());
            })
    }, [])

    return (
        <div className="px-2 pt-1">
            <Appbar initial={ initial } />
            <Balance value={ balance } />
            <Users />
        </div>
    )
}

export default Dashboard;