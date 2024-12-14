import React from "react";

const Currency: React.FC<{ value: string }> = ({ value }) => {
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return <span>{new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(Number(value))}</span>;
};

export default Currency;
