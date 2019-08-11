// Core
import React, { Component } from 'react';

// Instruments
import avatar from 'theme/assets/liliana';
import Styles from './styles.m.css'

export default class Composer extends Component {
    render() {
        return (
            <section className = { Styles.composer }>
                <img src = { avatar } />
                 <form>
                     <textarea placeholder = { `What's on your mind, Liliana?` } />
                     <input type = 'submit' value = 'Post' />
                 </form>
            </section>
        );
    }
}
