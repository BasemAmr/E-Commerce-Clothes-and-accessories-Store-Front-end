import React from "react";

const Currency: React.FC<{ value: string }> = ({ value }) => {
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value))}</span>;
};


export default Currency;