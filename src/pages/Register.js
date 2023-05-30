import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import AuthService from "../services/auth.service";

const validationSchema = Yup.object().shape({
  //firstName: Yup.string().required('Fullname is required'),
  //lastName: Yup.string().required('Fullname is required'),
  email: Yup.string()
    .required('Email is required')
    .email('Email is invalid'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(40, 'Password must not exceed 40 characters'),
  confirmPassword: Yup.string()
    .required('Confirm Password is required')
    .oneOf([Yup.ref('password'), null], 'Confirm Password does not match'),
});

const Register = () => {
  let navigate = useNavigate();

  const firstName = "Test1";
  const lastName = "TTest2";
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = async data => {

    setMessage("");
    setSuccessful(false);

    try{
      let response = await AuthService.register(firstName, lastName, data.email, data.password);
      console.log(response);
      setMessage("Successfully created an account!");
      setSuccessful(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000)
    }catch(error){
      setMessage(error.response.data);
      setSuccessful(false);
    }
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
          {!successful && (
            <div>

              <div className="form-group">
                <label>Email</label>
                <input
                  name="email"
                  type="text"
                  {...register('email')}
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                />
                <div className="invalid-feedback">{errors.email?.message}</div>
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
                <label>Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  {...register('confirmPassword')}
                  className={`form-control ${
                    errors.confirmPassword ? 'is-invalid' : ''
                  }`}
                />
                <div className="invalid-feedback">
                  {errors.confirmPassword?.message}
                </div>
              </div>

              <div className="form-group">
                <button className="btn btn-primary btn-block" type="submit">Sign Up</button>
              </div>
            </div>
          )}

          {message && (
            <div className="form-group">
              <div
                className={ successful ? "alert alert-success" : "alert alert-danger" }
                role="alert"
              >
                {message}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
