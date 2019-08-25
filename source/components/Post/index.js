// Core
import React, {Component} from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

// Components
import { Consumer } from '../HOC/withProfile';

// Instruments
import Styles from './styles.m.css';

export default class Post extends Component {
    static propTypes = {
        comment: PropTypes.string.isRequired,
        created: PropTypes.number.isRequired,
    };

    render() {
        const { comment, created } = this.props;

        return (
            <Consumer>
                {(context) => (
                    <section className = { Styles.post }>
                        <img
                            alt = 'profile picture'
                            src = { context.avatar }
                        />
                        <a>{`${context.currentUserFirstName} ${context.currentUserLastName}`}</a>
                        <time>{moment.unix(created).format('MMMM D h:mm:ss a')}
                        </time>
                        <p>{ comment }</p>
                    </section>
                )}
            </Consumer>
        );
    }
}
