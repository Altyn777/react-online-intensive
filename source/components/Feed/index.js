// Core
import React, {Component} from 'react';
import moment from 'moment';

// Components
import StatusBar from '../StatusBar';
import Composer from '../Composer';
import Post from '../Post';
import Spinner from '../Spinner';

// Instruments
import Styles from './styles.m.css';
import { getUniqueID } from '../../instruments';

export default class Feed extends Component {
    constructor () {
        super();

        this._createPost = this._createPost.bind(this);
        // this._deletePost = this._deletePost.bind(this);
    }

    state = {
        posts: [
            { id: '123', comment: 'Hi there!', created: 1526825076849 },
            { id: '456', comment: 'Привет!', created: 1526825076855 },
        ], // свойство, литерал массива
        isPostsFetching: false,
    };

    // передадим компоненту Composer по props для получения значения тела поста
    _createPost(comment) { // метод класса; привязка его контекста выполнения в constructor
        const post = {
            id:      getUniqueID(),
            created: moment().utc(),
            comment: comment,
        };

        this.setState(({posts}) => ({
            posts: [ post, ...posts ],
        }));
    }

    // _deletePost(id) { // метод класса; привязка его контекста выполнения в constructor
    //     const post = {
    //
    //     }
    // }

    render() {
        const { posts, isPostsFetching } = this.state;

        const postsJSX = posts.map((post) => { // экземпляр класса posts будет создан каждый раз при создании поста, рендерим список постов с пом. map
            return (
                <Post
                    key = { post.id }
                    { ...post }
                />
            ); // возвращаем по экземлпяру компонента post
        });

        return (
            <section className = { Styles.feed }>
                <Spinner isSpinning = { isPostsFetching } />
                <StatusBar />
                <Composer _createPost = { this._createPost /*_deletePost = { this._deletePost }*/ } />
                {postsJSX}
            </section>
        );
    }
}
