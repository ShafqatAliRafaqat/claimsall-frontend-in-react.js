import React from 'react';
import { Spin, Button } from 'antd';

const Loading = (props) => {
    if (props.error) {
        return <div>Error! <Button onClick={props.retry}>Retry</Button></div>;
    }
    else if (props.timedOut) {
        return <div>Taking a long time... <Button onClick={props.retry}>Retry</Button></div>;
    }
    else if (props.pastDelay) {
        return <Spin size="large" />;
    } else {
        return null;
    }
};

export default Loading;