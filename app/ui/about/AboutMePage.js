/**
 * AboutMePage
 * 关于
 * @hisign
 */
import React, {Component} from 'react';
import {
    Image,
    StyleSheet,
    View,
    Text,
    Linking,
    Clipboard,
} from 'react-native';

import WebViewPage from '../WebViewPage';
import ViewUtils from '../../util/ViewUtils'
import GlobalStyles from '../../res/styles/GlobalStyles'
import AboutCommon from './AboutCommon'
import config from '../../../LocalData/Config.json'
import Colors from '../../res/Colors'
import Toast from 'react-native-easy-toast'
const FLAG = {
    BLOG: {
        name: '技术博客',
        items: {
            JUEJIN: {
                title: '掘金',
                url: 'https://juejin.im/user/56f777ef816dfa0051eabb32',
            },
            JIANSHU: {
                title: '简书',
                url: 'http://www.jianshu.com/u/a4c806fb5684',
            },
            GITHUB: {
                title: 'GitHub',
                url: 'https://github.com/jaydenxiao2016',
            },
        }
    },
    REPOSITORY: {
        name: '开源项目',
        items: {
            GithubSource: {
                title: 'AndroidFire',
                url: 'https://github.com/jaydenxiao2016/AndroidFire',
            }
        }
    },
    CONTACT: {
        name: '联系方式',
        items: {
            QQ: {
                title: 'QQ',
                account: '791830569',
            },
            Email: {
                title: 'Email',
                account: 'jaydenxiao2016@gmail.com',
            },
        }
    },
    QQ: {
        name: '技术交流群',
        items: {
            MD: {
                title: 'Android经验分享',
                account: '386067289',
            },
            RN: {
                title: '个人微信公众号',
                account: 'Android经验分享',
            }
        },
    },

};

export default class AboutMePage extends Component {
    constructor(props) {
        super(props);
        this.aboutCommon = new AboutCommon(props, (dic)=>this.updateState(dic));
        this.repositories = [];
        this.state = {
            projectModels: null,
            author: {},
            showRepository: false,
            showBlog: false,
            showRepository:false,
            showQQ: false,
            showContact: false,

        }
    }

    componentDidMount() {
        this.aboutCommon.componentDidMount();
        this.getConfig();
    }
    componentWillUnmount(){
        this.aboutCommon.componentWillUnmount();
    }


    updateState(dic) {
        this.setState(dic);
    }
    async getConfig() {
        this.setState({
            author: config.author,
        })
    }

    onClick(tab) {
        let TargetComponent, params = {...this.props, menuType: tab};
        switch (tab) {
            case FLAG.CONTACT.items.Email:
                Linking.openURL('mailto:'+tab.account);
                break;
            case FLAG.CONTACT.items.QQ:
                this.toast.show('QQ:' + tab.account + '已复制到剪切板。');
                Clipboard.setString(tab.account);
                break;
            case FLAG.QQ.items.MD:
            case FLAG.QQ.items.RN:
                this.toast.show('群号:' + tab.account + '已复制到剪切板。');
                Clipboard.setString(tab.account);
                break;
            case FLAG.BLOG.items.JUEJIN:
            case FLAG.BLOG.items.GITHUB:
            case FLAG.BLOG.items.JIANSHU:
            case FLAG.BLOG.items.PERSONAL_BLOG:
            case FLAG.REPOSITORY.items.GithubSource:
                TargetComponent = WebViewPage;
                params.title = tab.title;
                params.url = tab.url;
                break;
            case FLAG.BLOG:
                this.updateState({showBlog: !this.state.showBlog});
                break;
            case FLAG.REPOSITORY:
                this.updateState({showRepository: !this.state.showRepository});
                break;
            case FLAG.QQ:
                this.updateState({showQQ: !this.state.showQQ});
                break;
            case FLAG.CONTACT:
                this.updateState({showContact: !this.state.showContact});
                break;

        }
        if (TargetComponent) {
            this.props.navigator.push({
                component: TargetComponent,
                params: params,
            });
        }
    }

    renderItems(dic, isShowAccount) {
        if (!dic)return null;
        let views = [];
        for (let i in dic) {
            let title = isShowAccount ? dic[i].title + ':' + dic[i].account : dic[i].title;
            views.push(
                <View key={i}>
                    {ViewUtils.getSettingItem(()=>this.onClick(dic[i]), '', title, this.props.theme.styles.tabBarSelectedIcon)}
                    <View style={GlobalStyles.line}/>
                </View>
            );
        }
        return views;
    }

    getClickIcon(isShow) {
        return isShow ? require('../../res/images/ic_tiaozhuan_up.png') : require('../../res/images/ic_tiaozhuan_down.png');
    }

    render() {
        let content = <View>
            {/*技术博客*/}
            {ViewUtils.getSettingItem(()=>this.onClick(FLAG.BLOG), require('../../res/images/ic_computer.png'),
                FLAG.BLOG.name, this.props.theme.styles.tabBarSelectedIcon, this.getClickIcon(this.state.showBlog))}
            <View style={GlobalStyles.line}/>
            {this.state.showBlog ? this.renderItems(FLAG.BLOG.items) : null}
            {/*开源项目*/}
            {ViewUtils.getSettingItem(()=>this.onClick(FLAG.REPOSITORY), require('../../res/images/ic_code.png'),
                FLAG.REPOSITORY.name, this.props.theme.styles.tabBarSelectedIcon, this.getClickIcon(this.state.showRepository))}
            <View style={GlobalStyles.line}/>
            {this.state.showRepository ? this.renderItems(FLAG.REPOSITORY.items) : null}
            {/*技术交流群*/}
            {ViewUtils.getSettingItem(()=>this.onClick(FLAG.QQ), require('../../res/images/ic_computer.png'),
                FLAG.QQ.name, this.props.theme.styles.tabBarSelectedIcon, this.getClickIcon(this.state.showQQ))}
            <View style={GlobalStyles.line}/>
            {this.state.showQQ ? this.renderItems(FLAG.QQ.items, true) : null}
             {/*联系方式*/}
            {ViewUtils.getSettingItem(()=>this.onClick(FLAG.CONTACT), require('../../res/images/ic_contacts.png'),
                FLAG.CONTACT.name, this.props.theme.styles.tabBarSelectedIcon, this.getClickIcon(this.state.showContact))}
            <View style={GlobalStyles.line}/>
            {this.state.showContact ? this.renderItems(FLAG.CONTACT.items, true) : null}
        </View>
        return (
            <View style={styles.container}>
                {this.aboutCommon.render(content, this.state.author)}
                <Toast ref={e=>this.toast = e}/>
            </View>);
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contactItemLayout: {
        flexDirection: 'row', alignItems: 'center'
    },
    contactContentText: {
        color: 'dodgerblue', fontSize: 13, textDecorationLine: 'underline'
    },
    contactName: {
        fontSize: 13, color: 'gray', fontWeight: '400'
    },
});
