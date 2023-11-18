import "./layout.css"
const Layout = ({children}: {children: React.ReactNode}) => {
    return (
        <div className="layout-container">
            <div className="layout-main">
                {children}
            </div>
        </div>
    )
}

export default Layout