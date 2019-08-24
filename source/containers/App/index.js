// Core
import React, { Component } from 'react';
import { hot } from 'react-hot-loader'; // горячая перезагрузка модулей позволяет webpack обновлять приложение в браузере в живом режиме без перезагрузки страницы; состояние react компонентов будет сохраняться

// Components
import { Feed } from '../../components/Feed';
import { Provider } from '../../components/HOC/withProfile';

// Instruments
import avatar from '../../theme/assets/liliana.png';

const options = {
    avatar,
    currentUserFirstName: 'Liliana',
    currentUserLastName:  'Vess',
};

export const App = hot(module)(() => {
    return (
        <Provider value = { options }>
            <Feed />
        </Provider>
    );
});
