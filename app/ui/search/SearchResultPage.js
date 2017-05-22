/**
 * Created by hisign on 2017/5/24.
 * 搜索结果
 */
import React, {Component} from "react";
import {DeviceEventEmitter,Image, ListView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import NavigationBar from "../../common/NavigationBar";
import ViewUtils from "../../util/ViewUtils";
import GlobalStyles from "../../res/styles/GlobalStyles";
import Colors from "../../res/Colors";
import Constants from "../../res/Constants";
import BaseCommon from "../../common/BaseCommon";
import Md5Utils from "../../util/Md5Utils";
import HistorySearchDao from "../../dao/HistorySearchDao";
import TracesDataDao from "../../dao/TracesDataDao";
import InputRemarkPage from "./InputRemarkPage";
var Buffer = require('buffer').Buffer;
var md5 = new Md5Utils();
var historySearchDao = new HistorySearchDao();
var tracesDataDao = new TracesDataDao();

export default class SearchResultPage extends Component {
// 初始化模拟数据
    constructor(props) {
        super(props);
        this.baseCommon = new BaseCommon({...props, backPress: (e) => this.onBackPress(e)});
        this.state = {
            canGoBack: false,
            title: this.props.title,
            companyModel: this.props.companyModel,
            refreshing: true,
            failStatue: false,
            emptyStatue: false,
            traceData: null,
            stateCN:"",
            stateColor:null,
            inputRemarkViewVisible:false,
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
        };
    }

    componentDidMount() {
        this.baseCommon.componentDidMount();
        //保存搜索记录到本地
        historySearchDao.saveSearchDataToLocal(this.state.companyModel.code + this.state.companyModel.expNo, this.state.companyModel)
        //获取在线物流轨迹
        this._searchTracesData(this.state.companyModel.code, this.state.companyModel.expNo);
    }

    componentWillUnmount() {
        this.baseCommon.componentWillUnmount();
        //发送首页刷新通知
        DeviceEventEmitter.emit(Constants.HomeRefreshEventKey,Constants.HomeRefreshEventKey);
    }

    onBackPress(e) {
        this.props.navigator.pop();
        return true;
    }

    /**
     * 单号识别获取快递公司列表
     * @param expNo
     * @private
     */
    _searchTracesData(expCode, expNo) {
        this.updateStatue(true, false, false, null);
        tracesDataDao.loadTracesData(expCode, expNo).then((responseJson) => {
            if (responseJson && responseJson.Success) {
                // 更新物流状态
                this.setState({
                    stateCN: responseJson.stateCN,
                    stateColor: responseJson.stateColor,
                });
                //轨迹
                if (responseJson.Traces.length > 0) {
                    let traceData = responseJson.Traces.reverse();
                    //更新状态
                    this.updateStatue(false, false, false, traceData);
                    // 更新数据源
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(traceData)
                    });
                } else {
                    //空状态
                    this.updateStatue(false, false, true, null);
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows([])
                    });
                }
            } else {
                //更新状态
                this.updateStatue(false, false, true, null);
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows([])
                });
            }
        }).catch((error) => {
            //更新状态
            this.updateStatue(false, true, false, null);
        });
    }

    render() {
        let refreshingView = this.state.refreshing ? this.renderSearchingView() : null;
        let expressResultView = this.state.traceData ? this.renderExpressResultView() : null;
        let failView = this.state.failStatue ? this.renderErrorView() : null;
        let emptyView = this.state.emptyStatue ? this.renderEmptyView() : null;
        return (
            <View style={GlobalStyles.listView_container}>
                {/*标题*/}
                <NavigationBar
                    navigator={this.props.navigator}
                    popEnabled={false}
                    style={this.props.theme.styles.navBar}
                    leftButton={ViewUtils.getLeftButton(() => this.onBackPress())}
                    title={this.state.title}
                />
                {/*快递公司标题*/}
                {this.renderCompanyView()}
                {/*加载中*/}
                {refreshingView}
                {/*物流轨迹*/}
                {expressResultView}
                {/*网络问题*/}
                {failView}
                {/*结果为空*/}
                {emptyView}
                {/*输入备注*/}
                <InputRemarkPage
                    visible={this.state.inputRemarkViewVisible}
                    {...this.props}
                    onClose={() => {
                        this.setState({inputRemarkViewVisible: false})
                    }}/>
            </View>
        );
    }


    /**
     * 快递公司view
     * @returns {XML}
     */
    renderCompanyView() {
        let companyModel = this.state.companyModel;
        let logo=companyModel.logo?{uri: Constants.LogoBaseUrl + companyModel.logo}:require('../../res/images/ic_logo_default.png');
        return <View style={styles.companyViewStyles}>
            <View style={{
                flexDirection: 'row',
                alignItems: "center",
            }}>
                <Image source={logo}
                       style={{width: 40, height: 40, borderRadius: 20, marginRight: 10}}/>
                <View>
                    <Text style={{color: Colors.black}}>{companyModel.name}</Text>
                    <Text style={{color: Colors.gray}}>{companyModel.expNo}</Text>
                </View>
            </View>
            <Text style={{color: this.state.stateColor}}>{this.state.stateCN}</Text>
        </View>
    }

    /**
     *加载中view
     */
    renderSearchingView() {
        return <View style={{alignItems: 'center'}}>
            <Image source={require("../../res/images/ic_searching.png")}
                   style={{width: 100, height: 100, marginBottom: 10}} resizeMode={'contain'}/>
            <Text>{Constants.SearchingTip}</Text>
        </View>
    }

    /**
     * 加载物流轨迹
     * @returns {XML}
     */
    renderExpressResultView() {
        return <View style={{flex: 1}}>
            {/*上部分*/}
            <ListView
                style={styles.listViewStyle}
                dataSource={this.state.dataSource}
                renderRow={(rowData, sectionId, rowId) => this.renderRow(rowData, sectionId, rowId)}
            />
            {/*下部分*/}
            <View style={{
                width: GlobalStyles.window_width,
                alignItems: 'center',
                position: 'absolute',
                paddingBottom: 10,
                bottom: 0,
                backgroundColor: Colors.lightgray
            }}>
                <TouchableOpacity activeOpacity={0.8} style={[styles.remarkViewStyle2,{backgroundColor:this.props.theme.themeColor}]}
                                  onPress={() => this._onclickRemark()}>
                    <Text style={{color: Colors.white}}>{Constants.RemarkTip}</Text>
                </TouchableOpacity>
            </View>
        </View>
    }

    renderRow(rowData, sectionId, rowID) {
        console.log(sectionId + ":" + rowID);
        let checkImg = rowID == 0 ? require('../../res/images/ic_logistics_blue.png') : require('../../res/images/ic_logistics_grey.png');
        return <View style={{backgroundColor: Colors.white, flexDirection: 'row'}}>
            {/*左部分*/}
            <View>
                <View style={{
                    marginLeft: 17,
                    width: 1,
                    height: 80,
                    backgroundColor: Colors.gray,
                    marginTop: rowID == 0 ? 6 : 0
                }}></View>
                <Image source={checkImg}
                       style={{width: 15, height: 15, position: 'absolute', top: 6, marginLeft: 10, marginRight: 5}}/>
            </View>
            {/*右部分*/}
            <View style={{marginLeft: 15, marginTop: 5, marginRight: 20, marginBottom: 10}}>
                <Text
                    numberOfLines={3}
                    style={{color: rowID == 0 ? Colors.black : Colors.gray}}>{rowData.AcceptStation}</Text>
                <Text
                    style={{color: rowID == 0 ? Colors.black : Colors.gray}}>{rowData.AcceptTime}</Text>
            </View>
        </View>
    }

    /**
     * 没查到物流信息view
     */
    renderEmptyView() {
        return <View style={{backgroundColor: Colors.white}}>
            {/*上部分*/}
            <View style={{alignItems: 'center'}}>
                <Image source={require('../../res/images/ic_no_exist.png')}
                       style={{width: 50, height: 50, marginTop: 10}}
                       resizeMode={'contain'}/>
                <Text style={{padding: 8, color: Colors.black}}>{Constants.ErrorTip}</Text>
                <TouchableOpacity activeOpacity={0.8} style={[styles.remarkViewStyle,{backgroundColor:this.props.theme.themeColor}]}
                                  onPress={() => this._onclickRemark()}>
                    <Text style={{color: Colors.white}}>{Constants.RemarkTip}</Text>
                </TouchableOpacity>
            </View>
            {/*下部分*/}
            <View style={styles.emptyBottomStyle}>
                <Text
                    style={{color: Colors.lightred, fontSize: 12, marginTop: 2}}>{Constants.EmptyReasonTitleTip}</Text>
                <Text style={{color: Colors.black, fontSize: 12, marginTop: 2}}>{Constants.EmptyReasonTip}</Text>
            </View>
        </View>
    }

    /**
     * 网络错误View
     */
    renderErrorView() {
        return <View style={{alignItems: 'center'}}>
            <Image source={require('../../res/images/ic_result_error.png')} style={{width: 100, height: 120}}
                   resizeMode={'contain'}/>
            <Text style={{padding: 8, color: Colors.gray}}>{Constants.EmptyTip}</Text>
            <TouchableOpacity activeOpacity={0.8} style={[styles.retryViewStyle,{backgroundColor:this.props.theme.themeColor}]} onPress={() => this._onclickRetry()}>
                <Text style={{color: Colors.white}}>{Constants.RetryTip}</Text>
            </TouchableOpacity>
        </View>
    }

    /**
     * 更新status
     * @param refreshing
     * @param failStatue
     * @param emptyStatue
     * @param traceData
     */
    updateStatue(refreshing, failStatue, emptyStatue, traceData) {
        this.setState({
            refreshing: refreshing,
            failStatue: failStatue,
            emptyStatue: emptyStatue,
            traceData: traceData,
        })
    }

    /**
     * 点击重新尝试
     * @private
     */
    _onclickRetry() {
        //获取在线物流轨迹
        this._searchTracesData(this.state.companyModel.code, this.state.companyModel.expNo);
    }

    /**
     * 点击运单备注
     * @private
     */
    _onclickRemark() {
       this.setState({
           inputRemarkViewVisible:true
       })
    }
}
const styles = StyleSheet.create({
    companyViewStyles: {
        flexDirection: 'row',
        alignItems: "center",
        padding: 8,
        borderBottomWidth: 0.5,
        borderColor: Colors.lightgray,
        justifyContent: 'space-between'
    },
    listViewStyle: {
        marginTop: 10,
        marginBottom: 55,
    },
    retryViewStyle: {
        borderRadius: 2,
        backgroundColor: Colors.blue,
        width: GlobalStyles.window_width - 30,
        height: 35,
        marginTop: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    remarkViewStyle: {
        borderRadius: 2,
        backgroundColor: Colors.blue,
        width: 150,
        height: 35,
        marginTop: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    remarkViewStyle2: {
        borderRadius: 2,
        backgroundColor: Colors.blue,
        width: GlobalStyles.window_width - 20,
        height: 35,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyBottomStyle: {
        marginTop: 10,
        padding: 10,
        borderTopWidth: 1,
        borderColor: Colors.lightgray
    },
})