/**
 * BaseCommon
 * 公共逻辑处理
 */
import React, {Component} from 'react';
import {
    BackHandler,
} from 'react-native';

export default class BaseCommon {
    constructor(props) {
        this._onHardwareBackPress = this.onHardwareBackPress.bind(this);
        this.props = props;
    }
    componentDidMount() {
        if(this.props.backPress)BackHandler.addEventListener('hardwareBackPress',this._onHardwareBackPress);
    }
    componentWillUnmount() {
        if(this.props.backPress)BackHandler.removeEventListener('hardwareBackPress',this._onHardwareBackPress);
    }
    onHardwareBackPress(e){
        return this.props.backPress(e);
    }
}

