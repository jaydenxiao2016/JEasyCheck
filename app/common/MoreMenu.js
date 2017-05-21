/**
 * 更多菜单
 * @flow
 */
import React, {Component, PropTypes} from "react";
import {Share, Text, TouchableHighlight, View,Platform} from "react-native";
import Popover from "../common/Popover";
import AboutMePage from "../ui/about/AboutMePage";
import Constants from "../res/Constants";
export const MORE_MENU = {
    Custom_Theme: '自定义主题',
    About_Author: '关于作者',
    Share: '分享'
}

export default class MoreMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            buttonRect: {},
        }
    }

    static propTypes = {
        contentStyle: View.propTypes.style,
        menus: PropTypes.array,
    }

    open() {
        this.showPopover();
    }

    showPopover() {
        if (!this.props.anchorView)return;
        let anchorView = this.props.anchorView;
        anchorView.measure((ox, oy, width, height, px, py) => {
            this.setState({
                isVisible: true,
                buttonRect: {x: px, y: py, width: width, height: height}
            });
        });
    }

    closePopover() {
        this.setState({
            isVisible: false,
        });
        if (typeof(this.props.onClose) == 'function') this.props.onClose();
    }

    onMoreMenuSelect(tab) {
        this.closePopover();
        if (typeof(this.props.onMoreMenuSelect) == 'function') this.props.onMoreMenuSelect(tab);
        let TargetComponent, params = {...this.props, menuType: tab};
        switch (tab) {
            case MORE_MENU.Custom_Theme:
                break;
            case MORE_MENU.About_Author:
                TargetComponent = AboutMePage;
                break;
            case MORE_MENU.Share:
                this.onShare();
                break;
        }
        if (TargetComponent) {
            this.props.navigator.push({
                component: TargetComponent,
                params: params,
            });
        }
    }

    renderMoreView() {
        let view = <Popover
            isVisible={this.state.isVisible}
            fromRect={this.state.buttonRect}
            placement="bottom"
            onClose={() => this.closePopover()}
            contentStyle={{opacity: 0.82, backgroundColor: '#343434'}}
            contentMarginRight={20}
        >
            <View >
                {this.props.menus.map((result, i, arr) => {
                    return <TouchableHighlight key={i} onPress={() => this.onMoreMenuSelect(arr[i])}
                                               underlayColor='transparent'>
                        <Text
                            style={{
                                marginRight: 10,
                                marginLeft: 10,
                                fontSize: 16,
                                color: 'white',
                                padding: 8,
                                fontWeight: '400'
                            }}>
                            {arr[i]}
                        </Text>
                    </TouchableHighlight>
                })
                }

            </View>
        </Popover>;
        return view;
    }

    /**
     * 分享
     */
    onShare() {
        Share.share({
            message: Constants.ShareContent+(Platform.OS === 'ios'?"":Constants.ShareUrl),
            url: Constants.ShareUrl,
            title: Constants.ShareTitle
        },{
            dialogTitle: Constants.ShareTitle,
            excludedActivityTypes: [
                'com.apple.UIKit.activity.PostToTwitter'],
            tintColor: 'green'
        });
    };

    render() {
        return (this.renderMoreView());
    }

}