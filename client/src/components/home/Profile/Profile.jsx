import React, { Component } from 'react';
import { Box } from '@mui/system';
import { Autocomplete, Button, FormControl, FormHelperText, InputAdornment, InputLabel, OutlinedInput, TextField, Typography, IconButton, Alert } from '@mui/material';
import * as yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { interestService } from '../../../services/interest.service';
import { useEffect } from 'react';
import { UserContext } from '../../../contexts/user.context';
import { useFormik } from 'formik';
import EditIcon from '@mui/icons-material/Edit';
import { useCallback } from 'react';
import { userService } from '../../../services/user.service';
import EditPassword from './EditPassword/EditPassword';

const validationSchema = yup.object({
    username: yup
        .string('Enter your username')
        .required('Username is required')
        .min(3)
        .max(20),
    interests: yup.array().min(1, "at least 1 language is required").required("Interests are required"),
});

export default function Profile() {

    const { user, setUser } = useContext(UserContext);

    const navigate = useNavigate();

    const [programmingLanguages, setProgrammingLanguages] = useState([]);

    const [profileUpdated, setProfileUpdated] = useState(false);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        interestService.getAllInterests().then(res => {
            setProgrammingLanguages(res);
        });
    }, [])

    const handleInterests = useCallback((event, value) => {
        formik.setFieldValue('interests', value);
    })

    const formik = useFormik({
        initialValues: {
            email: user.email,
            username: user.username,
            password: 'fakepasswordlol',
            interests: user.interests?.map(({ UserInterest, ...rest }) => rest) || [],
        },
        validationSchema,
        onSubmit: ({ username, interests }, { setStatus }) => {
            userService.updateProfile({ username, interests }).then(res => {
                setProfileUpdated(true);
                setUser(res);
            }).catch(err => {
                let customError = "error occured, try again";
                setProfileUpdated(false);
                if (err.match(/username/)) {
                    customError = "Username is already taken";
                }
                setStatus(customError) 
            })
        }
    });

    return (
        <Box sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
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
                    Profile
                </Typography>
                <Box sx={{ textAlign: 'center' }}>
                    <img src={user.avatar} width='40' />
                </Box>
                <Alert severity="success" sx={{ width: '100%', display: profileUpdated ? 'flex': 'none' }}>
                    Profile updated successfully!
                </Alert>
                <TextField
                    disabled
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
                <TextField
                    margin='dense'
                    fullWidth
                    type='username'
                    id="username"
                    label="Username"
                    variant="outlined"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    error={formik.touched.username && Boolean(formik.errors.username)}
                    helperText={formik.touched.username && formik.errors.username} />
                <FormControl
                    fullWidth
                    margin='dense'
                    variant="outlined"
                    error={formik.touched.password && Boolean(formik.errors.password)}
                >
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <OutlinedInput
                        readOnly
                        id="password"
                        label="Password"
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleOpen}
                                    edge="end"
                                >
                                    <EditIcon />
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
                        isOptionEqualToValue={(option, value) => option.id === value.id}
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
                }} fullWidth variant="contained" type='submit'>Save</Button>

                <EditPassword open={open} handleClose={handleClose} handleOpen={handleOpen} setProfileUpdated={setProfileUpdated} />

            </Box>

        </Box>
    );
}