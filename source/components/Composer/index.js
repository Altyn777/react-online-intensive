// Core
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Components
import { withProfile } from '../HOC/withProfile';

// Instruments
import Styles from './styles.m.css';

@withProfile
export default class Composer extends Component {
    static propTypes = { // валидируем
        _createPost: PropTypes.func.isRequired,
    };

    state = {
        comment: '',
    };

    _updateComment = (event) => { // обработчик события change; метод класса
        this.setState({
            comment: event.target.value, // описание новой модели состояния
        });
    };

    _handleFormSubmit = (event) => {
        event.preventDefault(); // добавим в вызов метода объекта синтетического события preventDefault
        this._submitComment();
    };

    _submitComment = () => { // получить комментарий
        const { comment } = this.state; // имплементирует деструктурирующее присваивание свойства comment из объекта state

        if (!comment) { // при пустом комменте при попытке submit делать ничего
            return null;
        }

        this.props._createPost(comment); // коммент не пустой, вызываем метод создания поста

        this.setState({ comment: '' }); // при создании нового поста обнуляем значение коммента
    };

    _submitOnEnter = (event) => {
        const enterKey = event.key === 'Enter'; // при нажатии на Enter; используем свойство key объекта синтетического события
        // свойство содержит описание нажатой клавиши в виде строкового значения
        if (enterKey) {
            event.preventDefault(); // вызов метода объекта синтетического события, чтоб строка не съезжала
            this._submitComment(); // вызов метода
        }
    };

    render() {
        const { comment } = this.state; // состояние input-а в виде свойства объекта state - comment
        const { avatar, currentUserFirstName } = this.props;

        return (
            <section className = { Styles.composer }>
                <img
                    alt = 'profile picture'
                    src = { avatar }
                />
                <form onSubmit = { this._handleFormSubmit/*привяз метод к слушат onSubmit в виде обработч*/ } >
                    <textarea // элемент
                        placeholder = { `What's on your mind, ${ currentUserFirstName }?` }
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
        );
    }
}

// export default withProfile(Composer);
