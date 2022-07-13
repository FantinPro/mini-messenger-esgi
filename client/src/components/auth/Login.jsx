import { VisibilityOff, Visibility } from '@mui/icons-material';
import { Box, Button, Container, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { UserContext } from '../../contexts/user.context';
import { authService } from '../../services/auth.service';
import logo from '../../../assets/images/messenger.png';

const validationSchema = yup.object().shape({
    email: yup
        .string('Enter your email')
        .email('Enter a valid email')
        .required('Email is required'),
    password: yup
        .string('Enter your password')
        .required('Password is required'),
});

export default function Login() {

    const { setUser } = useContext(UserContext);

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema,
        onSubmit: ({ email, password }, { setStatus }) => {
            authService
                .login(email, password)
                .then((res) => {
                    setUser(res.user);
                    navigate('/');
                })
                .catch((err) => {
                    let customError = "Something went wrong";
                    if (err.match(/identifiant/i)) {
                        customError = "Invalid credentials";
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
                    onSubmit={formik.handleSubmit}
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
                        Login
                    </Typography>
                    <Box sx={{ textAlign: 'center' }}>
                        <img src={logo} width='40' />
                    </Box>
                    <TextField
                        margin='dense'
                        fullWidth
                        type='email'
                        id="email"
                        label="Email"
                        variant="outlined"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email} />
                    <FormControl
                        fullWidth
                        margin='dense'
                        variant="outlined"
                        error={formik.touched.password && Boolean(formik.errors.password)}
                    >
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <OutlinedInput
                            id="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            value={formik.values.password}
                            onChange={formik.handleChange}
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
                            {formik.touched.password && formik.errors.password}
                        </FormHelperText>
                    </FormControl>



                    {formik.status ? <Typography sx={{
                        color: 'red'
                    }} variant='subtitle2'> {formik.status} </Typography> : null}


                    <Button sx={{
                        marginTop: '1rem'
                    }} fullWidth variant="contained" type='submit'>Login</Button>
                    <Typography mt={2} variant="subtitle1" gutterBottom component="div">
                        Don&apos;t have an account yet ?
                    </Typography>
                    <Typography
                        sx={{
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            fontWeight: 'bold',
                            width: 'fit-content',
                        }}
                        onClick={() => navigate('/register')}
                        variant="subtitle1" color={'primary'} gutterBottom component="div">
                        Register
                    </Typography>
                </Box>
            </Container>

        </Box>
    );
}