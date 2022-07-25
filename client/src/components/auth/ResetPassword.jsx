import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, Container, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, Typography } from '@mui/material';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';
import logo from '../../../assets/images/messenger.png';
import { userService } from '../../services/user.service';

const validationSchemaResetPassword = yup.object({
    password: yup.string().min(8, 'Password should be at least 8 characters').required('Password is required'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
});

export default function ResetPassword() {

    const navigate = useNavigate();

    let [searchParams] = useSearchParams();

    const [showPassword, setShowPassword] = useState(false);
    const [token] = useState(searchParams.get('token'));

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const formikResetPassword = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema: validationSchemaResetPassword,
        onSubmit: ({ password }, { setStatus }) => {
            userService.resetPassword(token, password).then(res => {
                navigate("/login")
            }).catch((err) => {
                let customError = "Something went wrong";
                if (err.match(/token/)) {
                    customError = "Invalid token";
                }
                setStatus(customError);
            });
        }
    });

    return (
        <Box sx={
            {
                minHeight: 'inherit',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }
        }
        >
            <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box
                    component="form"
                    onSubmit={formikResetPassword.handleSubmit}
                    sx={{
                        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                        borderRadius: '10px',
                        padding: '20px',
                        width: 500
                    }}
                >
                    <Typography sx={{
                        textAlign: 'center',
                    }} variant="h6" gutterBottom component="div">
                        Reset password
                    </Typography>
                    <Box sx={{ textAlign: 'center' }}>
                        <img src={logo} width='40' />
                    </Box>
                    <FormControl
                        fullWidth
                        margin='dense'
                        variant="outlined"
                        error={formikResetPassword.touched.password && Boolean(formikResetPassword.errors.password)}
                    >
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <OutlinedInput
                            id="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            value={formikResetPassword.values.password}
                            onChange={formikResetPassword.handleChange}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        <FormHelperText error id="accountId-error">
                            {formikResetPassword.touched.password && formikResetPassword.errors.password}
                        </FormHelperText>
                    </FormControl>

                    <FormControl
                        fullWidth
                        margin='dense'
                        variant="outlined"
                        error={formikResetPassword.touched.confirmPassword && Boolean(formikResetPassword.errors.confirmPassword)}
                    >
                        <InputLabel htmlFor="password">Confirm Password</InputLabel>
                        <OutlinedInput
                            id="confirmPassword"
                            label="confirmPassword"
                            type={showPassword ? 'text' : 'password'}
                            value={formikResetPassword.values.confirmPassword}
                            onChange={formikResetPassword.handleChange}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        <FormHelperText error id="accountId-error">
                            {formikResetPassword.touched.confirmPassword && formikResetPassword.errors.confirmPassword}
                        </FormHelperText>
                    </FormControl>

                    {formikResetPassword.status ? <Typography sx={{
                        color: 'red'
                    }} variant='subtitle2'> {formikResetPassword.status} </Typography> : null}


                    <Button sx={{
                        marginTop: '1rem'
                    }} fullWidth variant="contained" type='submit'>Update password</Button>

                    <Typography
                        sx={{
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            fontWeight: 'bold',
                            width: 'fit-content',
                        }}
                        mt={2}
                        onClick={() => navigate('/login')}
                        variant="subtitle1" color={'primary'} gutterBottom component="div">
                        Login
                    </Typography>

                </Box>
            </Container>

        </Box>
    );
}