import { selectAuth, setUser } from "../../redux/reducer";
import { useSubmitLoginMutation } from "@/redux/api";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { fetchEmployees } from "@/redux/action";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "#3498db",
};

const LoginForm: React.FC = () => {
  //Spinner 
  let [loading, setLoading] = useState<boolean>(true);
  let [color, setColor] = useState<string>("#ffffff");

  //RTQ query related stuff
  const [formData, { data: loginData, isSuccess, isError, error }] =
    useSubmitLoginMutation();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  //React-hook-form related stuff
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  //submit login form
  const onSubmit = (data: {}) => {
    formData(data);
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        setUser({ info: loginData.data, token: loginData.data.token })
      );
      let checkError = dispatch(fetchEmployees());

      checkError.then((response) => {
        if (response.error !== null || response.error !== undefined) {
          toast.warning(response.error);
          navigate("/admin/dashboard");
        } else {
          toast.success(loginData.message);
          navigate("/admin/dashboard");
        }
      })


    }

    if (isError) {
      toast.warning(error.data.message);
    }
  }, [isSuccess, isError]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
              id="email"
              type="text"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs italic">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none"
              id="password"
              type="password"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs italic">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between">
            {typeof loginData !== "undefined" ? (
              <ClipLoader
                color={color}
                loading={loading}
                cssOverride={override}
                size={50}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            ) : (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Sign In
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
