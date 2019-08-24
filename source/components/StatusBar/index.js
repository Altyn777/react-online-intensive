// Core
import React from 'react';

// Components
import { Consumer } from '../HOC/withProfile';

// Instruments
import Styles from './styles.m.css';

export const StatusBar = () => {
    return (
        <Consumer>
            {(context) => (
                <section className = { Styles.statusBar }>
                    <button>
                        <img src = { context.avatar } />
                        <span>{ context.currentUserFirstName }</span>
                        &nbsp;
                        <span>{ context.currentUserLastName }</span>
                    </button>
                </section>
            )}
        </Consumer>
    );
};
