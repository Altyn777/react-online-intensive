// Core
import React, {Component} from 'react';
import { Transition } from 'react-transition-group';
import { fromTo } from 'gsap';

// Components
import Catcher from '../../components/Catcher';
import { withProfile } from '../HOC/withProfile';
import StatusBar from '../StatusBar';
import Composer from '../Composer';
import Post from '../Post';
import Spinner from '../Spinner';
import Postman from '../Postman';

// Instruments
import Styles from './styles.m.css';
import { api, TOKEN, GROUP_ID } from '../../config/api';
import { socket } from '../../socket/init';

@withProfile
export default class Feed extends Component {
    state = {
        posts:           [], // свойство, литерал массива
        isPostsFetching: false,
    };

    componentDidMount() {
        const { currentUserFirstName, currentUserLastName } = this.props;
        this._fetchPosts();
        socket.emit('join', GROUP_ID);

        socket.on('create', (postJSON)=> {
            const { data: createdPost, meta } = JSON.parse(postJSON);

            if (`${currentUserFirstName} ${currentUserLastName}` !== `${meta.authorFirstName} ${meta.authorLastName}`) {
                this.setState(({ posts }) => ({
                    posts: [ createdPost, ...posts ],
                }));
            }
        });

        socket.on('remove', (postJSON)=> {
            const { data: removedPost, meta } = JSON.parse(postJSON);

            if (`${currentUserFirstName} ${currentUserLastName}` !== `${meta.authorFirstName} ${meta.authorLastName}`) {
                this.setState(({ posts }) => ({
                    posts: posts.filter((post) => post.id !== removedPost.id),
                }));
            }
        });

        socket.on('like', (postJSON)=> {
            const { data: likedPost, meta } = JSON.parse(postJSON);

            if (`${currentUserFirstName} ${currentUserLastName}` !== `${meta.authorFirstName} ${meta.authorLastName}`) {
                this.setState(({ posts }) => ({
                    posts: posts.filter((post) => post.id !== likedPost.id),
                }));
            }
        });
    }

    componentWillUnmount() {
        socket.removeListener('create');
        socket.removeListener('remove');
        socket.removeListener('like');
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

    _animateComposerEnter = (composer) => {
        fromTo(composer, 1, { opacity: 0, rotationX: 50 }, { opacity: 1, rotationX: 0 });
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
                <Transition
                    appear
                    in
                    timeout = { 1000 }
                    onEnter = { this._animateComposerEnter }>
                    <Composer _createPost = { this._createPost } />
                </Transition>
                {postsJSX}
                <Postman />
            </section>
        );
    }
}
