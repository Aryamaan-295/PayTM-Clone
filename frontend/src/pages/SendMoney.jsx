import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";

const SendMoney = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [initial, setInitial] = useState("");
    const [amount, setAmount] = useState(0);
    const param = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:3000/api/v1/user/user", {
            params: {
                filter: param.userId,
            }
        })
            .then((response) => {
                const user = response.data.user;
                setFirstName(user.firstName);
                setLastName(user.lastName);
                setInitial(user.firstName[0].toUpperCase());
            })
    }, [])

    return (
        <div className="flex justify-center h-screen bg-gray-100">
            <div className="h-full flex flex-col justify-center">
                <div
                    className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg"
                >
                    <div className="flex flex-col space-y-1.5 p-6">
                    <h2 className="text-3xl font-bold text-center">Send Money</h2>
                    </div>
                    <div className="p-6 pt-0">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                        <span className="text-2xl text-white">{ initial }</span>
                        </div>
                        <h3 className="text-2xl font-semibold">{ firstName } { lastName }</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                        <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="amount"
                        >
                            Amount (in Rs)
                        </label>
                        <input
                            type="number"
                            min={0}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            id="amount"
                            placeholder="Enter amount"
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        </div>
                        <button 
                        onClick={async () => {
                            const token = localStorage.getItem("token");
                            const authString = "Bearer ".concat(token);
                            const response = await axios.post("http://localhost:3000/api/v1/account/transfer", {
                                amount: amount,
                                to: param.userId,
                            }, {
                                headers: {Authorization: authString}
                            })
                                .then(() => navigate('/dashboard'))
                        }}
                        className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white">
                            Initiate Transfer
                        </button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SendMoney;