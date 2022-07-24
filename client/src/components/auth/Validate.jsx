import React, { Component } from 'react';
import { useQuery } from '../../hooks/useQuery';
import { useEffect } from 'react';
import { authService } from '../../services/auth.service';
import { useNavigate } from 'react-router-dom';

export const Validate = () => {
    const query = useQuery();

    const navigate = useNavigate();

    const token = query.get('token');

    useEffect(() => {
        authService.validateToken(token).then(res => {
            navigate('/login')
        })
            .catch(err => {
                console.log(err)
            })
    }, [])
}