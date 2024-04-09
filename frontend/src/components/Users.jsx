import { useEffect, useState } from "react"
import { SubmitButton } from "./SubmitButton";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const Users = () => {
    // Replace with backend call
    const [users, setUsers] = useState([]);

    useEffect(() =>  {
        const token = localStorage.getItem("token");
        const authString = "Bearer ".concat(token);
        axios.get('http://localhost:3000/api/v1/user/bulk',{
            headers: {
                Authorization: authString,
            }
        } ,{
            params: {
                filter: "",
            }
        })
            .then((response) => {
                setUsers(response.data.users);
            })
    },[])

    return (
        <>
            <div className="font-bold mt-4 text-lg">
                Users
            </div>
            <div className="my-2">
                <input type="text" placeholder="Search users..." onChange={async (e) => {
                    const token = localStorage.getItem("token"); 
                    const authString = "Bearer ".concat(token);
                    const response = await axios.get('http://localhost:3000/api/v1/user/bulk', {
                        headers: {
                            Authorization: authString,
                        },
                        params: {
                            filter: e.target.value,
                        }
                    });
                    setUsers(response.data.users);
                }} className="w-full px-2 py-1 border rounded border-slate-200"></input>
            </div>
            <div>
                {users.map(user => <User user={user} key={users.indexOf(user)} />)}
            </div>
        </>
    )
}

function User({user}) {
    const navigate = useNavigate(); 
    
    return (
        <div className="flex justify-between">
            <div className="flex">
                <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                    <div className="flex flex-col justify-center h-full text-xl">
                        {user.firstName[0]}
                    </div>
                </div>
                <div className="flex flex-col justify-center h-ful">
                    <div>
                        {user.firstName} {user.lastName}
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center h-ful">
                <SubmitButton label={"Send Money"} onClick={() => {
                    navigate(`/send/${ user.id }`)
                }} />
            </div>
        </div>
    )
}