import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import AuthService from "../services/auth.service";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { FloatingLabel, Form } from "react-bootstrap";

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required')
    .email('Username is not a valid email')
    .min(6, 'Username must be at least 6 characters')
    .max(40, 'Username must not exceed 40 characters'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(40, 'Password must not exceed 40 characters'),
});

const Login = () => {
  let navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = data => {
    //console.log(JSON.stringify(data, null, 2));

    setMessage("");
    setLoading(true);

    AuthService.login(data.username, data.password).then(
      () => {
        navigate("/profile");
        window.location.reload();
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setLoading(false);
        setMessage(resMessage);
      }
    );
  };

  return (
    <div className="col-md-12">
      <div className="card card-container">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        />

        <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Email</label>
            <input
              name="username" //sent to api 
              type="email"
              {...register('username')}
              className={`form-control ${errors.username ? 'is-invalid' : ''}`}
            />
          
          <div className="invalid-feedback">{errors.username?.message}</div>
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            name="password"
            type="password"
            {...register('password')}
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.password?.message}</div>
        </div>

          <div className="form-group">
            <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
              {loading && (
                <span className="spinner-border spinner-border-sm"></span>
              )}
              <span>Login</span>
            </button>
          </div>

          {message && (
            <div className="form-group">
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
