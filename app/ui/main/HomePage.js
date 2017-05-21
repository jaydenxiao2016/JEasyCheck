import React, {Component} from "react";
import {
    BackHandler,
    DeviceEventEmitter,
    Image,
    ListView,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import NavigationBar from "../../common/NavigationBar";
import Toast from "react-native-easy-toast";
import ViewUtils from "../../util/ViewUtils";
import JAdView from "./JAdView";
import Swipeout from "react-native-swipeout";
import WebViewPage from "../WebViewPage";
import SearchMainPage from "../search/SearchMainPage";
import SearchResultPage from "../search/SearchResultPage";
import SendMainPage from "../send/SendMainPage";
import QRScannerPage from "../scan/QRScannerPage";
import Colors from "../../res/Colors";
import Constants from "../../res/Constants";
import TracesDataDao from "../../dao/TracesDataDao";
import HistorySearchDao from "../../dao/HistorySearchDao";
import CompanyModel from "../../model/CompanyModel";
import MoreMenu, {MORE_MENU} from "../../common/MoreMenu";
import CustomThemePage from "../about/CustomThemePage";
import moment from "moment";
var tracesDataDao = new TracesDataDao();
var historySearchDao = new HistorySearchDao();

export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme,
            customThemeViewVisible: false,
            isLoading: false,
            isEmptyOrFail: false,
            emptyOrFailTip:"",
            traceDatas: null,
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
        };
    }

    render() {
        let contentView = !this.state.isEmptyOrFail ?
            <ListView
                dataSource={this.state.dataSource}
                renderRow={(rowData, sectionId, rowID) => this.renderRow(rowData, sectionId, rowID)}
                renderFooter={() => {
                    return <View style={{height: 10}}/>
                }}
                enableEmptySections={true}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isLoading}
                        onRefresh={() => this._loadData()}
                        tintColor={this.state.theme.themeColor}
                        title="Loading..."
                        titleColor={this.state.theme.themeColor}
                        colors={[this.state.theme.themeColor, this.state.theme.themeColor, this.state.theme.themeColor]}
                    />}
            /> : this.renderEmptyOrFailView();
        return (
            <View style={styles.container}>
                {/*顶标题*/}
                <NavigationBar
                    title='易快递'
                    style={this.state.theme.styles.navBar}
                    statusBar={{backgroundColor: this.state.theme.themeColor}}
                    rightButton={this._renderRightView()}
                    hide={false}
                />
                {/*菜单*/}
                {this._renderMenuView()}
                {/*广告*/}
                <JAdView
                    theme={this.state.theme}
                    onClickAd={(url, title) => this._onClickAd(url, title)}/>
                {/*内容*/}
                {contentView}
                {/*更多菜单*/}
                {this._renderMoreView()}
                {/*主题*/}
                <CustomThemePage
                    visible={this.state.customThemeViewVisible}
                    {...this.props}
                    onClose={() => {
                        this.setState({customThemeViewVisible: false})
                    }}/>
                <Toast ref={e => this.toast = e}/>
            </View>
        );
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', (e) => this._onHardwareBackPress(e));
        this._loadData();
        //添加监听
        //刷新
        this.listener = DeviceEventEmitter.addListener(Constants.HomeRefreshEventKey, (value) => {
            this._loadData();
        });
        //主题发生变化
        this.listener2 = DeviceEventEmitter.addListener(Constants.ThemeChangeEventKey, (theme) => {
            this.setState({
                theme: theme,
            })
        });
    }

    componentWillUnmount() {
        //移除监听
        this.listener.remove();
        this.listener2.remove();
        BackHandler.removeEventListener('hardwareBackPress', (e) => this._onHardwareBackPress(e));
    }

    /**
     * 回退键监听
     */
    _onHardwareBackPress(e) {
        if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
            //最近2秒内按过back键，可以退出应用。
			this.props.navigator.pop();
            return false;
        }
        this.lastBackPressed = Date.now();
        if (this.toast) {
            this.toast.show(Constants.ExitTip);
        }
        return true;
    }

    _renderRightView() {
        return ViewUtils.getMoreButton(() => {
            this.refs.moreMenu.open()
        })
    }

    _renderMenuView() {
        return <View style={[styles.menuContainerStyles, this.state.theme.styles.navBar]}>
            <TouchableOpacity activeOpacity={0.5} style={styles.menuItemStyles}
                              onPress={() => this._onClickMenu("查快递")}>
                <Image source={require('../../res/images/ic_search.png')} style={styles.menuImageStyles}/>
                <Text style={ styles.menuFontStyles}>查快递</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.5} style={styles.menuItemStyles}
                              onPress={() => this._onClickMenu("寄快递")}>
                <Image source={require('../../res/images/ic_post.png')} style={styles.menuImageStyles}/>
                <Text style={styles.menuFontStyles}>寄快递</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.5} style={styles.menuItemStyles} onPress={() => this._onClickMenu("扫码")}>
                <Image source={require('../../res/images/ic_sweep.png')} style={styles.menuImageStyles}/>
                <Text style={styles.menuFontStyles}>扫码</Text>
            </TouchableOpacity>
        </View>
    }

    _renderMoreView() {
        let params = {...this.props, theme: this.state.theme}
        return <MoreMenu
            {...params}
            ref="moreMenu"
            menus={[MORE_MENU.Custom_Theme, MORE_MENU.About_Author, MORE_MENU.Share]}
            contentStyle={{right: 20}}
            onMoreMenuSelect={(e) => {
                if (e === MORE_MENU.Custom_Theme) {
                    this.setState({customThemeViewVisible: true});
                }
            }}
            anchorView={this.refs.moreMenuButton}
            navigator={this.props.navigator}/>
    }

    renderRow(rowData, sectionId, rowID) {
        let logo = rowData.Logo ? {uri: Constants.LogoBaseUrl + rowData.Logo} : require('../../res/images/ic_logo_default.png');
        return (
            <View style={styles.listViewStyle}>
                <Swipeout
                    autoClose={true}
                    right={[{
                        text: '删除',
                        backgroundColor: Colors.lightred,
                        onPress: () => this._onClickDelete(rowData, rowID),
                    }]}>
                    <TouchableOpacity style={{
                        backgroundColor: Colors.white,
                        padding: 10,
                        borderRightWidth: 5,
                        borderRightColor: rowData.stateColor
                    }} onPress={() => this._onclickItem(rowData)}>
                        {/*上面*/}
                        <View style={styles.itemTopStyles}>
                            <Text style={{
                                paddingBottom: 3
                            }}>{rowData.ShipperName + "：" + rowData.LogisticCode}</Text>
                            <Text style={{color: rowData.stateColor}}>{rowData.stateCN}</Text>
                        </View>
                        {/*下面*/}
                        {
                            <View style={{flexDirection: 'row',}}>
                                {/*左边*/}
                                <Image source={logo}
                                       style={{
                                           height: 40,
                                           width: 40,
                                           borderWidth: 1,
                                           borderColor: Colors.lightgray,
                                           borderRadius: 2,
                                           marginTop: 3,
                                           marginRight: 8
                                       }}/>
                                {/*右边*/}
                                <View >
                                    <Text
                                        numberOfLines={2}
                                        style={{
                                            fontSize: 14,
                                            color: Colors.black,
                                            marginRight: 40,
                                            marginBottom: 2
                                        }}>{rowData.Traces.length > 0 ? rowData.Traces[rowData.Traces.length - 1].AcceptStation : Constants.NoNewTip}</Text>
                                    <Text
                                        numberOfLines={1}>{rowData.RecentTime}</Text>
                                </View>
                            </View>
                        }
                    </TouchableOpacity>

                </Swipeout>
            </View>
        )
    }

    /**
     * 暂无新的物流信息view
     */
    renderEmptyOrFailView() {
        return <View style={{flex: 1, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center'}}>
            {/*上部分*/}
            <View style={{alignItems: 'center'}}>
                <Image source={require('../../res/images/ic_no_exist.png')}
                       style={{width: 100, height: 100, marginTop: 10}}
                       resizeMode={'contain'}/>
                <Text style={{padding: 8, color: Colors.gray}}>{this.state.emptyOrFailTip}</Text>
            </View>
        </View>
    }

    /**
     * 加载数据
     * @private
     */
    _loadData() {
        this.setState({
            isLoading: true,
            isEmptyOrFail: false,
        });
        tracesDataDao.loadTracesDataByRecentSearch().then((tracesDatas) => {
            console.log("tracesData" + tracesDatas);
            this.setState({
                isLoading: false,
                isEmptyOrFail: false,
                traceDatas: tracesDatas,
                dataSource: this.state.dataSource.cloneWithRows(tracesDatas),
            });
        }).catch((err) => {
            this.setState({
                isLoading: false,
                isEmptyOrFail: true,
                emptyOrFailTip:Constants.NoHistoryRecord==err?Constants.NoNewTip:Constants.netFailTip,
            });
        });
    }

    /**
     * 点击了菜单
     * @param menuTitle
     * @private
     */
    _onClickMenu(menuTitle) {
        switch (menuTitle) {
            case "查快递":
                this.props.navigator.push({
                    component: SearchMainPage,
                    params: {
                        'title': menuTitle,
                        'theme': this.state.theme,
                    }
                })
                break;
            case "寄快递":
                this.props.navigator.push(
                    {
                        component: SendMainPage, // 要跳转的版块
                        params: {
                            'url': Constants.ExpressPhoneURL,
                            'title': menuTitle,
                            'theme': this.state.theme,
                        }
                    }
                );
                break;
            case "扫码":
                this.props.navigator.push({
                    component: QRScannerPage,
                    params: {
                        'title': menuTitle,
                        'theme': this.state.theme,
                    }
                })
                break;
            default:
                break;
        }
    }

    /**
     * 点击了广告
     * @param url
     * @param title
     * @private
     */
    _onClickAd(url, title) {
        this.props.navigator.push(
            {
                component: WebViewPage, // 要跳转的版块
                params: {
                    'url': url,
                    'title': title,
                    'theme': this.state.theme,
                }
            }
        );
    }

    /**
     * 点击了item
     * @param rowData
     * @private
     */
    _onclickItem(rowData) {
        let companyModel = new CompanyModel(rowData.ShipperCode, rowData.ShipperName, rowData.Logo, rowData.LogisticCode);
        this.props.navigator.push({
            component: SearchResultPage,
            params: {
                'title': "物流详情",
                'theme': this.state.theme,
                'companyModel': companyModel,
            }
        })
    }

    /**
     * 点击了删除
     * @param rowData
     * @private
     */
    _onClickDelete(rowData, rowId) {
        //删除本地数据
        historySearchDao.removeLocalSearchDataByKeyId(Constants.SeachHistroyKey, rowData.ShipperCode + rowData.LogisticCode);
        //深拷贝
        let traceDatas = JSON.parse(JSON.stringify(this.state.traceDatas));
        traceDatas.splice(rowId, 1);
        this.setState({
            traceDatas: traceDatas,
            dataSource: this.state.dataSource.cloneWithRows(traceDatas),
            emptyOrFailTip:Constants.NoNewTip,
            isEmptyOrFail: traceDatas.length > 0 ? false : true,
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    },
    menuImageStyles: {
        width: 38,
        height: 38,
        padding: 8
    },
    menuFontStyles: {
        fontSize: 16,
        color: Colors.white,
        marginTop: 8
    },
    menuItemStyles: {
        alignItems: 'center'
    },
    menuContainerStyles: {
        height: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    listViewStyle: {
        backgroundColor: Colors.white, marginLeft: 10, marginRight: 10,
        marginVertical: 3,
        borderColor: Colors.lightgray,
        borderStyle: null,
        borderWidth: 0.5,
        borderRadius: 2,
        shadowColor: Colors.gray,
        shadowOffset: {width: 0.5, height: 0.5},
        shadowOpacity: 0.4,
        shadowRadius: 1,
        elevation: 2
    },
    itemTopStyles: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
})
