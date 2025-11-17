import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";

const Login = () => {
  const { loginUser, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();

  // Already logged in হলে সরাসরি admin panel এ পাঠাবে
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    const success = await loginUser(data);
    if (success) {
      navigate("/admind"); // LOGIN SUCCESS → REDIRECT
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold">Sign in</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">

            <div className="form-control">
              <label className="label"><span>Email</span></label>
              <input
                type="email"
                className="input input-bordered w-full"
                {...register("email", { required: "Email required" })}
              />
              {errors.email && <p className="text-error">{errors.email.message}</p>}
            </div>

            <div className="form-control">
              <label className="label"><span>Password</span></label>
              <input
                type="password"
                className="input input-bordered w-full"
                {...register("password", { required: "Password required" })}
              />
              {errors.password && <p className="text-error">{errors.password.message}</p>}
            </div>

            <button className="btn btn-primary w-full">Login</button>
          </form>

          <p className="mt-4 text-center">
            Don’t have an account?
            <Link to="/register" className="link link-primary ml-1">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
