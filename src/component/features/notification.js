import React, { useEffect } from 'react';
import { notification } from 'antd';

export default function Notification(props) {

    const [api, contextHolder] = notification.useNotification();
    const {type, message, description}=props

    const openNotificationWithIconSubmit = () => {
        api[type]({
            message: message,
            description: description,
            showProgress: true,
            pauseOnHover: true,
        });    
    };

    useEffect(() => {
        if (type) { // Only trigger if props.type has a value
            openNotificationWithIconSubmit();
        }
    }, [type]); // Run when props.type changes

    return <>{contextHolder}</>;
}