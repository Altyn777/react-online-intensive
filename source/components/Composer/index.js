// Core
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Components
import { Consumer } from '../HOC/withProfile';

// Instruments
import Styles from './styles.m.css';

export default class Composer extends Component {
    static propTypes = { // валидируем
        _createPost: PropTypes.func.isRequired,
        //_deletePost: PropTypes.func.isRequired,
    };

    constructor () {
        super();

        this._updateComment = this._updateComment.bind(this); // привязываем контексты
        this._submitComment = this._submitComment.bind(this);
        this._handleFormSubmit = this._handleFormSubmit.bind(this);
        this._submitOnEnter = this._submitOnEnter.bind(this);
    }

    state = {
        comment: '',
    };

    _updateComment (event) { // обработчик события change; метод класса
        this.setState({
            comment: event.target.value, // описание новой модели состояния
        });
    }

    _handleFormSubmit (event) {
        event.preventDefault(); // добавим в вызов метода объекта синтетического события preventDefault
        this._submitComment();
    }

    _submitComment () { // получить комментарий
        const { comment } = this.state; // имплементирует деструктурирующее присваивание свойства comment из объекта state

        if (!comment) { // при пустом комменте при попытке submit делать ничего
            return null;
        }

        this.props._createPost(comment); // коммент не пустой, вызываем метод создания поста

        this.setState({ comment: '' }); // при создании нового поста обнуляем значение коммента
    }

    _submitOnEnter (event) {
        const enterKey = event.key === 'Enter'; // при нажатии на Enter; используем свойство key объекта синтетического события
        // свойство содержит описание нажатой клавиши в виде строкового значения
        if (enterKey) {
            event.preventDefault(); // вызов метода объекта синтетического события, чтоб строка не съезжала
            this._submitComment(); // вызов метода
        }
    }

    render() {
        const { comment } = this.state; // состояние input-а в виде свойства объекта state - comment

        return (
            <Consumer>
                {(context) => (
                    <section className = { Styles.composer }>
                        <img
                            alt = 'profile picture'
                            src = { context.avatar }
                        />
                        <form onSubmit = { this._handleFormSubmit /*привязать метод _submitComment к слушателю события onSubmit элемента form в виде обработчика*/ } >
                            <textarea // элемент
                                placeholder = { `What\'s on your mind, ${
                                    context.currentUserFirstName
                                }?` }
                                value = { comment } // привязать значение
                                onChange = { this._updateComment }
                                onKeyPress = { this._submitOnEnter }
                            />
                            <input
                                type = 'submit'
                                value = 'Post'
                            />
                        </form>
                    </section>
                )}
            </Consumer>
        );
    }
}
