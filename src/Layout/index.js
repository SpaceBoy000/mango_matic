import './style.css'

import Header from '../Home/components/Header'

const Layout = (props) => {
  
    return (
        <div>
            <div className="header_part">
                <Header/>
            </div>
            <div className="main_content">{props.children}</div>
        </div>
    )
  }
  export default Layout