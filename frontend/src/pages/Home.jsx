import React from 'react';
import '../styles/Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <div className="animated-bg"></div>
            <div className="title-card">
                <h1 className="title">ItemStore</h1>
                <p className="subtitle">Your one-stop inventory solution</p>
            </div>
        </div>
    );
};

export default Home;
