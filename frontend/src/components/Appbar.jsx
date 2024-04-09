import { useNavigate } from "react-router-dom";

const Appbar = ({ initial }) => {
    const navigate = useNavigate();
    return (
        <div className="shadow h-14 flex justify-between">
            <div className="flex flex-col justify-center h-full ml-4">
                PayTM App
            </div>
            <div className="flex">
                <div className="flex mr-6 items-center">
                    <button onClick={() => {
                        localStorage.removeItem("token");
                        navigate('/signin');
                    }} className="h-10 px-2 py-0 border rounded-md text-white bg-slate-700 hover:bg-slate-800">Sign Out</button>
                </div>
                <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                    <div className="flex flex-col justify-center h-full text-xl">
                        { initial }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Appbar