// Core
import React, {Component} from 'react';

// Components
import Catcher from '../../components/Catcher';
import { withProfile } from '../HOC/withProfile';
import StatusBar from '../StatusBar';
import Composer from '../Composer';
import Post from '../Post';
import Spinner from '../Spinner';

// Instruments
import Styles from './styles.m.css';
import { api, TOKEN } from '../../config/api';

@withProfile
export default class Feed extends Component {
    state = {
        posts:           [], // свойство, литерал массива
        isPostsFetching: false,
    };

    componentDidMount() {
        this._fetchPosts();
        this.refetch = setInterval(this._fetchPosts, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.refetch);
    }


    _setPostsFetchingState = (state) => {
        this.setState({
            isPostsFetching: state,
        });
    };

    _fetchPosts = async () => {
        this._setPostsFetchingState(true);

        const response = await fetch(api, {
            method: 'GET',
        });

        const {data: posts } = await response.json();

        this.setState({
            posts,
            isPostsFetching: false,
        });
    };

    // передадим компоненту Composer по props для получения значения тела поста
    _createPost = async (comment) => { // метод класса; привязка его контекста выполнения в constructor
        this._setPostsFetchingState(true);

        const response = await fetch(api, {
            method:  'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  TOKEN,
            },
            body: JSON.stringify({comment}),
        });

        const { data: post } = await response.json();

        this.setState(({posts}) => ({
            posts:           [ post, ...posts ],
            isPostsFetching: false,
        }));
    };

     _likePost = async (id) => {
         this._setPostsFetchingState(true);

         const response = await fetch(`${api}/${id}`, {
             method:  'PUT',
             headers: {
                 Authorization: TOKEN,
             },
         });

         const { data: likedPost } = await response.json();

         this.setState(({posts}) => ({
             posts:           posts.map((post) => post.id === likedPost.id ? likedPost : post),
             isPostsFetching: false,
         }));
     };

     _removePost = async (id) => { // метод класса; привязка его контекста выполнения в constructor
         this._setPostsFetchingState(true);

         await fetch(`${api}/${id}`, {
             method:  'DELETE',
             headers: {
                 Authorization: TOKEN,
             },
         });

         this.setState(({ posts }) => ({
             posts:           posts.filter((post)=> post.id !== id),
             isPostsFetching: false,
         }));
     };

     render() {
         const { posts, isPostsFetching } = this.state;

         const postsJSX = posts.map((post) => { // экземпляр класса posts будет создан каждый раз при создании поста, рендерим список постов с пом. map
             return (
                 <Catcher key = { post.id }>
                     <Post
                         { ...post }
                         _likePost = { this._likePost }
                         _removePost = { this._removePost }
                     />
                 </Catcher>
             ); // возвращаем по экземлпяру компонента post
         });

         return (
             <section className = { Styles.feed }>
                 <Spinner isSpinning = { isPostsFetching } />
                 <StatusBar />
                 <Composer _createPost = { this._createPost } />
                 {postsJSX}
             </section>
         );
     }
}
