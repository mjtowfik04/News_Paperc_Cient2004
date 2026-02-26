import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { toast } from "react-toastify";

const Register = () => {
  const { registerUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);

    const res = await registerUser(data);

    if (res.success) {
      toast.success("Account created successfully 🎉");
      navigate("/login");
    } else {
      if (res.errors) {
        Object.entries(res.errors).forEach(([field, message]) => {
          setError(field, { message: message[0] });
        });
      } else {
        toast.error("Signup failed");
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-center">
            Sign Up
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">

            <input
              className="input input-bordered w-full"
              placeholder="First Name"
              {...register("first_name", { required: "First name required" })}
            />
            {errors.first_name && (
              <p className="text-error text-sm">{errors.first_name.message}</p>
            )}

            <input
              className="input input-bordered w-full"
              placeholder="Last Name"
              {...register("last_name", { required: "Last name required" })}
            />
            {errors.last_name && (
              <p className="text-error text-sm">{errors.last_name.message}</p>
            )}

            <input
              type="email"
              className="input input-bordered w-full"
              placeholder="Email"
              {...register("email", { required: "Email required" })}
            />
            {errors.email && (
              <p className="text-error text-sm">{errors.email.message}</p>
            )}

            <input
              type="password"
              className="input input-bordered w-full"
              placeholder="Password"
              {...register("password", {
                required: "Password required",
                minLength: {
                  value: 8,
                  message: "Minimum 8 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-error text-sm">{errors.password.message}</p>
            )}

            <button className="btn btn-primary w-full" disabled={loading}>
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center mt-4 text-sm">
            Already have an account?
            <Link to="/login" className="link link-primary ml-1">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;