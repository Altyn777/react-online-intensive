// Core
import React, {Component} from 'react';
import moment from 'moment';

// Components
import { withProfile } from '../HOC/withProfile';
import StatusBar from '../StatusBar';
import Composer from '../Composer';
import Post from '../Post';
import Spinner from '../Spinner';

// Instruments
import Styles from './styles.m.css';
import { getUniqueID, delay } from '../../instruments';

@withProfile
export default class Feed extends Component {
    state = {
        posts: [
            { id: '123', comment: 'Hi there!', created: 1526825076849, likes: [] },
            { id: '456', comment: 'Привет!', created: 1526825076855, likes: [] },
        ], // свойство, литерал массива
        isPostsFetching: false,
    };

    _setPostsFetchingState = (state) => {
        this.setState({
            isPostsFetching: state,
        });
    };

    // передадим компоненту Composer по props для получения значения тела поста
    _createPost = async (comment) => { // метод класса; привязка его контекста выполнения в constructor
        this._setPostsFetchingState(true);

        const post = {
            id:      getUniqueID(),
            created: moment().utc(),
            comment,
            likes:   [],
        };
        await delay(1200);

        this.setState(({posts}) => ({
            posts:           [ post, ...posts ],
            isPostsFetching: false,
        }));
    };

     _likePost = async (id) => {
         const { currentUserFirstName, currentUserLastName } = this.props;
         this._setPostsFetchingState(true);

         await delay(1200);

         const newPosts = this.state.posts.map((post) => {
             if (post.id === id) {
                 return {
                     ...post,
                     likes: [
                         {
                             id:        getUniqueID(),
                             firstName: currentUserFirstName,
                             lastName:  currentUserLastName,
                         },
                     ],
                 };
             }

             return post;
         });

         this.setState({
             posts:           newPosts,
             isPostsFetching: false,
         });
     };

     _removePost = async (id) => { // метод класса; привязка его контекста выполнения в constructor
         this._setPostsFetchingState(true);

         await delay(1200);

         this.setState(({ posts }) => ({
             posts:           posts.filter((post)=> post.id !== id),
             isPostsFetching: false,
         }));
     };

     render() {
         const { posts, isPostsFetching } = this.state;

         const postsJSX = posts.map((post) => { // экземпляр класса posts будет создан каждый раз при создании поста, рендерим список постов с пом. map
             return (
                 <Post
                     key = { post.id }
                     { ...post }
                     _likePost = { this._likePost }
                     _removePost = { this._removePost }
                 />
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
