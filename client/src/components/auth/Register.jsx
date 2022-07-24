import { VisibilityOff, Visibility } from '@mui/icons-material';
import { Autocomplete, Box, Button, Container, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { UserContext } from '../../contexts/user.context';
import { authService } from '../../services/auth.service';
import { interestService } from '../../services/interest.service';
import logo from '../../../assets/images/messenger.png';

const validationSchema = yup.object({
    email: yup
        .string('Enter your email')
        .email('Enter a valid email')
        .required('Email is required'),
    password: yup.string()
        .required('No password provided.')
        .matches(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
            'Password should contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character'
        ),
    interests: yup.array().min(1, "at least 1 language is required").required("Interests are required"),
});

export default function Register() {

    const { setUser } = useContext(UserContext);

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const [programmingLanguages, setProgrammingLanguages] = useState([]);

    useEffect(() => {
        interestService.getAllInterests().then(res => {
            setProgrammingLanguages(res);
        });
    }, [])

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            interests: [],
        },
        validationSchema,
        onSubmit: ({ email, password, interests }, { setStatus }) => {
            authService
                .register({ email, password, interests })
                .then((res) => {
                    setUser(res.user);
                    navigate('/');
                })
                .catch((err) => {
                    let customError = "Something went wrong";
                    if (err.match(/email/)) {
                        customError = "Email already exists";
                    }
                    setStatus(customError);
                });
        }
    });

    const handleInterests = useCallback((event, value) => {
        formik.setFieldValue('interests', value);
    }) 

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
                        Register
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
                        onBlur={formik.handleBlur}
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
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
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
                        <FormHelperText error >
                            {formik.touched.password && formik.errors.password}
                        </FormHelperText>
                    </FormControl>

                    <FormControl fullWidth margin='dense'>
                        <Autocomplete
                            variant="outlined"
                            multiple
                            id="interests"
                            options={programmingLanguages}
                            getOptionLabel={(option) => option.title}
                            value={formik.values.interests}
                            onChange={handleInterests}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Favorite programming languages"
                                    placeholder="Favorite programming languages"
                                />
                            )}
                        />
                        <FormHelperText error >
                            {formik.touched.interests && formik.errors.interests}
                        </FormHelperText>
                    </FormControl>

                    {formik.status ? <Typography sx={{
                        color: 'red'
                    }} variant='subtitle2'> {formik.status} </Typography> : null}


                    <Button sx={{
                        marginTop: '1rem'
                    }} fullWidth variant="contained" type='submit'>Register</Button>
                    <Typography mt={2} variant="subtitle1" gutterBottom component="div">
                        Already have an account ?
                    </Typography>
                    <Typography
                        sx={{
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            fontWeight: 'bold',
                            width: 'fit-content',
                        }}
                        onClick={() => navigate('/login')}
                        variant="subtitle1" color={'primary'} gutterBottom component="div">
                        Login
                    </Typography>
                </Box>
            </Container>

        </Box>
    );
}