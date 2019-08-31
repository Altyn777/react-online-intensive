// Core
import React, {Component} from 'react';
import moment from 'moment';
import { func, string, number, array } from 'prop-types';

// Components
import Like from '../../components/Like';
import { withProfile } from '../HOC/withProfile';

// Instruments
import Styles from './styles.m.css';

@withProfile
export default class Post extends Component {
    static propTypes = {
        _likePost:   func.isRequired,
        comment:     string.isRequired,
        created:     number.isRequired,
        id:          string.isRequired,
        likes:       array.isRequired,
        _removePost: func.isRequired,
    };

    _removePost = () => {
        const { _removePost, id } = this.props;
        _removePost(id);
    };

    render() {
        const { comment, created, _likePost, id, likes, avatar, currentUserFirstName, currentUserLastName } = this.props;

        return (
            <section className = { Styles.post }>
                <span
                    className = { Styles.cross }
                    onClick = { this._removePost }
                />
                <img
                    alt = 'profile picture'
                    src = { avatar }
                />
                <a>{`${currentUserFirstName} ${currentUserLastName}`}</a>
                <time>{moment.unix(created).format('MMMM D h:mm:ss a')}
                </time>
                <p>{ comment }</p>
                <Like
                    _likePost = { _likePost }
                    id = { id }
                    likes = { likes }
                />
            </section>
        );
    }
}
