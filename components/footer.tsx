const Footer = () => {
    return (
        <footer className="bg-white border-1">
            <div className="mx-auto py-10">
                <p className="text-center text-xs text-black">
                    &copy; {new Date().getFullYear()} Ecommerce Shop
                </p>
            </div>
        </footer>
    )
}

export default Footer