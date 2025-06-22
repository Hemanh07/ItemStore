import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navigation.css';

const Navigation = () => {
    const location = useLocation();

    const isActive = (path) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <nav className="navigation">


            <div className="nav-links">
                <Link
                    to="/"
                    className={`nav-link ${isActive('/') && location.pathname === '/' ? 'active' : ''}`}
                >
                    <span className="nav-icon">🏠</span>
                    <span className="nav-text">Home</span>
                </Link>



                <Link
                    to="/items"
                    className={`nav-link ${isActive('/items') ? 'active' : ''}`}
                >
                    <span className="nav-icon">📦</span>
                    <span className="nav-text">Items</span>
                </Link>

                <Link
                    to="/add-item"
                    className={`nav-link ${isActive('/add-item') ? 'active' : ''}`}
                >
                    <span className="nav-icon">➕</span>
                    <span className="nav-text">Add Item</span>
                </Link>
            </div>
        </nav>
    );
};

export default Navigation;