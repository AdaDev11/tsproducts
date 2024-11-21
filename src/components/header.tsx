import React from "react";
import '../styles/header.css';

const Header: React.FC = () => {
    return (
        <div className = "container">
            <div className = "left">
                <span>Logo</span>
                <span>Logo Name</span>
            </div>
            <div className = "right">
                <input type='text' placeholder="search"/>
                <span>Card</span>
                <span>Burger menu</span>
            </div>
        </div>
    );
}

export default Header;