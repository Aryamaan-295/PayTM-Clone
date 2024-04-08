import { useState } from "react"
import { BottomWarning } from "../components/BottomWarning"
import Heading from "../components/Heading"
import InputBox from "../components/InputBox"
import SubHeading from "../components/SubHeading"
import { SubmitButton } from "../components/SubmitButton"
import { useNavigate } from "react-router-dom"
import axios from 'axios'

const Signup = () => {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate();

    return (
    <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                <Heading label={"Sign Up"} />
                <SubHeading label={"Enter your information to create an account"} />
                <InputBox placeholder="John" label={"First Name"} onChange = {(e) => setFirstName(e.target.value)} />
                <InputBox placeholder="Doe" label={"Last Name"} onChange = {(e) => setLastName(e.target.value)} />
                <InputBox placeholder="johndoe@example.com" label={"Email"} onChange = {(e) => setUsername(e.target.value)} />
                <InputBox placeholder="" label={"Password"} onChange = {(e) => setPassword(e.target.value)} />
                <div className="pt-4">
                    <SubmitButton label={"Sign Up"} onClick={ async () => {
                        const response = await axios.post('http://localhost:3000/api/v1/user/signup', {
                            username,
                            firstName,
                            lastName,
                            password,
                        });
                        localStorage.setItem("token", response.data.token);
                        navigate("/dashboard");
                    }} />
                </div>
                <BottomWarning label={"Don't have an account?"} buttonText={"Sign In"} to={"/signin"} />
            </div>
        </div>
    </div>
    )
}

export default Signup;