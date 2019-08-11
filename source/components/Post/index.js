// Core
import React, { Component } from 'react';
import moment from "moment";

// Instruments
import avatar from 'theme/assets/liliana';
import Styles from './styles.m.css'

export default class Post extends Component {
    render() {
        return (
                <section className = { Styles.post }>
                    <img src = { avatar } />
                    <a>Liliana Vess</a>
                    <time>{moment().format('MMMM D h:mm:ss a')}</time>
                    <p>Howdy!</p>
                </section>
        );
    }
}
