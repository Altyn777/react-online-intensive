// Core
import React, { Component } from 'react';
import { hot } from 'react-hot-loader'; // горячая перезагрузка модулей позволяет webpack обновлять приложение в браузере в живом режиме без перезагрузки страницы; состояние react компонентов будет сохраняться

// Components
import Catcher from '../../components/Catcher';
import Feed from '../../components/Feed';
import { Provider } from '../../components/HOC/withProfile';

// Instruments
import avatar from '../../theme/assets/liliana.png';

const options = {
    avatar,
    currentUserFirstName: 'Анастасия',
    currentUserLastName:  'Коломийцева',
};

@hot(module)
export default class App extends Component {
    render() {
        return (
            <Catcher>
                <Provider value = { options }>
                    <Feed />
                </Provider>
            </Catcher>
        );
    }
}
