// Core
import React, {Component} from 'react';
import { Transition, CSSTransition, TransitionGroup } from 'react-transition-group';
import { fromTo } from 'gsap';
import { delay } from '../../instruments';

// Components
import Catcher from '../../components/Catcher';
import { withProfile } from '../HOC/withProfile';
import StatusBar from '../StatusBar';
import Composer from '../Composer';
import Post from '../Post';
import Spinner from '../Spinner';
import Postman from '../Postman';
import Counter from '../Counter';

// Instruments
import Styles from './styles.m.css';
import { api, TOKEN, GROUP_ID } from '../../config/api';
import { socket } from '../../socket/init';

@withProfile
export default class Feed extends Component {
    state = {
        posts:         [], // свойство, литерал массива
        isSpinning:    false,
        isPostmanShow: true,
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
            isSpinning: state,
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
            isSpinning: false,
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
            posts:      [ post, ...posts ],
            isSpinning: false,
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
             posts:      posts.map((post) => post.id === likedPost.id ? likedPost : post),
             isSpinning: false,
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
             posts:      posts.filter((post)=> post.id !== id),
             isSpinning: false,
         }));
     };

    _animateComposerEnter = (composer) => {
        fromTo(composer, 1, { opacity: 0, rotationX: 50 }, { opacity: 1, rotationX: 0 });
    };

    _animatePostmanEnter = (postman) => {
        fromTo(postman, 1, { x: 280 }, { x: 0 });
    };

    _animatePostmanExit = (postman) => {
        fromTo(postman, 1, { x: 0 }, { x: 280 });
    };

    _animatePostmanEntered = async () => {
        await delay(4000);
        this.setState({ isPostmanShow: false });
    };

    render() {
        const { posts, isSpinning } = this.state;

        const postsJSX = posts.map((post) => { // экземпляр класса posts будет создан каждый раз при создании поста, рендерим список постов с пом. map
            return (
                <CSSTransition
                    classNames = {{
                        enter:       Styles.postInStart,
                        enterActive: Styles.postInEnd,
                        exit:        Styles.postOutStart,
                        exitActive:  Styles.postOutEnd,
                    }}
                    key = { post.id }
                    timeout = {{
                        enter: 500,
                        exit:  400,
                    }}>
                    <Catcher>
                        <Post
                            { ...post }
                            _likePost = { this._likePost }
                            _removePost = { this._removePost }
                        />
                    </Catcher>
                </CSSTransition>
            ); // возвращаем по экземлпяру компонента post
        });

        return (
            <section className = { Styles.feed }>
                <Spinner isSpinning = { isSpinning } />
                <StatusBar />
                <Transition
                    appear
                    in
                    timeout = { 1000 }
                    onEnter = { this._animateComposerEnter }>
                    <Composer _createPost = { this._createPost } />
                </Transition>
                <Transition
                    appear
                    in = { this.state.isPostmanShow }
                    timeout = { 4000 }
                    onEnter = { this._animatePostmanEnter }
                    onEntered = { this._animatePostmanEntered }
                    onExit = { this._animatePostmanExit }>
                    <Postman />
                </Transition>
                <Counter count = { postsJSX.length } />
                <TransitionGroup>{postsJSX}</TransitionGroup>
            </section>
        );
    }
}
