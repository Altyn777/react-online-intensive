// Core
import React, {Component} from 'react';

// Components
import StatusBar from '../StatusBar';
import Composer from '../Composer';
import Post from '../Post';
import Spinner from '../Spinner';

// Instruments
import Styles from './styles.m.css';

export default class Feed extends Component {
    state = {
        posts: [
            { id: '123', comment: 'Hi there!', created: 1526825076849 },
            { id: '456', comment: 'Привет!', created: 1526825076855 },
        ], // свойство, литерал массива
        isPostsFetching: false,
    };

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
                <Composer />
                {postsJSX}
            </section>
        );
    }
}
