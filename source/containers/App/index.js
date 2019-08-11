// Core
import React, { Component } from 'react';
import { hot } from "react-hot-loader"; // горячая перезагрузка модулей позволяет webpack обновлять приложение в браузере в живом режиме без перезагрузки страницы; состояние react компонентов будет сохраняться

// Components
import Feed from "../../components/Feed";

@hot(module)
export default class App extends Component {
    render() {
        return <Feed />;
    }
}
