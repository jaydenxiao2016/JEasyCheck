/**
 * Created by marno on 2017/4/13
 * Function:
 * Desc:
 */
import React, {Component} from "react";
import {View} from "react-native";
import QRScannerView from "../../common/QRScannerView";
import Colors from "../../res/Colors";
import NavigationBar from "../../common/NavigationBar";
import BaseCommon from "../../common/BaseCommon";
import ViewUtils from "../../util/ViewUtils";
import SearchMainPage from "../search/SearchMainPage";
export default class QRScannerPage extends Component {
    constructor(props) {
        super(props);
        this.baseCommon = new BaseCommon({...props, backPress: (e) => this.onBackPress(e)});
        this.isReceivedResult=false;
    }

    componentDidMount() {
        this.baseCommon.componentDidMount();
    }

    componentWillUnmount() {
        this.baseCommon.componentWillUnmount();
    }

    onBackPress(e) {
        this.props.navigator.pop();
        return true;
    }

    render() {
        return (
            < QRScannerView
                bottomMenuStyle={{height: 120, backgroundColor: '#000000', opacity: 1}}
                isShowScanBar={true}
                scanBarImage={require('../../res/images/ic_scanBar.png')}
                cornerColor={this.props.theme.themeColor}
                cornerOffsetSize={0}
                borderWidth={0}
                hintText={'请对准运单号的二维码'}
                hintTextStyle={{color: this.props.theme.themeColor, fontSize: 16, fontWeight: 'bold'}}
                scanBarTintColorStyle={this.props.theme.styles.tabBarSelectedIcon}
                scanBarColor={this.props.theme.themeColor}
                hintTextPosition={100}
                maskColor={Colors.black}
                onScanResultReceived={this.barcodeReceived.bind(this)}
                bottomMenuHeight={120}
                renderTopBarView={() => {
                    return (
                        <NavigationBar
                            navigator={this.props.navigator}
                            popEnabled={false}
                            style={this.props.theme.styles.navBar}
                            leftButton={ViewUtils.getLeftButton(() => this.onBackPress())}
                            title={this.props.title}
                        />
                    )
                }}
                renderBottomMenuView={() => this._renderMenu()}
            />
        )
    }

    _renderMenu() {
        return (
            <View>
            </View>
        )
    }
    barcodeReceived(result) {
        if (result) {
            if(this.props.callback&&!this.isReceivedResult) {
                this.isReceivedResult=true;
                this.props.callback(result.data)
                this.props.navigator.pop();
            }else if(!this.isReceivedResult) {
                this.isReceivedResult=true;
                this.props.navigator.replace({
                    component: SearchMainPage,
                    params: {
                        'title': "查看快递",
                        'theme': this.props.theme,
                        'expNo': result.data
                    }
                })
            }
        }
    }
}