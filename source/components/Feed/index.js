// Core
import React from 'react';

// Components
import * as Components from '../';

// Instruments
import Styles from './styles.m.css';

export const Feed = () => {
    return (
        <section className = { Styles.feed }>
            <Components.StatusBar />
            <Components.Composer />
            <Components.Post />
        </section>
    );
};
