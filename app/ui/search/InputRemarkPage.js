/**
 * 输入备注
 * @hisign
 * **/
import React, {Component} from "react";
import {Modal, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import HistorySearchDao from "../../dao/HistorySearchDao";
var historySearchDao=new HistorySearchDao();
export default class InputRemarkPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            remark: "",
            companyModel:this.props.companyModel,
        };
    }

    componentDidMount() {
        historySearchDao.loadRemarkDataFromLocalById(this.state.companyModel.code + this.state.companyModel.expNo)
            .then((remark) => {
                this.setState({
                    remark: remark,
                })
            }).catch((err)=>{})
    }

    _onClickCancel() {
        this.props.onClose();
    }

    _onClickSure() {
        historySearchDao.saveRearkDataToLocal(this.state.companyModel.code + this.state.companyModel.expNo, this.state.remark)
        this.props.onClose();
    }

    renderRemarkInputView() {
        return <Modal
            animationType='fade'
            transparent={true}
            visible={this.state.show}
            onShow={() => {
            }}
            onRequestClose={() => {
            }}>
            <View style={styles.modalStyle}>
                <View style={styles.subView}>
                    <Text style={styles.titleText}>
                        请输入备注
                    </Text>
                    <TextInput
                        underlineColorAndroid='transparent'
                        autoFocus={true}
                        placeholder={'最多输入15个字符'}
                        maxLength={15}
                        onChangeText={(text) => {
                            this.setState({
                                remark: text,
                            });
                        }
                        }
                        value={this.state.remark}
                        style={styles.contentText}/>
                    <View style={styles.horizontalLine}/>
                    <View style={styles.buttonView}>
                        <TouchableOpacity underlayColor='transparent'
                                          style={styles.buttonStyle}
                                          onPress={() => this._onClickCancel()}>
                            <Text style={styles.buttonText}>
                                取消
                            </Text>
                        </TouchableOpacity>
                        <View style={styles.verticalLine}/>
                        <TouchableOpacity underlayColor='transparent'
                                          style={styles.buttonStyle}
                                          onPress={() => this._onClickSure()}>
                            <Text style={styles.buttonText}>
                                确定
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    }

    render() {
        let view = this.props.visible ?
            this.renderRemarkInputView() : null;
        return view
    }

}
const styles = StyleSheet.create({
    // modal的样式
    modalStyle: {
        backgroundColor: 'rgba(52, 52, 52, 0.5)',
        alignItems: 'center',
        paddingTop:130,
        flex: 1,
    },
    // modal上子View的样式
    subView: {
        marginLeft: 50,
        marginRight: 50,
        backgroundColor: '#fff',
        alignSelf: 'stretch',
        justifyContent: 'center',
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: '#ccc',
    },
    // 标题
    titleText: {
        marginTop: 10,
        marginBottom: 5,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    // 内容
    contentText: {
        margin: 8,
        fontSize: 14,
        textAlign: 'left',
        padding: 4,
        borderColor: '#ccc',
        borderRadius: 2,
        borderWidth: 1,
        height: 40,
    },
    // 水平的分割线
    horizontalLine: {
        marginTop: 5,
        height: 0.5,
        backgroundColor: '#ccc',
    },
    // 按钮
    buttonView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonStyle: {
        flex: 1,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // 竖直的分割线
    verticalLine: {
        width: 0.5,
        height: 40,
        backgroundColor: '#ccc',
    },
    buttonText: {
        fontSize: 16,
        color: '#3393F2',
        textAlign: 'center',
    },
})