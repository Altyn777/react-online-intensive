// Core
import React, { Component } from 'react';

// Components
import * as Components from '../';

// Instruments
import Styles from './styles.m.css';

export class Feed extends Component {
    render() {
        return (
            <section className = { Styles.feed }>
                <Components.StatusBar />
                <Components.Composer />
                <Components.Post />
            </section>
        );
    }
}
