import Footer from "../components/Footer"
import Header from "../components/Header"
import Hero from "../components/Hero"
import Searchbar from "../components/Searchbar";


//acecept any react component
interface Props {
    children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
    return (
        // min-h-screen keeps the header a top and footer on the bottom
        // sets the minimum height of an element to cover the entire viewport height (screen height). 
        <div className="flex flex-col min-h-screen">
            <Header />
            <Hero />
            <div className="container mx-auto ">
                <Searchbar />
            </div>
            {/* this div will take the whole up space bcz of flex-1 */}
            <div className="container mx-auto flex-1 py-10">
                {children}
            </div>
            <Footer />
        </div>
    )
}

export default Layout
