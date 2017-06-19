易快递，一款物流查询跨平台app，功能虽简单，但“麻雀虽小，五脏俱全”，是本人基于Facebook出品的ReactNative开发的第一个跨平台app，Learn once, write anywhere。
>本文已授权微信公众号：Android经验分享，在微信公众号平台原创首发。

[安装地址](https://fir.im/jeasycheck)

*国际案例，有图有真相：*


![首页效果图](http://upload-images.jianshu.io/upload_images/1964096-b3ea2c8c668c24db.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


![查快递和物流详情](http://upload-images.jianshu.io/upload_images/1964096-0c5aeaa4a48c5163.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


![寄快递和扫描](http://upload-images.jianshu.io/upload_images/1964096-abfac1aab4c92492.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


![关于和自定义主题](http://upload-images.jianshu.io/upload_images/1964096-a06942bb3f2e04b4.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



*目前模块包括：*
- 首页：首页顶部主要包括了“查快递”、”寄快递“、“扫码”三大功能模块，中间有公益爱心捐款的轮播广告，下部主要是最近查询快递的实时物流信息
- 查快递：数据用了快递鸟的运单识别、实时查询api，支持扫码识别，支持运单号识别，选择快递公司查询
- 寄快递：目前主要是一个列表展示了各大主流快递公司的客服电话，如果要调用api下单，信息界面太烦躁，有待后面功能完善
- 扫码：主要是调用摄像头快速识别运单号查询快递
- 自定义颜色主题

*技术框架：*
- "buffer": "^5.0.6",（base64编码）
-  "react": "16.0.0-alpha.6",
- "react-native": "0.44.2",
- "react-native-camera": "^0.6.0",(扫码)
- "react-native-deprecated-custom-components": "^0.1.0",
- "react-native-easy-toast": "^1.0.6",
- "react-native-parallax-scroll-view": "^0.19.0",
- "react-native-storage": "^0.2.2",
- "react-native-swipeout": "^2.1.1"（滑动删除）

[仓库地址](https://github.com/jaydenxiao2016/JEasyCheck)

>项目运行步骤如下：
- 第一步：npm install
- 第二补：react-native link
- 第三步：react-native run-android(或 run-ios)
理论兼容Android/ios,但没在ios真机上试过。

*总结心得：*
这个是我开源的第一个用 RN从零到一 写的项目了，前面也有仿写过美团app，但只是注重UI，没涉及的业务的代码编写，而这一个"易查询"app,无论是ui、业务和流行的控件都有涉及。

1、项目结构主要沿用了类似android项目的结构，如下图，
主要特点：
- 包主要分为common(通用控件)、dao(数据层)、model(实体类)、res(图片和样式和常量)、ui(js页面)、util(通用工具)
- 存放页面的js文件夹命名以page结尾
-需要复用的组件抽取成单独一个类，存放到 common包中。
- 图片、常量、颜色、公共样式等资源，分别用一个入口类管理，就和 Android 中管理资源的做法类似，这样更易维护。

![项目结构](http://upload-images.jianshu.io/upload_images/1964096-505351cb3c7b463a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

2、遇到的坑
- react-native版本升级比较快，有一些控件可能在低版本存在，高版本已经独立出来了，比如，从0.44版本开始,Navigator被从react native的核心组件库中剥离到了一个名为react-native-deprecated-custom-components的单独模块中
- listview的数据源更新了，但界面没跟着调整，这要涉及到数据深浅拷贝的问题，用JSON.parse(JSON.stringify(this.state.traceDatas))深拷贝能解决这个问题，具体例子可参考本项目的首页删除列表功能
- 打包android apk时不能直接用android studio的可视化generate signed APK打包方式，这样打包的apk会因为缺少index.android.bundle文件打开时直接奔溃，尽量用RN官方推荐的方式打包
- 还有很多细节的东西，一时半会也说不清楚，只有真正动手做了才能领会

更多精彩文章请关注微信公众号"**Android经验分享**"：这里将长期为您分享Android高手经验、中外开源项目、源码解析、框架设计和Android好文推荐！

![扫一扫加我哦](http://upload-images.jianshu.io/upload_images/1964096-6b04d2e7cff6d7c7.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
