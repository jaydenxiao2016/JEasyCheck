/**
 * Created by hisign on 2017/5/25.
 * 根据运单号和快递公司编码查询快递轨迹
 */
import React from "react";
import Md5Utils from "../util/Md5Utils";
import Constants from "../res/Constants";
import Colors from "../res/Colors";
import HistorySearchDao from "./HistorySearchDao";
import SortUtils from "../util/SortUtils";
var Buffer = require('buffer').Buffer;
var md5 = new Md5Utils();
var historySearchDao;
export default class TracesDataDao {
    constructor() {
        historySearchDao = new HistorySearchDao();
    }

    /**
     * 单号识别获取快递公司列表
     * @param expNo
     * @private
     */
    _getExpressData(expNo) {
        return new Promise((resolve, reject) => {
                let RequestData = "{'LogisticCode':'" + expNo + "'}"
                //电商Sign签名生成
                let dataSign = new Buffer(md5.hex_md5(RequestData + Constants.AppKey)).toString('base64');
                fetch(Constants.ExpressReqURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: 'RequestData=' + RequestData + '&EBusinessID=' + Constants.EBusinessID + '&RequestType=' + '2002' + '&DataSign=' + dataSign + '&DataType=' + '2'
                }).then((response) => response.json())
                    .then((responseJson) => {
                            console.log(responseJson);
                            resolve(responseJson);
                        }
                    )
                    .catch((error) => {
                        console.log("接口访问错误" + error)
                        reject(error);
                    });
            }
        )
    }

    /**
     * 根据快递公司编码和运单号加载物流轨迹信息
     * @param expCode
     * @param expNo
     */
    loadTracesData(expCode, expNo) {
        return new Promise((resolve, reject) => {
            let RequestData = "{'OrderCode':'','ShipperCode':'" + expCode + "','LogisticCode':'" + expNo + "'}";
            //电商Sign签名生成
            let dataSign = new Buffer(md5.hex_md5(RequestData + Constants.AppKey)).toString('base64');
            fetch(Constants.ExpressReqURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'RequestData=' + RequestData + '&EBusinessID=' + Constants.EBusinessID + '&RequestType=' + '1002' + '&DataSign=' + dataSign + '&DataType=' + '2'
            }).then((response) => response.json())
                .then((responseJson) => {
                        console.log(responseJson);
                        if (responseJson && responseJson.Success) {
                            //快递状态
                            switch (responseJson.State) {
                                case "2":
                                    responseJson.stateCN = Constants.Onload;
                                    responseJson.stateColor = Colors.lightblue;
                                    break
                                case "3":
                                    responseJson.stateCN = Constants.Signed
                                    responseJson.stateColor = Colors.orange;
                                    break
                                case "4":
                                    responseJson.stateCN = Constants.WrongBag
                                    responseJson.stateColor = Colors.lightred;
                                    break
                                default:
                                    responseJson.stateCN = Constants.WrongBag;
                                    responseJson.stateColor = Colors.lightred;
                                    break
                            }
                        }
                        resolve(responseJson)
                    }
                )
                .catch((error) => {
                    reject(error);
                });
        })
    }

    /**
     * 通过查询记录获取快递轨迹
     */
    loadTracesDataByRecentSearch() {
        return new Promise((resolve, reject) => {
            historySearchDao.loadAllSearchDataFromLocal(Constants.SeachHistroyKey).then(companyModels => {
                if (companyModels && companyModels.length > 0) {
                    let tracesData = [];
                    let errorStr = null;
                    let total = 0;
                    for (let i = 0; i < companyModels.length; i++) {
                        this.loadTracesData(companyModels[i].code, companyModels[i].expNo)
                            .then((responseJson) => {
                                total++;
                                if (responseJson && responseJson.Success) {
                                    //快递名称
                                    responseJson.ShipperName = companyModels[i].name;
                                    //快递logo
                                    responseJson.Logo = companyModels[i].logo;
                                    //最近一次查询时间
                                    responseJson.RecentTime = companyModels[i].RecentTime;
                                    //每条记录塞成数组
                                    tracesData.push(responseJson);
                                    if (total == companyModels.length) {
                                        //根据时间排序
                                        tracesData.sort(new SortUtils().compareDown(tracesData, "RecentTime"));
                                        resolve(tracesData);
                                    }
                                } else {
                                    errorStr = +responseJson.Reason;
                                    if (total == companyModels.length) {
                                        reject(errorStr);
                                    }
                                }
                            }).catch((err) => {
                            total++;
                            errorStr = +err
                            if (total == companyModels.length) {
                                reject(errorStr);
                            }
                        })
                    }
                } else {
                    reject(Constants.NoHistoryRecord);
                }
            }).catch((err) => {
                reject(Constants.NoHistoryRecord);
            });
        })
    }
}